'use client';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, Lock, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatAmountForStripe } from '@/lib/stripe-helper';
import { formatPrice } from '@/lib/formatPrice';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

function CheckoutForm({ course, user }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [billingDetails, setBillingDetails] = useState({
    name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    if (!stripe || !elements) {
      setError('Stripe has not loaded yet. Please try again.');
      setLoading(false);
      return;
    }

    // Handle free courses
    if (course.price === 0) {
      try {
        // Create enrollment for free course
        const enrollmentResponse = await fetch('/api/enroll', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            courseId: course.id,
            userId: user?.id,
            paymentIntentId: null,
            amount: 0,
            currency: 'usd',
            isFree: true
          }),
        });

        const enrollmentResult = await enrollmentResponse.json();
        
        if (!enrollmentResult.success) {
          throw new Error(enrollmentResult.error || 'Failed to create enrollment');
        }

        // Redirect to success page
        router.push(`/payment/success?courseId=${course.id}&free=true`);
        return;
      } catch (err) {
        setError('Failed to enroll in free course: ' + err.message);
        setLoading(false);
        return;
      }
    }

    const cardElement = elements.getElement(CardElement);

    try {
      // Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: formatAmountForStripe(course.price, 'usd'),
          currency: 'usd',
          metadata: {
            courseId: course.id,
            courseName: course.title,
            userName: billingDetails.name,
            userEmail: billingDetails.email,
            userId: user?.id,
          },
        }),
      });

      const { clientSecret, error: intentError } = await response.json();

      if (intentError) {
        throw new Error(intentError);
      }

      // Confirm payment
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: billingDetails.name,
              email: billingDetails.email,
              phone: billingDetails.phone,
            },
          },
        }
      );

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      if (paymentIntent.status === 'succeeded') {
        // Create enrollment in database
        try {
          const enrollmentResponse = await fetch('/api/enroll', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              courseId: course.id,
              userId: user?.id,
              paymentIntentId: paymentIntent.id,
              amount: course.price,
              currency: 'usd',
              isFree: false
            }),
          });

          const enrollmentResult = await enrollmentResponse.json();
          
          if (!enrollmentResult.success) {
            // Still redirect to success page even if enrollment fails
            // This can be handled on the success page
          }
        } catch (enrollmentError) {
          // Continue to success page, handle enrollment on success page if needed
        }

        // Redirect to success page
        router.push(
          `/payment/success?courseId=${course.id}&paymentIntentId=${paymentIntent.id}`
        );
      }
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          {course.price === 0 ? 'Enroll Now' : 'Payment Details'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Billing Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Billing Information</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={billingDetails.name}
                  onChange={(e) => setBillingDetails(prev => ({ ...prev, name: e.target.value }))}
                  required
                  disabled={loading}
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={billingDetails.email}
                  onChange={(e) => setBillingDetails(prev => ({ ...prev, email: e.target.value }))}
                  required
                  disabled={loading}
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={billingDetails.phone}
                  onChange={(e) => setBillingDetails(prev => ({ ...prev, phone: e.target.value }))}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Payment Method (only for paid courses) */}
          {course.price > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Payment Method</h3>
              
              <div className="border rounded-lg p-4">
                <Label className="text-sm font-medium mb-3 block">
                  Card Information
                </Label>
                <CardElement options={cardElementOptions} className="p-3" />
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={!stripe || loading}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Lock className="h-4 w-4 mr-2" />
                {course.price === 0 ? 'Enroll for Free' : `Pay ${formatPrice(course.price)}`}
              </div>
            )}
          </Button>

          {course.price > 0 && (
            <p className="text-xs text-gray-500 text-center">
              Your payment information is secure and encrypted.
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

export function PurchaseForm({ course, user }) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm course={course} user={user} />
    </Elements>
  );
}
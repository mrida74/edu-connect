'use client';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, ArrowLeft, RefreshCcw, Mail } from 'lucide-react';
import Link from 'next/link';

export default function PaymentErrorPage() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');
  const error = searchParams.get('error');
  const paymentIntentId = searchParams.get('payment_intent');

  const getErrorMessage = (errorCode) => {
    const errorMessages = {
      'card_declined': 'Your card was declined. Please try a different payment method.',
      'insufficient_funds': 'Insufficient funds. Please check your account balance.',
      'expired_card': 'Your card has expired. Please use a different card.',
      'incorrect_cvc': 'The security code is incorrect. Please check and try again.',
      'processing_error': 'There was an error processing your payment. Please try again.',
      'authentication_required': 'Additional authentication is required. Please try again.',
    };
    
    return errorMessages[errorCode] || 'An unexpected error occurred during payment.';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Error
          </h1>
          <p className="text-gray-600">
            We encountered an issue processing your payment.
          </p>
        </div>

        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {getErrorMessage(error)}
          </AlertDescription>
        </Alert>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What can you do?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium text-gray-900">Try again</h4>
                <p className="text-sm text-gray-600">
                  Most payment issues are temporary. You can try processing the payment again.
                </p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-medium text-gray-900">Use a different payment method</h4>
                <p className="text-sm text-gray-600">
                  Try using a different credit card or payment method.
                </p>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-medium text-gray-900">Contact your bank</h4>
                <p className="text-sm text-gray-600">
                  Sometimes banks block online transactions for security. Contact your bank to authorize the payment.
                </p>
              </div>
            </div>
            
            {paymentIntentId && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Reference ID:</strong> {paymentIntentId}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Please include this ID when contacting support.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
            {courseId && (
              <Link href={`/courses/${courseId}/purchase`}>
                <Button className="w-full sm:w-auto">
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </Link>
            )}
            
            <Link href={courseId ? `/courses/${courseId}` : '/courses'}>
              <Button variant="outline" className="w-full sm:w-auto">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {courseId ? 'Back to Course' : 'Browse Courses'}
              </Button>
            </Link>
          </div>
          
          <div className="text-center">
            <Link href="/support">
              <Button variant="ghost" className="text-blue-600">
                <Mail className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err) {
    console.log('Webhook signature verification failed.', err.message);
    
    // For development testing - allow manual test events
    if (!signature) {
      console.log('Manual test detected - bypassing signature verification');
      return NextResponse.json({ 
        received: true, 
        message: 'Manual test received (no signature verification)' 
      });
    }
    
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful!', paymentIntent.id);
      // TODO: Handle successful payment (update database, send email, etc.)
      break;
    
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed!', failedPayment.id);
      // TODO: Handle failed payment
      break;
    
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Checkout session completed!', session.id);
      // TODO: Handle successful checkout (enroll user in course)
      break;
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
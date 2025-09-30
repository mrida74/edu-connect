import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { amount, currency = 'usd' , metadata } = await request.json();

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount / 100, // Convert to dollars
      currency: currency,
      metadata: metadata || {},
    });

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Payment Intent Error:', error);
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}
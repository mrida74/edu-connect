import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(request, { params }) {
  try {
    const { paymentIntentId } = params;

    // Payment Intent retrieve করা
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Customer information (if exists)
    let customer = null;
    if (paymentIntent.customer) {
      customer = await stripe.customers.retrieve(paymentIntent.customer);
    }

    // Payment Method information
    let paymentMethod = null;
    if (paymentIntent.payment_method) {
      paymentMethod = await stripe.paymentMethods.retrieve(paymentIntent.payment_method);
    }

    // Charge information (for detailed transaction data)
    const charges = await stripe.charges.list({
      payment_intent: paymentIntentId,
    });

    const paymentDetails = {
      // Basic Payment Info
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      created: paymentIntent.created,
      
      // Metadata (আমাদের custom data)
      metadata: paymentIntent.metadata,
      
      // Customer Info
      customer: customer ? {
        id: customer.id,
        email: customer.email,
        name: customer.name,
      } : null,
      
      // Payment Method Info
      paymentMethod: paymentMethod ? {
        id: paymentMethod.id,
        type: paymentMethod.type,
        card: paymentMethod.card ? {
          brand: paymentMethod.card.brand,
          last4: paymentMethod.card.last4,
          exp_month: paymentMethod.card.exp_month,
          exp_year: paymentMethod.card.exp_year,
        } : null,
      } : null,
      
      // Transaction Details
      charges: charges.data.map(charge => ({
        id: charge.id,
        amount: charge.amount,
        currency: charge.currency,
        status: charge.status,
        receipt_url: charge.receipt_url,
        created: charge.created,
        outcome: charge.outcome,
      })),
    };

    return NextResponse.json({
      success: true,
      data: paymentDetails
    });

  } catch (error) {
    console.error('Payment retrieval error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to retrieve payment information' 
      },
      { status: 500 }
    );
  }
}
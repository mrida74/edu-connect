'use client';
import { useState } from 'react';

export default function StripeTestPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testPaymentIntent = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 50, // $50
          currency: 'usd'
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    }
    setLoading(false);
  };

  const testWebhook = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'test',
          data: { message: 'webhook test' }
        }),
      });

      const data = await response.json();
      setResult({ webhook: data });
    } catch (error) {
      setResult({ error: error.message });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">🧪 Stripe Integration Test</h1>
      
      <div className="grid gap-4 mb-8">
        <button
          onClick={testPaymentIntent}
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : '🔧 Test Payment Intent API'}
        </button>
        
        <button
          onClick={testWebhook}
          disabled={loading}
          className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : '🎣 Test Webhook Endpoint'}
        </button>
      </div>

      {result && (
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-bold mb-2">Test Result:</h3>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-bold mb-2">📋 Test Instructions:</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li><strong>Payment Intent Test:</strong> Creates a $50 payment intent</li>
          <li><strong>Webhook Test:</strong> Tests webhook endpoint directly</li>
          <li><strong>Check Console:</strong> Look at both browser console and terminal</li>
          <li><strong>Stripe Terminal:</strong> Should show webhook events if listener running</li>
        </ol>
      </div>
    </div>
  );
}
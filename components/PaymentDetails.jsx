'use client';

import { useState, useEffect } from 'react';

const PaymentDetails = ({ paymentIntentId }) => {
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/payment/${paymentIntentId}`);
        const result = await response.json();

        if (result.success) {
          setPaymentData(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Failed to fetch payment details');
      } finally {
        setLoading(false);
      }
    };

    if (paymentIntentId) {
      fetchPaymentDetails();
    }
  }, [paymentIntentId]);

  if (loading) return <div>Loading payment details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!paymentData) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Payment Details</h3>
      
      {/* Payment Summary */}
      <div className="mb-4">
        <p><strong>Payment ID:</strong> {paymentData.id}</p>
        <p><strong>Amount:</strong> ${(paymentData.amount / 100).toFixed(2)}</p>
        <p><strong>Currency:</strong> {paymentData.currency.toUpperCase()}</p>
        <p><strong>Status:</strong> 
          <span className={`ml-2 px-2 py-1 rounded text-sm ${
            paymentData.status === 'succeeded' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {paymentData.status}
          </span>
        </p>
        <p><strong>Date:</strong> {new Date(paymentData.created * 1000).toLocaleDateString()}</p>
      </div>

      {/* Customer Info */}
      {paymentData.customer && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Customer Information</h4>
          <p><strong>Email:</strong> {paymentData.customer.email}</p>
          {paymentData.customer.name && (
            <p><strong>Name:</strong> {paymentData.customer.name}</p>
          )}
        </div>
      )}

      {/* Payment Method */}
      {paymentData.paymentMethod && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Payment Method</h4>
          <p><strong>Type:</strong> {paymentData.paymentMethod.type}</p>
          {paymentData.paymentMethod.card && (
            <div>
              <p><strong>Card:</strong> {paymentData.paymentMethod.card.brand.toUpperCase()} 
                **** **** **** {paymentData.paymentMethod.card.last4}</p>
              <p><strong>Expires:</strong> {paymentData.paymentMethod.card.exp_month}/{paymentData.paymentMethod.card.exp_year}</p>
            </div>
          )}
        </div>
      )}

      {/* Metadata (Course Info) */}
      {paymentData.metadata && Object.keys(paymentData.metadata).length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Course Information</h4>
          {paymentData.metadata.courseId && (
            <p><strong>Course ID:</strong> {paymentData.metadata.courseId}</p>
          )}
          {paymentData.metadata.userId && (
            <p><strong>User ID:</strong> {paymentData.metadata.userId}</p>
          )}
        </div>
      )}

      {/* Receipt Link */}
      {paymentData.charges && paymentData.charges[0]?.receipt_url && (
        <div className="mt-4">
          <a 
            href={paymentData.charges[0].receipt_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            View Stripe Receipt
          </a>
        </div>
      )}
    </div>
  );
};

export default PaymentDetails;
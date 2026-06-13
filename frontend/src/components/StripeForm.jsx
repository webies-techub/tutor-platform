import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

export default function StripeForm({ onSuccess, label = 'Pay now', disabled = false }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setError(null);
    setLoading(true);
    try {
      const { error: submitErr } = await elements.submit();
      if (submitErr) { setError(submitErr.message); setLoading(false); return; }

      const { error: confirmErr, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (confirmErr) {
        setError(confirmErr.message);
      } else if (paymentIntent?.status === 'succeeded') {
        await onSuccess(paymentIntent.id);
      } else {
        setError('Payment did not complete. Please try again.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={disabled || loading || !stripe}
        className="w-full btn btn-primary disabled:opacity-50"
      >
        {loading ? 'Processing…' : label}
      </button>
    </form>
  );
}

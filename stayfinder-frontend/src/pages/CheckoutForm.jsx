import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '17px',
      color: '#222',
      fontFamily: 'inherit',
      '::placeholder': { color: '#bbb' },
      letterSpacing: '0.5px',
      padding: '10px 0'
    },
    invalid: { color: '#FF385C', iconColor: '#FF385C' },
  },
};

const cardStyle = {
  maxWidth: 420,
  margin: '3rem auto',
  background: '#fff',
  borderRadius: '18px',
  boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
  padding: '2.5rem 2rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

const buttonStyle = {
  background: '#FF385C',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  padding: '0.85rem 2.5rem',
  fontWeight: 'bold',
  fontSize: '1.15rem',
  cursor: 'pointer',
  marginTop: '1.5rem',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  transition: 'background 0.2s',
};

const CheckoutForm = ({ booking }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError('');
    setSuccess('');

    try {
      // 1. Get clientSecret from backend
      const { data } = await axios.post('http://localhost:5000/api/payments/create-payment-intent', {
        amount: booking.totalPrice,
      });

      const clientSecret = data.clientSecret;

      // 2. Confirm card payment
      const cardElement = elements.getElement(CardElement);
      const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (stripeError) {
        setError(stripeError.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        setSuccess('✅ Payment successful! Your booking is confirmed.');
        // Optionally, update booking status in your backend here
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Payment failed');
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} style={cardStyle}>
      <h2 style={{ color: '#FF385C', marginBottom: '1.5rem', fontWeight: 700 }}>Complete Payment</h2>
      <div style={{
        width: '100%',
        border: '1.5px solid #eee',
        borderRadius: 10,
        padding: '1.2rem 1rem',
        marginBottom: '1.2rem',
        background: '#fafafa'
      }}>
        <label style={{ fontWeight: 'bold', marginBottom: 8, display: 'block', color: '#444' }}>
          Card Details
        </label>
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>
      <div style={{
        width: '100%',
        background: '#f7f7f7',
        borderRadius: 8,
        padding: '1rem',
        marginBottom: '1.2rem',
        fontSize: '1.05rem',
        color: '#444'
      }}>
        <div>
          <span style={{ fontWeight: 600 }}>Total Amount:</span>
          <span style={{ float: 'right', color: '#FF385C', fontWeight: 700 }}>
            ₹{booking.totalPrice}
          </span>
        </div>
      </div>
      <button
        type="submit"
        disabled={!stripe || processing}
        style={{
          ...buttonStyle,
          background: processing ? '#ff7a94' : '#FF385C'
        }}
      >
        {processing ? 'Processing...' : `Pay ₹${booking.totalPrice}`}
      </button>
      {error && <div style={{ color: '#FF385C', marginTop: 18, fontWeight: 500 }}>{error}</div>}
      {success && <div style={{ color: 'green', marginTop: 18, fontWeight: 500 }}>{success}</div>}
    </form>
  );
};

export default CheckoutForm;
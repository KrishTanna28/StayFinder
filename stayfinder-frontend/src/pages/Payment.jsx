import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
// Import Stripe components
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm'; // You need to create this
import dayjs from 'dayjs'; // For pretty date formatting (install with npm i dayjs)

const stripePromise = loadStripe('pk_test_51BTUDGJAJfZb9HEBwDg86TN1KNprHjkfipXmEDMb0gSCassK5T3ZfxsAbcgKVmAIXF7oZ6ItlZZbXO6idTHE67IM007EwQ4uN3');

const Payment = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/bookings/${bookingId}`)
      .then(res => setBooking(res.data))
      .catch(err => console.error(err));
  }, [bookingId]);

  if (!booking) return <div>Loading...</div>;

  return (
    <div style={{
      maxWidth: 500,
      margin: '3rem auto 0 auto',
      background: '#fff',
      borderRadius: '18px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
      padding: '2.5rem 2rem 1.5rem 2rem'
    }}>
      <h2 style={{ color: '#FF385C', fontWeight: 700, marginBottom: '1.2rem', textAlign: 'center' }}>
        Payment for Booking
      </h2>
      <div style={{
        background: '#f7f7f7',
        borderRadius: 10,
        padding: '1.2rem 1rem',
        marginBottom: '1.5rem',
        fontSize: '1.08rem',
        color: '#444'
      }}>
        <div style={{ marginBottom: 8 }}>
          <span style={{ fontWeight: 600 }}>Listing:</span>
          <span style={{ float: 'right' }}>{booking.listing?.title}</span>
        </div>
        <div style={{ marginBottom: 8 }}>
          <span style={{ fontWeight: 600 }}>Dates:</span>
          <span style={{ float: 'right' }}>
            {dayjs(booking.startDate).format('DD MMM YYYY')} to {dayjs(booking.endDate).format('DD MMM YYYY')}
          </span>
        </div>
        <div>
          <span style={{ fontWeight: 600 }}>Total:</span>
          <span style={{ float: 'right', color: '#FF385C', fontWeight: 700 }}>
            ₹{booking.totalPrice}
          </span>
        </div>
      </div>
      <Elements stripe={stripePromise}>
        <CheckoutForm booking={booking} />
      </Elements>
    </div>
  );
};

export default Payment;
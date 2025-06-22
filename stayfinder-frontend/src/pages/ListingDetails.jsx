import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../index.css';
import MapView from './MapView';
import { AuthContext } from '../contexts/AuthContext'; // adjust path if needed

const ListingDetails = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const { user } = useContext(AuthContext); // get user from context
  const navigate = useNavigate();
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:5000/api/listings/${id}`)
      .then(res => setListing(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/listings/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Listing deleted!');
        navigate('/host-dashboard'); // Redirect after deletion
      } catch (err) {
        alert('Failed to delete listing');
        console.error(err);
      }
    }
  };

  const handleReserve = async () => {
    if (!user) {
      navigate('/login');
      alert('Please log in to reserve a listing.');
      return;
    }
    if (!checkin || !checkout) {
      alert('Please select check-in and check-out dates.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/bookings',
        {
          listing: listing._id,
          startDate: checkin,
          endDate: checkout,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Redirect to payment page with booking id
      navigate(`/payment/${res.data._id}`);
    } catch (err) {
      alert('Failed to create booking');
      console.error(err);
    }
  };

  console.log('Listing Details:', listing);
  console.log('Lat:', listing?.latitude, 'Lng:', listing?.longitude);

  if (!listing) return <div className="container">Loading...</div>;

  // Check if current user is the host
  const isHost = user &&
    (listing.host?._id === user.id || listing.host === user.id);

  return (
    <div className="container" style={{ width: '100%', maxWidth: '1500px', margin: '0 auto', padding: '20px', marginTop: '-100px', height: '100vh' }}>
      {listing.images && listing.images.length > 0 && (
        <img
          src={`http://localhost:5000/${listing.images[0]}`}
          alt={listing.title}
          style={{ width: '100%', maxWidth: 600, borderRadius: 8 }}
        />
      )}
      <br /><br />
      <div className='info'>
        <div>
          <h1>{listing.title}, {listing.location}</h1>
          <p><strong>Description: </strong> {listing.description}</p>
          <br />
          <br />
          <h3>Where you'll be:</h3>
          <br />
          {listing.latitude !== undefined && listing.longitude !== undefined ? (
            <MapView
              lat={listing.latitude}
              lng={listing.longitude}
              title={listing.title}
              style={{ width: '100%', height: '220px' }}
            />
          ) : (
            <p>📍 Location info not available.</p>
          )}
          {/* Show Delete and Edit buttons if user is host */}
          {isHost && (
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button
                onClick={handleDelete}
                style={{
                  background: '#FF385C',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem 2rem',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  cursor: 'pointer'
                }}
              >
                Delete Listing
              </button>
              <button
                onClick={() => window.open(`/edit-listing/${listing._id}`, '_blank')}
                style={{
                  background: '#FF385C',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem 2rem',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  cursor: 'pointer'
                }}
              >
                Edit Listing
              </button>
            </div>
          )}
        </div>
        <div style={{ marginLeft: '2rem', flex: 1 }}>
          <br />
          <strong><h2>₹{listing.pricePerNight}/night</h2></strong>
          {/* Only show booking options if user is NOT the host */}
          {!isHost && (
            <div>
              <div style={{ marginTop: '20px' }}>
                <label>
                  Check-in:
                  <input
                    type="date"
                    name="checkin"
                    value={checkin}
                    onChange={e => setCheckin(e.target.value)}
                  />
                </label>
                <br />
                <br />
                <label>
                  Check-out:
                  <input
                    type="date"
                    name="checkout"
                    value={checkout}
                    onChange={e => setCheckout(e.target.value)}
                  />
                </label>
              </div>
              <button onClick={handleReserve}>
                Reserve
              </button>
            </div>
          )}
        </div>
      </div>
      <br />
      <br />
    </div>
  );
};

export default ListingDetails;

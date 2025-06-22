import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const HostDashboard = () => {
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState('');
  const { user, setUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5000/api/listings')
      .then(res => {
        const hostListings = res.data.filter(listing => {
          if (typeof listing.host === 'object' && listing.host !== null) {
            return listing.host._id === user?.id;
          }
          return listing.host === user?.id;
        });
        setListings(hostListings);
      })
      .catch(err => console.error(err));
  }, [user]);

  const handleHomebutton = () => {
    navigate('/');
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', background: '#fafafa', minHeight: '100vh' }}>
      {/* Custom Nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <span className='logo' style={{ color: '#FF385C', fontWeight: 'bold', fontSize: '2rem', letterSpacing: '1px' }}>
          <h1 style={{ margin: 0 }}>StayFinder</h1>
        </span>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <button
            onClick={handleHomebutton}
            style={{
              background: '#FF385C',
              color: '#fff',
              border: 'none',
              borderRadius: '999px',
              padding: '0.5rem 1.5rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              width: '150px',
            }}
          >
            Home
          </button>
          {user ? (
            <button
              onClick={logout}
              style={{
                background: 'transparent',
                color: '#FF385C',
                border: '1px solid #FF385C',
                borderRadius: '999px',
                padding: '0.5rem 1.2rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginLeft: '0.5rem'
              }}
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => {
                setTimeout(() => {
                  const storedUser = JSON.parse(localStorage.getItem('user'));
                  setUser(storedUser);
                }, 100);
              }}
              style={{
                textDecoration: 'none',
                color: '#FF385C',
                fontWeight: 'bold',
                fontSize: '1rem'
              }}
            >
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* Page Content */}
      <div style={{ width: '100%', padding: '0 2rem', marginTop: '2rem' }}>
        <h1 style={{ fontWeight: 700, fontSize: '2.2rem', marginBottom: '1.5rem' }}>Your Listings</h1>

        {/* Create Listing Button */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
          <Link to="/create-listing" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: '#FF385C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 36,
                color: '#fff',
                marginBottom: 8,
                boxShadow: '0 2px 8px rgba(255,56,92,0.15)'
              }}>
                +
              </div>
              <span style={{ fontWeight: 600, color: '#FF385C', fontSize: '1.1rem' }}>Create Listing</span>
            </div>
          </Link>
        </div>

        {/* Grid View */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          minHeight: '440px'
        }}>
          {[...listings, ...Array(Math.max(0, 6 - listings.length)).fill(null)].map((listing, idx) =>
            listing ? (
              <Link
                to={`/listing/${listing._id}`}
                key={listing._id}
                className="card"
                style={{
                  background: '#fff',
                  borderRadius: '18px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
                  textDecoration: 'none',
                  color: '#222',
                  transition: 'transform 0.15s',
                  overflow: 'hidden',
                  minHeight: '340px',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <img
                  src={`http://localhost:5000/${listing.images[0]}`}
                  alt={listing.title}
                  className="img-cover"
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderTopLeftRadius: '18px',
                    borderTopRightRadius: '18px'
                  }}
                />
                <div style={{ padding: '1.2rem', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.2rem', margin: 0 }}>{listing.title}</h2>
                  </div>
                  <p style={{ color: '#717171', margin: '0.5rem 0 0.7rem 0', fontSize: '1rem' }}>{listing.location}</p>
                  <strong style={{ fontSize: '1.1rem' }}>₹{listing.pricePerNight}/night</strong>
                </div>
              </Link>
            ) : (
              <div key={`placeholder-${idx}`} style={{
                background: '#f3f3f3',
                borderRadius: '18px',
                minHeight: '340px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                opacity: 0.5
              }} />
            )
          )}
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        background: '#fff',
        padding: '1.5rem 2rem',
        textAlign: 'center',
        color: '#888',
        fontSize: '1rem',
        marginTop: '2rem',
        borderTop: '1px solid #eee'
      }}>
        © {new Date().getFullYear()} StayFinder.
      </footer>
    </div>
  );
};

export default HostDashboard;

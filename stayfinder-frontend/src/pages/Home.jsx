import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../index.css';
import { AuthContext } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

const Home = () => {
    const [listings, setListings] = useState([]);
    const [search, setSearch] = useState('');
    const [priceFilter, setPriceFilter] = useState('');
    const { user, setUser, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // Fetch listings from backend
    const fetchListings = async (filter = {}) => {
        try {
            let url = 'http://localhost:5000/api/listings?';
            if (search) url += `search=${encodeURIComponent(search)}&`;
            if (filter.price) url += `price=${filter.price}`;
            const res = await fetch(url);
            let data = await res.json();

            // If backend does not support price filter, filter here:
            if (filter.price) {
                if (filter.price === 'asc') {
                    data = data.sort((a, b) => a.pricePerNight - b.pricePerNight);
                } else if (filter.price === 'desc') {
                    data = data.sort((a, b) => b.pricePerNight - a.pricePerNight);
                } else {
                    data = data.filter(listing => {
                        if (filter.price === 'low') return listing.pricePerNight <= 1000;
                        if (filter.price === 'mid1') return listing.pricePerNight > 1000 && listing.pricePerNight <= 3000;
                        if (filter.price === 'mid2') return listing.pricePerNight > 3000 && listing.pricePerNight <= 5000;
                        if (filter.price === 'high1') return listing.pricePerNight > 5000 && listing.pricePerNight <= 10000;
                        if (filter.price === 'luxury') return listing.pricePerNight > 10000;
                        return true;
                    });
                }
            }

            setListings(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchListings({ price: priceFilter });
        // eslint-disable-next-line
    }, [search, priceFilter]);

    const handleCreateListing = () => {
        if (!user || !user.isHost) { // or user.role !== 'host'
            alert('You must register as a host to create a listing.');
            navigate('/register');
        } else {
            navigate('/host-dashboard');
        }
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', background: '#fafafa', minHeight: '100vh' }}>
            <Navbar
                search={search}
                setSearch={setSearch}
                fetchListings={fetchListings}
                handleCreateListing={handleCreateListing}
            />
            <div style={{ width: '100%', padding: '0 2rem', marginTop: '2rem' }}>
                <h1 style={{ fontWeight: 700, fontSize: '2.2rem', marginBottom: '1.5rem' }}>Explore Stays</h1>
                {listings.length === 0 && search.trim() !== '' ? (
                    <div style={{ textAlign: 'center', color: '#888', fontSize: '1.2rem', marginTop: '3rem' }}>
                        No results found.
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem',
                        minHeight: '440px'
                    }}>
                        {listings
                            .filter(listing =>
                                !user ||
                                (typeof listing.host === 'object'
                                    ? listing.host._id !== user.id
                                    : listing.host !== user.id)
                            )
                            .map(listing => (
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
                            ))}
                    </div>
                )}
            </div>
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

export default Home;
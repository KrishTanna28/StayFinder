import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Navbar = ({ search, setSearch, fetchListings }) => {
    const { user, setUser, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleBecomeHost = () => {
        navigate('/host-dashboard');
    };

    return (
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <span className='logo' style={{ color: '#FF385C', fontWeight: 'bold', fontSize: '2rem', letterSpacing: '1px' }}>
                <h1 style={{ margin: 0 }}>StayFinder</h1>
            </span>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                <form
                    onSubmit={(e) => { e.preventDefault(); fetchListings(); }}
                    style={{ width: '350px', marginBottom: 0 }}
                >
                    <input
                        type="text"
                        placeholder="Search by city, title or description..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            fontSize: '1rem',
                            borderRadius: '999px',
                            border: '1px solid #ddd',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            paddingLeft: '1.5rem'
                        }}
                    />
                </form>
                {/* Price Filter Dropdown */}
                <select
                    onChange={e => fetchListings({ price: e.target.value })}
                    defaultValue=""
                    style={{
                        padding: '0.6rem 1.2rem',
                        borderRadius: '999px',
                        border: '1px solid #ddd',
                        fontSize: '1rem',
                        background: '#fafafa',
                        color: '#444',
                        cursor: 'pointer',
                        marginTop: '15px'
                    }}
                >
                    <option value="">All Prices</option>
                    <option value="low">₹0 - ₹1000</option>
                    <option value="mid1">₹1001 - ₹3000</option>
                    <option value="mid2">₹3001 - ₹5000</option>
                    <option value="high1">₹5001 - ₹10000</option>
                    <option value="luxury">₹10001+</option>
                    <option value="asc">Price: Low to High</option>
                    <option value="desc">Price: High to Low</option>
                </select>
            </div> 
            {user ? (        
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <button
                    onClick={handleBecomeHost}
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
                    Become a Host
                </button>
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
                    </div>
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
        </nav>
    );
};

export default Navbar;
import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Fix Leaflet marker icon
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return position ? <Marker position={position} /> : null;
}

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  margin: '0.5rem 0 1rem 0',
  borderRadius: '8px',
  border: '1px solid #ccc',
  fontSize: '1rem',
  boxSizing: 'border-box',
};

const labelStyle = {
  fontWeight: 'bold',
  marginBottom: '0.25rem',
  display: 'block',
};

const buttonStyle = {
  background: '#FF385C',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  padding: '0.75rem 2rem',
  fontWeight: 'bold',
  fontSize: '1.1rem',
  cursor: 'pointer',
  marginTop: '1rem',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
};

const cardStyle = {
  maxWidth: 500,
  margin: '2rem auto',
  background: '#fff',
  borderRadius: '16px',
  boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
  padding: '2rem',
};

const mapContainerStyle = {
  height: 300,
  width: '100%',
  borderRadius: '12px',
  marginTop: '0.5rem',
  marginBottom: '1rem',
  overflow: 'hidden',
  border: '1px solid #eee',
};

const CreateListing = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    pricePerNight: '',
    location: '',
  });
  const [position, setPosition] = useState([19.0760, 72.8777]); // Mumbai as default
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const mapRef = useRef();

  // Search handler using OpenStreetMapProvider
  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value.length > 2) {
      const provider = new OpenStreetMapProvider();
      const results = await provider.search({ query: value });
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setForm({ ...form, location: suggestion.label });
    setPosition([suggestion.y, suggestion.x]);
    setSearch(suggestion.label);
    setSuggestions([]);
    // Optionally, move the map center
    if (mapRef.current) {
      mapRef.current.setView([suggestion.y, suggestion.x], 13);
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('pricePerNight', form.pricePerNight);
    formData.append('location', form.location);
    formData.append('latitude', position[0]);
    formData.append('longitude', position[1]);
    if (image) formData.append('image', image);

    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/listings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Listing created successfully!');
      setForm({ title: '', description: '', pricePerNight: '', location: '' });
      setImage(null);
      setPreview(null);
      setSearch('');
      setSuggestions([]);
    } catch (err) {
      alert('Error creating listing');
      console.error(err);
    }
    setLoading(false);
  };

  const isValidPosition = Array.isArray(position) &&
    typeof position[0] === 'number' &&
    typeof position[1] === 'number' &&
    !isNaN(position[0]) &&
    !isNaN(position[1]);

  const navigate = useNavigate();
  const handleDashboardRedirect = () => {
    navigate('/host-dashboard');
  };
  return (
    <div style={cardStyle}>
      <h2 style={{ textAlign: 'center', color: '#FF385C', marginBottom: '1.5rem' }}>Create a New Listing</h2>
      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          style={inputStyle}
          placeholder="e.g. Cozy Apartment in Mumbai"
        />

        <label style={labelStyle}>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
          placeholder="Describe your place..."
        />

        <label style={labelStyle}>Price per Night (₹)</label>
        <input
          name="pricePerNight"
          type="number"
          value={form.pricePerNight}
          onChange={handleChange}
          required
          style={inputStyle}
          min={0}
          placeholder="e.g. 1500"
        />

        <label style={labelStyle}>Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} style={inputStyle} />
        {preview && (
          <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
            <img src={preview} alt="Preview" style={{ maxWidth: 180, maxHeight: 180, borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
          </div>
        )}

        <label style={labelStyle}>Location (search and select)</label>
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          style={inputStyle}
          placeholder="Search for a location"
          autoComplete="off"
        />
        {suggestions.length > 0 && (
          <div style={{
            background: '#fff',
            border: '1px solid #eee',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            position: 'absolute',
            zIndex: 1000,
            width: '90%',
            maxHeight: 200,
            overflowY: 'auto'
          }}>
            {suggestions.map((s, idx) => (
              <div
                key={idx}
                style={{
                  padding: '0.5rem',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f0f0f0'
                }}
                onClick={() => handleSuggestionClick(s)}
              >
                {s.label}
              </div>
            ))}
          </div>
        )}

        

        <label style={labelStyle}>Mark location on map</label>
        <div style={mapContainerStyle}>
          <MapContainer
            center={isValidPosition ? position : [19.0760, 72.8777]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            whenCreated={mapInstance => { mapRef.current = mapInstance; }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {isValidPosition && <LocationMarker position={position} setPosition={setPosition} />}
          </MapContainer>
        </div>
        <div style={{ marginBottom: '1rem', color: '#666', fontSize: '0.95rem' }}>
          Selected coordinates: <b>{position[0].toFixed(5)}, {position[1].toFixed(5)}</b>
        </div>

        <button type="submit" style={buttonStyle} disabled={loading} onClick={handleDashboardRedirect}>
          {loading ? 'Creating...' : 'Create Listing'}
        </button>
      </form>
    </div>
  );
};

export default CreateListing;
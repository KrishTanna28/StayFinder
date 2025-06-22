import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import './Login.css';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', isHost: false });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', form);
      alert('Registration successful');
      navigate('/login');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div className="container" style={{border:'2px solid rgb(190, 190, 190)', height:'500px'}}>
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        <div className="username">
          <input
            placeholder="name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="username">
          <input
            placeholder="email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="password">
          <input
            placeholder="password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="login">
          <button type="submit">Register</button>
        </div>
      </form>

      <div className="register">
        <p>
          Already have an account? <a id="reg" href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;

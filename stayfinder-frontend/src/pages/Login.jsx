import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../index.css';
import './Login.css'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      login(res.data.user); // Use the user object from backend response
      alert('Login successful');
      const user = res.data.user;
      if (user && user.isHost) {
        navigate('/host-dashboard');
      } else {
        navigate('/'); // or any other page for non-host users
      }
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="container" style={{ border: '2px solid rgb(190, 190, 190)' }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="username">
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="password">
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        <div style={{ justifyContent: 'center' }} className="checkbox">
          <a id="fp" href="/forget-password">Forget Password?</a>
        </div>

        <div className="login">
          <button type="submit">Login</button>
        </div>
      </form>

      <div className="register">
        <p>
          Don't have an account? <a id="reg" href="/register">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;

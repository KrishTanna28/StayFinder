import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ListingDetails from './pages/ListingDetails';
import { AuthProvider } from './contexts/AuthContext';
import HostDashboard from './pages/HostDashboard';
import CreateListing from './pages/CreateListing';
import EditListing from './pages/EditListing';
import Payment from './pages/Payment';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/listing/:id' element={<ListingDetails />} />
          <Route path='/host-dashboard' element={<HostDashboard />} /> 
          <Route path='create-listing' element={<CreateListing />} />
          <Route path="/edit-listing/:id" element={<EditListing />} />
          <Route path="/payment/:bookingId" element={<Payment />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cars from './pages/Cars';
import CarDetails from './pages/CarDetails';
import ListCar from './pages/ListCar';
import MyBookings from './pages/MyBookings';
import OwnerDashboard from './pages/OwnerDashboard';
import Contact from './pages/Contact';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/car/:id" element={<CarDetails />} />
          <Route path="/list-car" element={<ListCar />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/owner-dashboard" element={<OwnerDashboard />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <img src="/images/logocar.png" alt="Karzone" style={{ height: '40px', width: 'auto' }} />
        </Link>
        <div className="nav-menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/cars" className="nav-link">Cars</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          {user ? (
            <>
              <Link to="/my-bookings" className="nav-link">My Bookings</Link>
              {user.role === 'owner' && (
                <Link to="/owner-dashboard" className="nav-link">Dashboard</Link>
              )}
              <span className="nav-user">{user.name}</span>
              <button onClick={handleLogout} className="nav-btn">Logout</button>
            </>
          ) : (
            <Link to="/login" className="nav-btn">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
import React from 'react';
import { Link } from 'react-router-dom';

const LoginModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Login Required</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="modal-icon">🔐</div>
          <p>You need to login to book a car. Please sign in to continue with your booking.</p>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <Link to="/login" className="btn-primary" onClick={onClose}>
            Login Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
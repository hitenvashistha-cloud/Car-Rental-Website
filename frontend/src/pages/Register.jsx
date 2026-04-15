import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', role: 'user' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await register(formData);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <div className="auth-subtitle">Join Karzone today</div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="user">Regular User - Rent Cars</option>
              <option value="owner">Car Owner - List Your Cars</option>
            </select>
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>{loading ? 'Creating...' : 'Sign Up'}</button>
        </form>
        <div className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [carsRes, bookingsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/cars/owner/my-cars'),
        axios.get('http://localhost:5000/api/bookings/owner-bookings')
      ]);
      setCars(carsRes.data.cars || []);
      setBookings(bookingsRes.data.bookings || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/bookings/${id}/status`, { status });
      alert(`Booking ${status}!`);
      fetchData();
    } catch (err) {
      alert('Failed to update');
    }
  };

  const deleteCar = async (id) => {
    if (window.confirm('Delete this car?')) {
      try {
        await axios.delete(`http://localhost:5000/api/cars/${id}`);
        alert('Car deleted');
        fetchData();
      } catch (err) {
        alert('Failed to delete');
      }
    }
  };

  const totalRevenue = bookings.reduce((sum, b) => b.status === 'confirmed' ? sum + b.totalPrice : sum, 0);

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  return (
    <>
      <div className="dashboard-container">
        <div className="container">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Owner Dashboard</h1>
            <p className="dashboard-subtitle">Welcome back, {user?.name}</p>
          </div>

          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-number">{cars.length}</div>
              <div className="stat-label">Total Cars</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{bookings.length}</div>
              <div className="stat-label">Total Bookings</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">${totalRevenue}</div>
              <div className="stat-label">Revenue</div>
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-actions">
              <h2 className="section-title">My Cars</h2>
              <Link to="/list-car" className="add-btn">+ Add Car</Link>
            </div>
            {cars.length === 0 ? (
              <div className="empty-state">No cars listed yet.</div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Car</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cars.map(car => (
                    <tr key={car._id}>
                      <td>{car.brand || car.make} {car.model}</td>
                      <td>${car.pricePerDay || car.dailyRate}/day</td>
                      <td>
                        <button onClick={() => deleteCar(car._id)} className="btn-delete">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="dashboard-section">
            <h2 className="section-title">Recent Bookings</h2>
            {bookings.length === 0 ? (
              <div className="empty-state">No bookings yet.</div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Car</th>
                    <th>Customer</th>
                    <th>Dates</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking._id}>
                      <td>{booking.car.brand || booking.car.make} {booking.car.model}</td>
                      <td>{booking.user?.name}</td>
                      <td>{new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</td>
                      <td>${booking.totalPrice}</td>
                      <td className={`status-${booking.status}`}>{booking.status}</td>
                      <td>
                        {booking.status === 'pending' && (
                          <>
                            <button onClick={() => updateStatus(booking._id, 'confirmed')} className="btn-confirm">Confirm</button>
                            <button onClick={() => updateStatus(booking._id, 'cancelled')} className="btn-cancel">Cancel</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OwnerDashboard;
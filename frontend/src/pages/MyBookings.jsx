import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        'http://localhost:5000/api/bookings/my-bookings',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  return (
    <>
      <div className="bookings-container">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Your Reservations</div>
            <h2 className="section-title">My Bookings</h2>
          </div>
          {bookings.length === 0 ? (
            <div className="bookings-empty">
              <p>You haven't made any bookings yet.</p>
              <Link to="/cars" className="browse-cars-btn">Browse Cars</Link>
            </div>
          ) : (
            <div className="bookings-list">
              {bookings.map(booking => (
                <div key={booking._id} className="booking-card">
                  <div className="booking-car-info">
                    <strong>{booking.car.brand || booking.car.make} {booking.car.model}</strong>
                    <br />
                    <span className="booking-car-location">{booking.car.location || 'Location not specified'}</span>
                  </div>
                  <div className="booking-dates">
                    Pickup: {new Date(booking.startDate).toLocaleDateString()}
                    <br />
                    Return: {new Date(booking.endDate).toLocaleDateString()}
                  </div>
                  <div className="booking-price">${booking.totalPrice}</div>
                  <div className={`booking-status status-${booking.status}`}>
                    {booking.status}
                  </div>
                  <Link to={`/car/${booking.car._id}`} className="view-car-btn">
                    View Car
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyBookings;
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import LoginModal from '../components/LoginModal';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    fetchCar();
  }, [id]);

  useEffect(() => {
    calculateTotal();
  }, [startDate, endDate, car]);

  const fetchCar = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/cars/${id}`);
      setCar(res.data.car);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (startDate && endDate && car) {
      const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
      setTotalPrice(days * (car.pricePerDay || car.dailyRate));
    } else {
      setTotalPrice(0);
    }
  };

  const carImageFallback = useMemo(() => {
    if (!car) {
      return '/images/C1.png';
    }

    if (car.images && car.images.length > 0) {
      return car.images[0];
    }

    const localImages = ['C1.png', 'C2.png', 'C3.png', 'C4.png', 'C5.png', 'C6.png', 'C7.png'];
    const imageIndex = (car._id ? car._id.slice(-1).charCodeAt(0) : Math.floor(Math.random() * 7)) % localImages.length;
    return `/images/${localImages[imageIndex]}`;
  }, [car]);

  const handleBooking = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    if (!startDate || !endDate) {
      setNotification({ show: true, type: 'error', message: 'Please select both start and end dates' });
      setTimeout(() => setNotification({ show: false, type: '', message: '' }), 4000);
      return;
    }
    setBookingLoading(true);
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        'http://localhost:5000/api/bookings',
        {
          carId: car._id,
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          totalPrice
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setNotification({ show: true, type: 'success', message: '✓ Booking confirmed! Redirecting...' });
      setTimeout(() => {
        navigate('/my-bookings');
      }, 4000);
    } catch (err) {
      setNotification({ show: true, type: 'error', message: err.response?.data?.message || 'Booking failed. Please try again.' });
      setTimeout(() => setNotification({ show: false, type: '', message: '' }), 4000);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  if (!car) {
    return <div className="container" style={{ marginTop: '100px' }}>Car not found</div>;
  }

  return (
    <>
      <div className="car-details-container">
        <div className="container">
          <div className="car-details-grid">
            <div>
              <div className="car-image-gallery">
                <img
                  src={car.images && car.images.length > 0 ? (car.images[selectedImageIndex].startsWith('http') ? car.images[selectedImageIndex] : `http://localhost:5000${car.images[selectedImageIndex]}`) : carImageFallback}
                  alt={car.brand || car.make}
                  className="car-image-large"
                />
                {car.images && car.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImageIndex(prev => prev > 0 ? prev - 1 : car.images.length - 1)}
                      className="gallery-nav-btn gallery-nav-btn.prev"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => setSelectedImageIndex(prev => prev < car.images.length - 1 ? prev + 1 : 0)}
                      className="gallery-nav-btn gallery-nav-btn.next"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>
              {car.images && car.images.length > 1 && (
                <div className="gallery-thumbnails">
                  {car.images.map((image, index) => (
                    <img
                      key={index}
                      src={image.startsWith('http') ? image : `http://localhost:5000${image}`}
                      alt={`${car.brand || car.make} ${index + 1}`}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`gallery-thumbnail ${selectedImageIndex === index ? 'active' : ''}`}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="car-info-section">
              <h1>{car.brand || car.make} {car.model} ({car.year})</h1>
              <p className="car-location">📍 {car.location || 'Location not specified'}</p>
              <div className="car-specs-grid">
                <div className="car-spec-item">
                  <div className="car-spec-label">Seats</div>
                  <div className="car-spec-value">{car.seats || '5'}</div>
                </div>
                <div className="car-spec-item">
                  <div className="car-spec-label">Transmission</div>
                  <div className="car-spec-value">{car.transmission || 'Automatic'}</div>
                </div>
                <div className="car-spec-item">
                  <div className="car-spec-label">Fuel</div>
                  <div className="car-spec-value">{car.fuelType || 'Petrol'}</div>
                </div>
              </div>
              <p className="car-description">{car.description}</p>
              <div className="car-features-section">
                <h3>Features</h3>
                <ul className="car-features-list">
                  {car.features?.map((f, i) => (
                    <li key={i} className="car-feature-item">✓ {f}</li>
                  ))}
                </ul>
              </div>
              <div className="car-booking-card">
                <div className="car-price-display">
                  ${car.pricePerDay || car.dailyRate}<span>/day</span>
                </div>
                <div className="booking-dates-grid">
                  <div className="date-input-group">
                    <label>Start Date</label>
                    <DatePicker
                      selected={startDate}
                      onChange={date => setStartDate(date)}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      minDate={new Date()}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Select start date"
                      className="date-input"
                    />
                  </div>
                  <div className="date-input-group">
                    <label>End Date</label>
                    <DatePicker
                      selected={endDate}
                      onChange={date => setEndDate(date)}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      minDate={startDate || new Date()}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Select end date"
                      className="date-input"
                    />
                  </div>
                </div>
                {totalPrice > 0 && (
                  <div className="booking-total">
                    Total: <strong>${totalPrice}</strong>
                  </div>
                )}
                <button
                  onClick={handleBooking}
                  disabled={bookingLoading}
                  className="book-now-btn"
                >
                  {bookingLoading ? 'Processing...' : 'Book Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {notification.show && (
        <div className={`notification notification-${notification.type}`}>
          <p>{notification.message}</p>
        </div>
      )}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
};

export default CarDetails;
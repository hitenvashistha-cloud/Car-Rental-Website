import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import HeroSection from '../components/HeroSection';
import CarCard from '../components/CarCard';
import Testimonials from '../components/Testimonials';
import Stats from '../components/Stats';
import Footer from '../components/Footer';

const Home = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCars = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/cars');
      setCars(res.data.cars || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const displayedCars = useMemo(() => cars.slice(0, 6), [cars]);

  const handleSeed = useCallback(async () => {
    try {
      setLoading(true);
      const seedRes = await axios.post('http://localhost:5000/api/cars/seed');
      setCars(seedRes.data.cars || []);
    } catch (err) {
      console.error(err);
      alert('Seed failed, please check backend server logs.');
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <HeroSection />
      <div className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Premium Fleet Selection</div>
            <h2 className="section-title">Luxury Car Collection</h2>
            <p className="section-subtitle">Discover premium vehicles with exceptional performance and comfort for your next journey</p>
          </div>
          <div className="cars-grid">
            {displayedCars.map(car => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>

          {cars.length === 0 && (
            <div className="empty-state" style={{ marginTop: '40px' }}>
              <p>No cars available right now. List a car from Owner Dashboard or seed demo data.</p>
              <button
                className="add-btn"
                onClick={handleSeed}
              >
                Seed Demo Cars
              </button>
            </div>
          )}
        </div>
      </div>
      <Testimonials />
      <Stats />
      <Footer />
    </>
  );
};

export default Home;
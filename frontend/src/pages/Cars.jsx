import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CarCard from '../components/CarCard';
import Footer from '../components/Footer';

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ brand: '', minPrice: '', maxPrice: '', seats: '' });
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/cars');
      setCars(res.data.cars || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCars = React.useMemo(() => {
    let filtered = cars;

    if (filters.brand) {
      filtered = filtered.filter((c) =>
        (c.brand || c.make).toLowerCase().includes(filters.brand.trim().toLowerCase()) ||
        c.model.toLowerCase().includes(filters.brand.trim().toLowerCase())
      );
    }

    if (filters.minPrice) {
      const min = Number(filters.minPrice);
      if (!Number.isNaN(min)) {
        filtered = filtered.filter((c) => (c.pricePerDay || c.dailyRate) >= min);
      }
    }

    if (filters.maxPrice) {
      const max = Number(filters.maxPrice);
      if (!Number.isNaN(max)) {
        filtered = filtered.filter((c) => (c.pricePerDay || c.dailyRate) <= max);
      }
    }

    if (filters.seats) {
      const seats = Number(filters.seats);
      if (!Number.isNaN(seats)) {
        filtered = filtered.filter((c) => c.seats >= seats);
      }
    }

    return filtered;
  }, [cars, filters]);

  const visibleCars = React.useMemo(() => filteredCars.slice(0, visibleCount), [filteredCars, visibleCount]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Premium Fleet Selection</div>
            <h2 className="section-title">All Luxury Cars</h2>
            <p className="section-subtitle">Browse our complete collection of premium vehicles with advanced filtering options</p>
          </div>
          <div className="filters-grid">
            <input
              type="text"
              placeholder="Brand"
              className="filter-input"
              value={filters.brand}
              onChange={(e) => setFilters({...filters, brand: e.target.value})}
            />
            <input
              type="number"
              placeholder="Min Price"
              className="filter-input"
              value={filters.minPrice}
              onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
            />
            <input
              type="number"
              placeholder="Max Price"
              className="filter-input"
              value={filters.maxPrice}
              onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
            />
            <select
              value={filters.seats}
              onChange={(e) => setFilters({...filters, seats: e.target.value})}
              className="filter-input"
            >
              <option value="">All Seats</option>
              <option value="2">2 Seats</option>
              <option value="4">4 Seats</option>
              <option value="5">5+ Seats</option>
            </select>
          </div>
          <div style={{ marginBottom: '14px', color: '#ddd', fontSize: '14px' }}>
            Showing {filteredCars.length} of {cars.length} cars
            {filters.brand || filters.minPrice || filters.maxPrice || filters.seats ? ' (filtered)' : ''}
          </div>
          <div className="cars-grid">
            {visibleCars.map(car => <CarCard key={car._id} car={car} />)}
          </div>

          {visibleCars.length < filteredCars.length && (
            <div className="text-center" style={{ marginTop: '20px' }}>
              <button
                className="load-more-btn"
                onClick={() => setVisibleCount(prev => Math.min(filteredCars.length, prev + 8))}
              >
                Load More
              </button>
            </div>
          )}

          {filteredCars.length === 0 && (
            <div className="empty-state" style={{ marginTop: '40px' }}>
              <p>No cars listed yet. If you are an owner, list your first car. If you just started, seed demo cars to test faster.</p>
              <button
                className="add-btn"
                onClick={async () => {
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
                }}
              >
                Seed Demo Cars
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cars;
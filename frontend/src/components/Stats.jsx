import React from 'react';

const Stats = () => {
  return (
    <div className="section stats-section">
      <div className="container">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">10K+</div>
            <div className="stat-label">Happy Customers</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">250+</div>
            <div className="stat-label">Luxury Vehicles</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Support</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50+</div>
            <div className="stat-label">Locations</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
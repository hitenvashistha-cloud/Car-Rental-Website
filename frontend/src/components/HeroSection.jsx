import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const heroImage = '/images/hero.png';
  const heroBackground = `linear-gradient(135deg, rgba(10, 10, 10, 0.95), rgba(26, 26, 26, 0.95)), url(${heroImage})`;

  return (
    <div className="hero-section" style={{ backgroundImage: heroBackground, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <div className="hero-overlay"></div>
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge animate-fade-in">Next‑gen fleet. Instant drive.</div>
          <h1 className="hero-title animate-slide-up">
            Rent Your Dream Car.<br />
            <span className="animate-glow">Transparent pricing.</span><br />
            Book in seconds.
          </h1>
          <p className="hero-subtitle animate-fade-in-delay">
            Discover premium vehicles with exceptional performance and comfort for your next journey
          </p>
          <div className="hero-buttons animate-bounce-in">
            <Link to="/cars" className="hero-btn-primary animate-pulse">
              <span>🚗</span> See Fleet
            </Link>
            <Link to="/contact" className="hero-btn-secondary animate-shimmer">
              <span>📞</span> Contact Us
            </Link>
          </div>
        </div>
        <div className="hero-stats animate-float">
          <div className="stat-item animate-slide-in-left">
            <div className="stat-number">500+</div>
            <div className="stat-label">Premium Cars</div>
          </div>
          <div className="stat-item animate-slide-in-right">
            <div className="stat-number">10K+</div>
            <div className="stat-label">Happy Customers</div>
          </div>
          <div className="stat-item animate-slide-in-left-delay">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Support</div>
          </div>
        </div>
      </div>
      <div className="hero-particles">
        <div className="particle particle-1 animate-particle-1"></div>
        <div className="particle particle-2 animate-particle-2"></div>
        <div className="particle particle-3 animate-particle-3"></div>
        <div className="particle particle-4 animate-particle-4"></div>
        <div className="particle particle-5 animate-particle-5"></div>
      </div>
      <div className="hero-scroll-indicator">
        <div className="scroll-mouse">
          <div className="scroll-wheel"></div>
        </div>
        <span>Scroll to explore</span>
      </div>
    </div>
  );
};

export default HeroSection;
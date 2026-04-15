import React from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Kavya Kaushik",
      role: "Business Traveler",
      car: "BMW 5 Series",
      comment: "The BMW 5 Series was impeccable! Smooth ride and excellent service with ample space. Will definitely rent again."
    },
    {
      name: "Rohan Bhardwaj",
      role: "Family Vacation",
      car: "Toyota Highlander",
      comment: "Perfect family SUV with ample space. Clean, well-maintained, and great value for money."
    },
    {
      name: "Mridul Krishna Shastri",
      role: "Road Trip Enthusiast",
      car: "Ford Mustang",
      comment: "Convertible Mustang made our coastal drive unforgettable! 24/7 support was a lifesaver."
    }
  ];

  return (
    <div className="section testimonials-section">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">Customer Experiences</div>
          <h2 className="section-title">Premium Drive Experiences</h2>
          <p className="section-subtitle">Hear from our valued customers about their journey with our premium fleet</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card">
              <div className="rating">★★★★★</div>
              <div className="testimonial-comment">"{t.comment}"</div>
              <div className="testimonial-car">{t.car}</div>
              <div className="author-name">{t.name}</div>
              <div className="author-role">{t.role}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
import React from 'react';
import Footer from '../components/Footer';

const Contact = () => {
  return (
    <>
      <div className="container" style={{ marginTop: '100px', minHeight: '60vh' }}>
        <div className="section-header">
          <div className="section-badge">Get In Touch</div>
          <h2 className="section-title">Contact Us</h2>
          <div className="section-subtitle">We're here to help with any questions</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', marginTop: '40px' }}>
          <div style={{ background: '#111', padding: '30px', borderRadius: '16px' }}>
            <h3 style={{ color: '#ffd700', marginBottom: '20px' }}>📍 Visit Us</h3>
            <p>KarZone ,Chandigarh</p>
            <p>Punjab, IN 175029</p>
            <p>INDIA</p>
          </div>
          <div style={{ background: '#111', padding: '30px', borderRadius: '16px' }}>
            <h3 style={{ color: '#ffd700', marginBottom: '20px' }}>📞 Call Us</h3>
            <p>+91 7034567890</p>
            <p>+91 9879829100</p>
            <p>24/7 Support Available</p>
          </div>
          <div style={{ background: '#111', padding: '30px', borderRadius: '16px' }}>
            <h3 style={{ color: '#ffd700', marginBottom: '20px' }}>✉️ Email Us</h3>
            <p>hitenvashistha@gmail.com</p>
            <p>25mca20163@cuchd.in</p>
            <p>bookings@gmail.com</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
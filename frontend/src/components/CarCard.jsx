import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

const CarCard = React.memo(({ car }) => {
  console.log('Render CarCard:', car._id);

  const imageUrl = useMemo(() => {
    if (car.images && car.images.length > 0) {
      
      if (car.images[0].startsWith('http')) {
        return car.images[0];
      } else {
        return `http://localhost:5000${car.images[0]}`;
      }
    }

    const brandImageMap = {
      mercedes: '/images/C3.jpg',
      tesla: '/images/C2.png',
      bmw: '/images/C4.png',
      audi: '/images/C5.png',
      lamborghini: '/images/C6.png',
      ferrari: '/images/C7.png',
      porsche: '/images/C1.png',
      toyota: '/images/C1.png',
      honda: '/images/C2.png',
      ford: '/images/C3.jpg',
      chevrolet: '/images/C4.png',
      nissan: '/images/C5.png',
      mazda: '/images/C6.png',
      subaru: '/images/C7.png',
      volkswagen: '/images/C1.png',
      hyundai: '/images/C2.png',
      kia: '/images/C3.png',
      jeep: '/images/C4.png',
      chrysler: '/images/C5.png',
      dodge: '/images/C6.png',
      ram: '/images/C7.png',
    };

    const brandKey = (car.brand || car.make) ? (car.brand || car.make).toLowerCase() : '';

    if (brandKey && brandImageMap[brandKey]) {
      return brandImageMap[brandKey];
    }

    const localImages = ['C1.png', 'C2.png', 'C3.jpg', 'C4.png', 'C5.png', 'C6.png', 'C7.png'];
    const imageIndex = (car._id ? car._id.slice(-1).charCodeAt(0) : Math.floor(Math.random() * 7)) % localImages.length;
    return `/images/${localImages[imageIndex]}`;
  }, [car]);


  return (
    <div className="car-card">
      <div className="car-image-container">
        <img src={imageUrl} alt={car.brand || car.make} className="car-image" loading="lazy" />
        <div className="car-image-overlay"></div>
        
      </div>
      <div className="car-info">
        <div className="car-header">
          <h3 className="car-title">{car.brand || car.make} {car.model}</h3>
          <span className="car-year">{car.year || '2024'}</span>
        </div>
        <div className="car-price">${car.pricePerDay || car.dailyRate}<span>/day</span></div>
        <div className="car-specs">
          <div className="car-spec-item">
            <span className="car-spec-icon">👥</span>
            <span>{car.seats || '5'} seats</span>
          </div>
          <div className="car-spec-item">
            <span className="car-spec-icon">⚙️</span>
            <span>{car.transmission || 'Automatic'}</span>
          </div>
          <div className="car-spec-item">
            <span className="car-spec-icon">⛽</span>
            <span>{car.fuelType || 'Petrol'}</span>
          </div>
        </div>
        <Link to={`/car/${car._id}`} className="view-btn">
          <span>View Details</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
});

export default CarCard;
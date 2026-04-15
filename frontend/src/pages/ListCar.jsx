import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

const ListCar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [formData, setFormData] = useState({
    title: '', brand: '', model: '', year: '', pricePerDay: '',
    fuelType: 'Petrol', seats: '', transmission: 'Automatic',
    description: '', location: '', features: []
  });
  const [feature, setFeature] = useState('');
  const fileInputRef = useRef(null);

  // Clean up preview URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  if (user && user.role !== 'owner') {
    navigate('/');
    return null;
  }

  const addFeature = () => {
    if (feature.trim()) {
      setFormData({ ...formData, features: [...formData.features, feature.trim()] });
      setFeature('');
    }
  };

  const removeFeature = (index) => {
    setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });
  };

  const handleImageSelect = (e) => {
    // Clean up previous preview URLs to prevent memory leaks
    imagePreviews.forEach(preview => URL.revokeObjectURL(preview));

    const files = Array.from(e.target.files);
    setSelectedImages(files);

    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index) => {
    // Clean up the preview URL for the removed image
    URL.revokeObjectURL(imagePreviews[index]);

    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submitData = new FormData();

      // Add form data
      Object.keys(formData).forEach(key => {
        if (key === 'features') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else {
          submitData.append(key, formData[key]);
        }
      });

      // Add images
      selectedImages.forEach((image, index) => {
        submitData.append('images', image);
      });

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': localStorage.getItem('token')
        }
      };

      await axios.post('http://localhost:5000/api/cars', submitData, config);
      alert('Car listed successfully!');
      
      // Reset form
      setFormData({
        title: '', brand: '', model: '', year: '', pricePerDay: '',
        fuelType: 'Petrol', seats: '', transmission: 'Automatic',
        description: '', location: '', features: []
      });
      setFeature('');
      setSelectedImages([]);
      // Clean up preview URLs
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
      setImagePreviews([]);
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      navigate('/owner-dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Error listing car');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="form-container">
        <div className="container">
          <div className="form-card">
            <h1 className="form-title">List Your Car</h1>
            <p className="form-subtitle">Share your vehicle with our community</p>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="brand"
                    placeholder="Brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    className="form-input"
                    required
                  />
                </div>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <input
                    type="text"
                    name="model"
                    placeholder="Model"
                    value={formData.model}
                    onChange={(e) => setFormData({...formData, model: e.target.value})}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="number"
                    name="year"
                    placeholder="Year"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                    className="form-input"
                    required
                  />
                </div>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <input
                    type="number"
                    name="pricePerDay"
                    placeholder="Price per day ($)"
                    value={formData.pricePerDay}
                    onChange={(e) => setFormData({...formData, pricePerDay: e.target.value})}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="number"
                    name="seats"
                    placeholder="Seats"
                    value={formData.seats}
                    onChange={(e) => setFormData({...formData, seats: e.target.value})}
                    className="form-input"
                    required
                  />
                </div>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <select
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={(e) => setFormData({...formData, fuelType: e.target.value})}
                    className="form-select"
                  >
                    <option>Petrol</option>
                    <option>Diesel</option>
                    <option>Electric</option>
                    <option>Hybrid</option>
                  </select>
                </div>
                <div className="form-group">
                  <select
                    name="transmission"
                    value={formData.transmission}
                    onChange={(e) => setFormData({...formData, transmission: e.target.value})}
                    className="form-select"
                  >
                    <option>Automatic</option>
                    <option>Manual</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="location"
                  placeholder="Location (City, State)"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  name="description"
                  placeholder="Description"
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="form-textarea"
                  required
                />
              </div>
              <div className="form-group">
                <label>Car Images (Max 10 images, 5MB each)</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="image-upload-input"
                  ref={fileInputRef}
                />
                {imagePreviews.length > 0 && (
                  <div className="image-preview-grid">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="image-preview-item">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="image-preview-img"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="image-preview-remove"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Features</label>
                <div className="feature-input-group">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => setFeature(e.target.value)}
                    placeholder="e.g., Leather Seats"
                    className="feature-input"
                  />
                  <button type="button" onClick={addFeature} className="add-feature-btn">Add</button>
                </div>
                <div className="features-list">
                  {formData.features.map((f, i) => (
                    <span key={i} className="feature-tag">
                      {f}
                      <button type="button" onClick={() => removeFeature(i)}>×</button>
                    </span>
                  ))}
                </div>
              </div>
              <button type="submit" disabled={loading} className="form-submit-btn">
                {loading ? 'Listing...' : 'List Your Car'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ListCar;
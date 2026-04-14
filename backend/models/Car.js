const mongoose = require('mongoose');

// Car Schema - Defines how cars are stored in database
const CarSchema = new mongoose.Schema({
  // Reference to the owner (User who listed this car)
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner is required']
  },
  
  // Car title/name
  title: {
    type: String,
    required: [true, 'Please add a car title'],
    trim: true
  },
  
  // Car brand (Mercedes, BMW, Audi, etc.)
  brand: {
    type: String,
    required: [true, 'Please add a brand'],
    trim: true
  },
  
  // Car model (S-Class, 7 Series, A8, etc.)
  model: {
    type: String,
    required: [true, 'Please add a model'],
    trim: true
  },
  
  // Manufacturing year
  year: {
    type: Number,
    required: [true, 'Please add a year'],
    min: 2000,
    max: new Date().getFullYear() + 1
  },
  
  // Price per day in USD
  pricePerDay: {
    type: Number,
    required: [true, 'Please add price per day'],
    min: 0
  },
  
  // Fuel type options
  fuelType: {
    type: String,
    enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
    required: [true, 'Please select fuel type']
  },
  
  // Number of seats
  seats: {
    type: Number,
    required: [true, 'Please add number of seats'],
    min: 2,
    max: 8
  },
  
  // Transmission type
  transmission: {
    type: String,
    enum: ['Manual', 'Automatic'],
    required: [true, 'Please select transmission']
  },
  
  // Array of image URLs (from Unsplash or uploaded)
  images: {
    type: [String],
    default: []
  },
  
  // Detailed description of the car
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: 1000
  },
  
  // Pickup location
  location: {
    type: String,
    required: [true, 'Please add a location'],
    trim: true
  },
  
  // Whether car is available for booking
  isAvailable: {
    type: Boolean,
    default: true
  },
  
  // Array of features (Leather seats, GPS, etc.)
  features: {
    type: [String],
    default: []
  },
  
  // When car was listed
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Car', CarSchema);
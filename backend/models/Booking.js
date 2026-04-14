const mongoose = require('mongoose');

// Booking Schema - Defines how bookings are stored in database
const BookingSchema = new mongoose.Schema({
  // Reference to the car being booked
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: [true, 'Car reference is required']
  },
  
  // Reference to the user making the booking
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  
  // Start date of rental
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  
  // End date of rental
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  
  // Total price for the entire rental period
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'],
    min: 0
  },
  
  // Booking status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  
  // Payment status
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  
  // When booking was created
  createdAt: {
    type: Date,
    default: Date.now
  }
});

BookingSchema.pre('save', function(next) {
  // Only validate if both dates exist
  if (this.startDate && this.endDate) {
    if (this.startDate >= this.endDate) {
      return next(new Error('End date must be after start date'));
    }
  }
  next();
});

module.exports = mongoose.model('Booking', BookingSchema);
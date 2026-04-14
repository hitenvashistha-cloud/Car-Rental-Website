const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const auth = require('../middleware/auth');

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private (User only)
router.post('/', auth, async (req, res) => {
  try {
    const { carId, startDate, endDate, totalPrice } = req.body;

    if (!carId || !startDate || !endDate || !totalPrice) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if car exists
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // Check if car is available
    if (!car.isAvailable) {
      return res.status(400).json({ message: 'Car is not available for booking' });
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    // Check for overlapping bookings
    const existingBooking = await Booking.findOne({
      car: carId,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        { startDate: { $lte: endDate, $gte: startDate } },
        { endDate: { $lte: endDate, $gte: startDate } }
      ]
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'Car is already booked for selected dates' });
    }

    // Create booking
    const booking = await Booking.create({
      car: carId,
      user: req.user.id,
      startDate,
      endDate,
      totalPrice,
      status: 'pending',
      paymentStatus: 'pending'
    });

    res.status(201).json({ success: true, booking });

  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message || 'Something went wrong'
    });
  }
});

// @route   GET /api/bookings/my-bookings
// @desc    Get all bookings for logged-in user
// @access  Private
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('car')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/bookings/owner-bookings
// @desc    Get all bookings for cars owned by logged-in owner
// @access  Private (Owner only)
router.get('/owner-bookings', auth, async (req, res) => {
  try {
    // Check if user is owner
    if (req.user.role !== 'owner') {
      return res.status(403).json({ message: 'Access denied. Only owners can access this.' });
    }

    // Get all cars owned by this user
    const cars = await Car.find({ owner: req.user.id });
    const carIds = cars.map(car => car._id);

    // Get bookings for those cars
    const bookings = await Booking.find({ car: { $in: carIds } })
      .populate('car')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status (confirm/cancel)
// @access  Private (Owner or User who made booking)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id).populate('car');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    const isOwner = booking.car.owner.toString() === req.user.id;
    const isUser = booking.user.toString() === req.user.id;

    if (!isOwner && !isUser) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Owners can only confirm/cancel pending bookings
    // Users can only cancel their own bookings
    if (isOwner && status === 'confirmed' && booking.status === 'pending') {
      booking.status = 'confirmed';
      booking.paymentStatus = 'paid';
    } else if ((isOwner || isUser) && status === 'cancelled' && booking.status !== 'completed') {
      booking.status = 'cancelled';
    } else {
      return res.status(400).json({ message: 'Cannot update booking status' });
    }

    await booking.save();
    res.json({ success: true, booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/bookings/:id
// @desc    Cancel/delete a booking
// @access  Private (User who made booking)
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Can only cancel pending bookings
    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Can only cancel pending bookings' });
    }

    await booking.deleteOne();
    res.json({ success: true, message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
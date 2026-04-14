require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');


const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Import routes
const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/cars');
const bookingRoutes = require('./routes/bookings');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/car_rental';

console.log('Connecting to:', MONGODB_URI);

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log(' MongoDB connected successfully');
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
  console.error('MongoDB error:', err);
  process.exit(1);
});

app.get('/test', (req, res) => {
  res.json({ message: 'API is working!' });
});
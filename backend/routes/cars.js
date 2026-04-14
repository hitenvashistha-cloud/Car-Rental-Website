const express = require('express');
const router = express.Router();
const Car = require('../models/Car');
const User = require('../models/User');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/cars
// @desc    Get all available cars with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { brand, minPrice, maxPrice, seats, fuelType, transmission } = req.query;
    
    // Build filter object
    let filter = { $or: [{ available: true }, { isAvailable: true }] };
    
    if (brand) filter.brand = { $regex: brand, $options: 'i' };
    if (fuelType) filter.fuelType = fuelType;
    if (transmission) filter.transmission = transmission;
    if (seats) filter.seats = parseInt(seats);
    
    if (minPrice || maxPrice) {
      filter.pricePerDay = {};
      if (minPrice) filter.pricePerDay.$gte = parseInt(minPrice);
      if (maxPrice) filter.pricePerDay.$lte = parseInt(maxPrice);
    }
    
    const cars = await Car.find(filter).populate('owner', 'name email phone');
    res.json({ success: true, count: cars.length, cars });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Seeder endpoint (helps when DB is empty)
// @route   POST /api/cars/seed
// @route   GET /api/cars/seed
// @desc    Create sample cars (owner auto-created when missing)
// @access  Public (for demo only)
const seedCars = async (req, res) => {
  try {
    const ownerEmail = 'demo-owner@example.com';
    let owner = await User.findOne({ email: ownerEmail });

    if (!owner) {
      owner = await User.create({
        name: 'Demo Owner',
        email: ownerEmail,
        password: 'Demo1234',
        phone: '+10000000000',
        role: 'owner'
      });
    }

    const existingCars = await Car.countDocuments();
    if (existingCars > 0) {
      const cars = await Car.find({}).populate('owner', 'name email phone');
      return res.json({ success: true, message: 'Cars already exist', count: cars.length, cars });
    }

    const sampleCars = [
      {
        owner: owner._id,
        title: '2024 Mercedes-Benz S-Class',
        brand: 'Mercedes',
        model: 'S-Class',
        year: 2024,
        pricePerDay: 250,
        fuelType: 'Petrol',
        seats: 5,
        transmission: 'Automatic',
        description: 'Luxury sedan with premium interiors and unparalleled comfort.',
        location: 'Himachal Pradesh, India',
        features: ['Leather seats', 'GPS Navigation', 'Sunroof', 'Premium sound'],
        isAvailable: true
      },
      {
        owner: owner._id,
        title: '2023 Tesla Model S',
        brand: 'Tesla',
        model: 'Model S',
        year: 2023,
        pricePerDay: 220,
        fuelType: 'Electric',
        seats: 5,
        transmission: 'Automatic',
        description: 'All-electric performance sedan with incredible acceleration and range.',
        location: 'Himachal Pradesh, India',
        features: ['Autopilot', 'Electric', 'Wireless charging'],
        isAvailable: true
      },
      {
        owner: owner._id,
        title: '2022 BMW 7 Series',
        brand: 'BMW',
        model: '7 Series',
        year: 2022,
        pricePerDay: 210,
        fuelType: 'Hybrid',
        seats: 5,
        transmission: 'Automatic',
        description: 'Executive luxury sedan with advanced driving assist features.',
        location: 'Himachal Pradesh, India',
        features: ['Heated seats', 'Panorama roof', 'Premium audio'],
        isAvailable: true
      }
    ];

    const createdCars = await Car.insertMany(sampleCars);
    const cars = await Car.find({}).populate('owner', 'name email phone');
    res.status(201).json({ success: true, message: 'Sample cars seeded', count: cars.length, cars });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   PUT /api/cars/update-locations
// @desc    Update all car locations to Himachal Pradesh, India
// @access  Public (for demo only)
router.put('/update-locations', async (req, res) => {
  try {
    const result = await Car.updateMany({}, { location: 'Himachal Pradesh, India' });
    const cars = await Car.find({}).populate('owner', 'name email phone');
    res.json({ success: true, message: 'All locations updated', count: result.modifiedCount, cars });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/seed', seedCars);
router.get('/seed', seedCars);

// @route   GET /api/cars/:id
// @desc    Get single car by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).populate('owner', 'name email phone');
    
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    
    res.json({ success: true, car });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/cars
// @desc    Create a new car listing (Owner only)
// @access  Private (Owner only)
router.post('/', auth, upload.array('images', 10), async (req, res) => {
  try {
    // Check if user is owner
    if (req.user.role !== 'owner') {
      return res.status(403).json({ message: 'Access denied. Only owners can list cars.' });
    }

    // Process uploaded images
    const imagePaths = req.files ? req.files.map(file => `/images/cars/${file.filename}`) : [];

    const car = await Car.create({
      ...req.body,
      owner: req.user.id,
      images: imagePaths
    });

    res.status(201).json({ success: true, car });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/cars/:id
// @desc    Update a car listing (Owner only)
// @access  Private (Owner only)
router.put('/:id', auth, upload.array('images', 10), async (req, res) => {
  try {
    let car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // Check if user owns this car
    if (car.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied. You can only update your own cars.' });
    }

    // Process uploaded images (append to existing images)
    const imagePaths = req.files ? req.files.map(file => `/images/cars/${file.filename}`) : [];
    const updatedImages = [...(car.images || []), ...imagePaths];

    car = await Car.findByIdAndUpdate(req.params.id, {
      ...req.body,
      images: updatedImages
    }, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, car });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/cars/:id
// @desc    Delete a car listing (Owner only)
// @access  Private (Owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    
    // Check if user owns this car
    if (car.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied. You can only delete your own cars.' });
    }
    
    await car.deleteOne();
    res.json({ success: true, message: 'Car deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/cars/owner/my-cars
// @desc    Get all cars listed by the logged-in owner
// @access  Private (Owner only)
router.get('/owner/my-cars', auth, async (req, res) => {
  try {
    if (req.user.role !== 'owner') {
      return res.status(403).json({ message: 'Access denied. Only owners can access this.' });
    }
    
    const cars = await Car.find({ owner: req.user.id });
    res.json({ success: true, count: cars.length, cars });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
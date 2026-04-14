const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema - Defines how users are stored in database
const UserSchema = new mongoose.Schema({
  // Full name of the user
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  
  // Email address - must be unique
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  
  // Password - will be encrypted before saving
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false  // Don't return password in queries by default
  },
  
  // Phone number
  phone: {
    type: String,
    required: [true, 'Please add a phone number']
  },
  
  // Role: 'user' can rent cars, 'owner' can list cars
  role: {
    type: String,
    enum: ['user', 'owner'],
    default: 'user'
  },
  
  // When user joined (auto-set)
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 🔐 ENCRYPT PASSWORD BEFORE SAVING
UserSchema.pre('save', async function(next) {
  // Only hash password if it's modified (or new)
  if (!this.isModified('password')) {
    return next();
  }
  
  // Hash password with 10 rounds
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔑 METHOD TO CHECK PASSWORD DURING LOGIN
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
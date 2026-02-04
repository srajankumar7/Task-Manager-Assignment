const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false, // ✅ Don't return password by default
  },
}, {
  timestamps: true
});

// ✅ REMOVED pre-save hook - password is hashed in controller
// This prevents double hashing

module.exports = mongoose.model('User', userSchema);
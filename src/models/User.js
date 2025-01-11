const mongoose = require('mongoose');

// Define the schema for the User model
const userSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,  // Ensures that the name field is required
  },
  role: {
    type: String,
    required: true,  // Ensures that the role field is required
    enum: ['admin', 'teacher', 'parent','super'],  // Example roles. You can change this as per your application
  },
  email: {
    type: String,
    required: true,  // Ensures that the email field is required
    unique: true,  // Ensures that email addresses are unique across users
  },
  address: {
    type: String,
    required: false,
  },
  school_ids: [{
    type: mongoose.Schema.Types.ObjectId, // Reference to the School model
    ref: 'School',
  }],
}, {
  timestamps: true  // Automatically adds createdAt and updatedAt fields
});

// Use the model if it's already defined, or create a new one
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;

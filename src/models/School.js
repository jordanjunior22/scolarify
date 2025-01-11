const mongoose = require('mongoose');

// Define the schema for the School model
const schoolSchema = new mongoose.Schema({
  school_id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,  // Ensures that the name field is required
  },
  address: {
    type: String,
    required: false,
  },
  website: {
    type: String,
    required: false,
  },
  phone_number: {
    type: String,
    required: false,
  },
  established_year:{
    type: Date,
  },
  principal_name:{
    type: String,
  }
}, {
  timestamps: true  // Automatically adds createdAt and updatedAt fields
});

// Use the model if it's already defined, or create a new one
const School = mongoose.models.School || mongoose.model('School', schoolSchema);

module.exports = School;

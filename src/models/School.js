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
    required: true,
  },
  classes: [
    {
      type: mongoose.Schema.Types.ObjectId, // Reference to the Class model
      ref: 'Class',
    }
  ]
}, {
  timestamps: true  // Automatically adds createdAt and updatedAt fields
});

// Use the model if it's already defined, or create a new one
const School = mongoose.models.School || mongoose.model('School', schoolSchema);

module.exports = School;

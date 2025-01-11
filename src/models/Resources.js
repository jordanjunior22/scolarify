const mongoose = require('mongoose');

// Define the schema for the Resources model
const resourceSchema = new mongoose.Schema({
  resource_id: {
    type: String,
    required: true, // Ensures that the resource_id field is required
  },
  school_id:{
      type: mongoose.Schema.Types.ObjectId, // Reference to the Attendance model
      ref: 'School',
  },
  name: {
    type: String,
    required: true, // Ensures that title field is required
  },
  resource_type: {
    type: String,
    required: true, // Ensures that type field is required
  },
  link: {
    type: String,
    required: true, // Ensures that link field is required
  },
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Use the model if it's already defined, or create a new one
const Resource = mongoose.models.Resource || mongoose.model('Resource', resourceSchema);

module.exports = Resource;

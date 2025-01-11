const mongoose = require('mongoose');

// Define the schema for the Resources model
const resourceSchema = new mongoose.Schema({
  resource_id: {
    type: String,
    required: true, // Ensures that the resource_id field is required
  },
  title: {
    type: String,
    required: true, // Ensures that title field is required
  },
  type: {
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

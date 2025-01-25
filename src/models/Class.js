const mongoose = require('mongoose');

// Define the schema for the Class model
const classSchema = new mongoose.Schema({
  class_id: {
    type: String,
    required: true,
  },
  school_id:{
    type: mongoose.Schema.Types.ObjectId, // Reference to the Discipline model
    ref: 'School',
  },
  class_level: {
    type: String,
    required: true, // Ensures that the name field is required
  },
  class_code:{
    type: String,
    required: true,
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Use the model if it's already defined, or create a new one
const Class = mongoose.models.Class || mongoose.model('Class', classSchema);

module.exports = Class;

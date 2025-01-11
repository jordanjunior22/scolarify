const mongoose = require('mongoose');

// Define the schema for the Class model
const classSchema = new mongoose.Schema({
  class_id: {
    type: String,
    required: true,
  },
  school: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the Subject model
    ref: 'School',
    required: true, // Ensures that subject field is required
  },
  name: {
    type: String,
    required: true, // Ensures that the name field is required
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId, // Reference to the Student model
      ref: 'Student',
      required: true,
    }
  ],
  subjects: [
    {
      type: mongoose.Schema.Types.ObjectId, // Reference to the Subject model
      ref: 'Subject',
      required: true,
    }
  ]
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Use the model if it's already defined, or create a new one
const Class = mongoose.models.Class || mongoose.model('Class', classSchema);

module.exports = Class;

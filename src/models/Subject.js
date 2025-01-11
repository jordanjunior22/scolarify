const mongoose = require('mongoose');

// Define the schema for the Subject model
const subjectSchema = new mongoose.Schema({
  subject_id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true, // Ensures that the name field is required
  },
  teacher: [
    {
      type: mongoose.Schema.Types.ObjectId, // Reference to the Teacher model
      ref: 'Teacher',
      required: true,
    }
  ]
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Use the model if it's already defined, or create a new one
const Subject = mongoose.models.Subject || mongoose.model('Subject', subjectSchema);

module.exports = Subject;

const mongoose = require('mongoose');

// Define the schema for the Subject model
const subjectSchema = new mongoose.Schema({
  subject_id: {
    type: String,
    required: true,
  },
  school_id :{
    type: mongoose.Schema.Types.ObjectId, // Reference to the Class model
    ref: 'School',
  },
  teacher_id:{
    type: mongoose.Schema.Types.ObjectId, // Reference to the Class model
    ref: 'User',
  },
  class_id:{
    type: mongoose.Schema.Types.ObjectId, // Reference to the Class model
    ref: 'Class',
  },
  name: {
    type: String,
    required: true, 
  },
  description: {
    type: String,
    required: true, 
  },
  coefficient: {
    type: Number,
    required: true, 
  },
  department: {
    type: String,
    required: false, 
  },
  schedule: [{
    day_of_week: { // Day of the week (e.g., "Monday", "Tuesday", etc.)
      type: String,
      required: true,
    },
    start_time: { // Start time for the class
      type: String,  // Example: "09:00 AM"
      required: true,
    },
    end_time: { // End time for the class
      type: String,  // Example: "10:00 AM"
      required: true,
    },
  }],
}, {
  timestamps: true 
});

// Use the model if it's already defined, or create a new one
const Subject = mongoose.models.Subject || mongoose.model('Subject', subjectSchema);

module.exports = Subject;

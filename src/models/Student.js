const mongoose = require('mongoose');

// Define the schema for the Student model
const studentSchema = new mongoose.Schema({
  student_id: {
    type: String,
    required: true, // Ensures that the student_id field is required
  },
  name: {
    type: String,
    required: true, // Ensures that name field is required
  },
  class: {
    type: String,
    required: true, // Ensures that class field is required
  },
  fees: {
    type: Number,
    required: true,
  },
  attendance: [
    {
      type: mongoose.Schema.Types.ObjectId, // Reference to the Attendance model
      ref: 'Attendance',
    }
  ],
  grades: [
    {
      type: mongoose.Schema.Types.ObjectId, // Reference to the Grade model
      ref: 'Grade',
    }
  ],
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Use the model if it's already defined, or create a new one
const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);

module.exports = Student;

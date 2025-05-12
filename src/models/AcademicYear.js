const mongoose = require('mongoose');

// Define the schema for the Academic Year model
const academicYearSchema = new mongoose.Schema({
  academic_year: {
    type: String,
    required: true, // Ensures that the academic_year field is required
    unique: true,  // Ensures that the academic_year is unique
  },
  start_date: {
    type: Date,
    required: true, // Ensures that the start_date field is required
  },
  end_date: {
    type: Date,
    required: true, // Ensures that the end_date field is required
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Use the model if it's already defined, or create a new one
const AcademicYear = mongoose.models.AcademicYear || mongoose.model('AcademicYear', academicYearSchema);

module.exports = AcademicYear;

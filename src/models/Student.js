const mongoose = require('mongoose');

// Define the schema for the Student model
const studentSchema = new mongoose.Schema({
  student_id: {
    type: String,
    required: true, // Ensures that the student_id field is required
  },
  guardian_id: [
      {
        type: mongoose.Schema.Types.ObjectId, // Reference to the Class model
        ref: 'User',
      }
    ],
  school_id:{
      type: mongoose.Schema.Types.ObjectId, // Reference to the Attendance model
      ref: 'School',
  },
  name: {
    type: String,
    required: true, // Ensures that name field is required
  },
  date_of_birth: {
    type: String,
    required: false, // Ensures that name field is required
  },
  fees: {
    type: Number,
    required: true,
  },
  class_id:{
    type: mongoose.Schema.Types.ObjectId, // Reference to the Attendance model
    ref: 'Class',
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: false,
  },
  enrollement_date: {
    type: Date,
    required: false,
  },
  non_compulsory_sbj:[{
    type: mongoose.Schema.Types.ObjectId, // Reference to the Subject model
    ref: 'Subject',
  }],
  status: {
    type: String,
    required: false,  // Ensures that the role field is required
    enum: ['enrolled', 'graduated', 'dropped','not enrolled'],  // Example roles. You can change this as per your application
  },
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Use the model if it's already defined, or create a new one
const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);

module.exports = Student;

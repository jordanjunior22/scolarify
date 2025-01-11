const mongoose = require('mongoose');

// Define the schema for the Attendance model
const attendanceSchema = new mongoose.Schema({
  attendance_id: {
    type: String,
    required: true, // Ensures that the attendance_id field is required
  },
  status: {
    type: Boolean,
    required: true, // Ensures that status field (Present or Absent) is required
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Use the model if it's already defined, or create a new one
const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;

const mongoose = require('mongoose');

// Define the schema for the Grade model
const gradeSchema = new mongoose.Schema({
  grade_id: {
    type: String,
    required: true, // Ensures that the grade_id field is required
  },
  school_id :{
      type: mongoose.Schema.Types.ObjectId, // Reference to the Class model
      ref: 'School',
    },
  subject_id: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the Subject model
    ref: 'Subject',
    required: true, // Ensures that subject field is required
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the Subject model
    ref: 'Student',
    required: true, // Ensures that subject field is required
  },
  exam_type: {
    type: String,
    required: true,
  },
  term:{
    type: String,
    required: true,  // Ensures that the role field is required
    enum: ['First Term', 'Second Term', 'Third Term'],  // Example roles. You can change this as per your application
  },
  academic_year:{
    type:Date,
    required:true,
  },
  grade:{
    type:String
  },
  score: {
    type: Number, // Using Number type for scores (can handle decimals)
    required: true, // Ensures that score field is required
  },
  comments: {
    type: String,
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Use the model if it's already defined, or create a new one
const Grade = mongoose.models.Grade || mongoose.model('Grade', gradeSchema);

module.exports = Grade;

const mongoose = require('mongoose');

// Define the schema for the Resources model
const DisciplineSchema = new mongoose.Schema({
  discipline_id: {
    type: String,
    required: true, // Ensures that the discipline_id field is required
  },
  school_id :{
    type: mongoose.Schema.Types.ObjectId, // Reference to the Class model
    ref: 'School',
  },
  comments: {
    type: String,
  },
  student_id:{
      type: mongoose.Schema.Types.ObjectId, // Reference to the Discipline model
      ref: 'Student',
      required: true,
    },
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Use the model if it's already defined, or create a new one
const Discipline = mongoose.models.Discipline || mongoose.model('Discipline', DisciplineSchema);

module.exports = Discipline;

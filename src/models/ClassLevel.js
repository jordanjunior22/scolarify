const mongoose = require('mongoose');

// Define the schema for the Class model
const ClassLevelSchema = new mongoose.Schema({
  school_id:{
    type: mongoose.Schema.Types.ObjectId, // Reference to the Discipline model
    ref: 'School',
  },
  name:{
    type: String,
    required: true, // Ensures that the name field is required
  },
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Use the model if it's already defined, or create a new one
const ClassLevel = mongoose.models.ClassLevelSchema || mongoose.model('ClassLevel', ClassLevelSchema);

module.exports = ClassLevel;

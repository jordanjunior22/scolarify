const mongoose = require('mongoose');

// Define the schema for the Subject model
const subjectSchema = new mongoose.Schema({
  subject_id: {
    type: String,
    required: true,
  },
  subject_code: {
    type:String,
    required: true,
  },
  compulsory: {
    type:Boolean,
    required:true
  },
  school_id :{
    type: mongoose.Schema.Types.ObjectId, // Reference to the Class model
    ref: 'School',
  },
  class_id :{
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
}, {
  timestamps: true 
});

// Use the model if it's already defined, or create a new one
const Subject = mongoose.models.Subject || mongoose.model('Subject', subjectSchema);

module.exports = Subject;

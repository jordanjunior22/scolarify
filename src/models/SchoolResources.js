const mongoose = require('mongoose');

const SchoolResourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  school_id:{
      type: mongoose.Schema.Types.ObjectId, // Reference to the Attendance model
      ref: 'School',
  },
  enum: [
    'Textbook',
    'Lab Material',
    'Notebook',
    'Uniform',
    'Stationery',
    'Sports Equipment',
    'Arts & Crafts',
    'Electronics',
    'Exam Material',
    'Miscellaneous',
    'Other'
  ],
  description: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  class_level: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the Discipline model
    ref: 'ClassLevel',
  },
}, {
  timestamps: true,
});


const SchoolResource = mongoose.models.SchoolResource || mongoose.model('SchoolResource', SchoolResourceSchema);

module.exports = SchoolResource; 
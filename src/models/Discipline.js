const mongoose = require('mongoose');

// Define the schema for the Resources model
const resourceSchema = new mongoose.Schema({
  discipline_id: {
    type: String,
    required: true, // Ensures that the discipline_id field is required
  },
  comments: {
    type: String,
  },
  student: [ // Updated to include discipline
    {
      type: mongoose.Schema.Types.ObjectId, // Reference to the Discipline model
      ref: 'Student',
      required: true,
    },
  ],
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Use the model if it's already defined, or create a new one
const Discipline = mongoose.models.Resource || mongoose.model('Discipline', DisciplineSchema);

module.exports = Discipline;

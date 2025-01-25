const mongoose = require('mongoose');
// Define the schema for the Announcement model
const announcementSchema = new mongoose.Schema({
  announcement_id: {
    type: String,
    required: true, // Ensures that the announcement_id field is required
  },
  
school_id:{
    type: mongoose.Schema.Types.ObjectId, // Reference to the Attendance model
    ref: 'School',
  },
  announcement: {
    type: String,
  },
}, {
  timestamps: true 
});

// Use the model if it's already defined, or create a new one
const Announcement = mongoose.models.Announcement || mongoose.model('Announcement', announcementSchema);

module.exports = Announcement;

const mongoose = require('mongoose');

// Define the schema for the Announcement model
const announcementSchema = new mongoose.Schema({
  announcement_id: {
    type: String,
    required: true, // Ensures that the announcement_id field is required
  },
  announcement: {
    type: String,
  },
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Use the model if it's already defined, or create a new one
const Announcement = mongoose.models.Announcement || mongoose.model('Announcement', announcementSchema);

module.exports = Announcement;

// controllers/announcementController.js

const Announcement = require('../models/Announcement'); // Assuming you have an Announcement model

const testAnnouncementResponse = (req, res) => {
  res.status(200).json({ message: 'Hi, this is announcement' });
};

// // Get all announcements
const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find();
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// // Create a new announcement
const createAnnouncement = async (req, res) => {
  try {
    const newAnnouncement = new Announcement(req.body);
    await newAnnouncement.save();
    res.status(201).json(newAnnouncement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// // Get an announcement by ID
const getAnnouncementById = async (req, res) => {
  try {
    const announcement = await Announcement.findOne({announcement_id:req.params.id});
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.json(announcement);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// // Update announcement by ID
const updateAnnouncementById = async (req, res) => {
  try {
    const updatedAnnouncement = await Announcement.findByIdAndUpdate({announcement_id:req.params.id}, req.body, { new: true });
    if (!updatedAnnouncement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.json(updatedAnnouncement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// // Delete announcement by ID
const deleteAnnouncementById = async (req, res) => {
  try {
    const deletedAnnouncement = await Announcement.findByIdAndDelete({announcement_id:req.params.id});
    if (!deletedAnnouncement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.json({ message: 'Announcement deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  testAnnouncementResponse,
  getAllAnnouncements,
  createAnnouncement,
  getAnnouncementById,
  updateAnnouncementById,
  deleteAnnouncementById,
};

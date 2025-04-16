// controllers/announcementController.js

const Announcement = require('../models/Announcement'); // Assuming you have an Announcement model
const { ensureUniqueId } = require('../utils/generateId'); 

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
    const announcementId = await ensureUniqueId(Announcement, 'announcement_id', 'ANC');

    // Create the new announcement object, including the generated ID
    const newAnnouncement = new Announcement({
      announcement_id: announcementId,
      ...req.body,
    });
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
    const updatedAnnouncement = await Announcement.findOneAndUpdate({announcement_id:req.params.id}, req.body, { new: true });
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
    const deletedAnnouncement = await Announcement.findOneAndDelete({announcement_id:req.params.id});
    if (!deletedAnnouncement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.json({ message: 'Announcement deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// // Delete multiple announcements by IDs
const deleteMultipleAnnouncements = async (req, res) => {
  const { ids } = req.body; // Expecting an array of announcement_ids in the request body
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: 'Invalid input: ids should be a non-empty array' });
  }

  try {
    // Delete announcements where announcement_id is in the provided array of IDs
    const result = await Announcement.deleteMany({ _id: { $in: ids } });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No announcements found for the provided IDs' });
    }
    
    res.json({ message: `${result.deletedCount} announcements deleted successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete multiple announcements by MongoDB _id
const deleteMultipleAnnouncements = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Please provide ids to delete.' });
    }

    const result = await Announcement.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No announcements found for the provided IDs.' });
    }

    res.json({ 
      message: `${result.deletedCount} announcement(s) deleted successfully.`,
      deletedCount: result.deletedCount
    });
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
  deleteMultipleAnnouncements,
};

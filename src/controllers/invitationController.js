const Invitation = require('../models/Invitation');
const { setInterval } = require("timers");

// Test endpoint
const testInvitationResponse = (req, res) => {
  res.status(200).json({ message: 'Hi, this is the invitation controller' });
};
// Get all invitations
const getAllInvitations = async (req, res) => {
  try {
    const invitations = await Invitation.find();
    res.json(invitations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new invitation
const createInvitation = async (req, res) => {
  try {
    const newInvitation = new Invitation(req.body);
    await newInvitation.save();
    res.status(201).json(newInvitation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get invitation by ID
const getInvitationById = async (req, res) => {
  try {
    const invitation = await Invitation.findById(req.params.id);
    if (!invitation) {
      return res.status(404).json({ message: 'Invitation not found' });
    }
    res.json(invitation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update invitation by ID
const updateInvitationById = async (req, res) => {
  try {
    const updatedInvitation = await Invitation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedInvitation) {
      return res.status(404).json({ message: 'Invitation not found' });
    }
    res.json(updatedInvitation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete invitation by ID
const deleteInvitationById = async (req, res) => {
  try {
    const deletedInvitation = await Invitation.findByIdAndDelete(req.params.id);
    if (!deletedInvitation) {
      return res.status(404).json({ message: 'Invitation not found' });
    }
    res.json({ message: 'Invitation deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete multiple invitations
const deleteMultipleInvitations = async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: 'Invalid input: ids should be a non-empty array' });
  }

  try {
    const result = await Invitation.deleteMany({ _id: { $in: ids } });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No invitation records found for the provided IDs' });
    }
    res.json({ message: `${result.deletedCount} invitation(s) deleted successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  testInvitationResponse,
  getAllInvitations,
  createInvitation,
  getInvitationById,
  updateInvitationById,
  deleteInvitationById,
  deleteMultipleInvitations,
};

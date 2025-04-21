const ClassSchedule = require('../models/ClassSchedule');
const mongoose = require('mongoose');

// Test route response
const testClassScheduleResponse = (req, res) => {
  res.status(200).json({ message: 'Hi, this is class schedule' });
};

// Get all class schedules
const getAllClassSchedules = async (req, res) => {
  try {
    const schedules = await ClassSchedule.find();
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new class schedule
const createClassSchedule = async (req, res) => {
  try {
    const newSchedule = new ClassSchedule(req.body);
    await newSchedule.save();
    res.status(201).json(newSchedule);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get a class schedule by ID
const getClassScheduleById = async (req, res) => {
  const _id = new mongoose.Types.ObjectId(req.params.id);
  try {
    const schedule = await ClassSchedule.findById(_id)
    if (!schedule) {
      return res.status(404).json({ message: 'Class schedule not found' });
    }
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a class schedule by ID
const updateClassScheduleById = async (req, res) => {
  try {
    const updatedSchedule = await ClassSchedule.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!updatedSchedule) {
      return res.status(404).json({ message: 'Class schedule not found' });
    }
    res.json(updatedSchedule);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a class schedule by ID
const deleteClassScheduleById = async (req, res) => {
  try {
    const deletedSchedule = await ClassSchedule.findByIdAndDelete(req.params.id);
    if (!deletedSchedule) {
      return res.status(404).json({ message: 'Class schedule not found' });
    }
    res.json({ message: 'Class schedule deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Delete multiple class schedule records by IDs
const deleteMultipleClassSchedules = async (req, res) => {
  const { ids } = req.body; // Expecting an array of class schedule IDs in the request body
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: 'Invalid input: ids should be a non-empty array' });
  }

  try {
    // Delete class schedule records where _id is in the provided array of IDs
    const result = await ClassSchedule.deleteMany({ _id: { $in: ids } });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No class schedule records found for the provided IDs' });
    }
    
    res.json({ message: `${result.deletedCount} class schedule records deleted successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  testClassScheduleResponse,
  getAllClassSchedules,
  createClassSchedule,
  getClassScheduleById,
  updateClassScheduleById,
  deleteClassScheduleById,
  deleteMultipleClassSchedules,
};

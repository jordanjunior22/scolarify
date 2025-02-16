const ClassSchedule = require('../models/ClassSchedule');

// Test route response
const testClassScheduleResponse = (req, res) => {
  res.status(200).json({ message: 'Hi, this is class schedule' });
};

// Get all class schedules
const getAllClassSchedules = async (req, res) => {
  try {
    const schedules = await ClassSchedule.find()
      .populate('class_id', 'name')
      .populate('subject_id', 'name')
      .populate('period_id')
      .populate('teacher_id', 'name');
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
  try {
    const schedule = await ClassSchedule.findById(req.params.id)
      .populate('class_id', 'name')
      .populate('subject_id', 'name')
      .populate('period_id')
      .populate('teacher_id', 'name');
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
      .populate('class_id', 'name')
      .populate('subject_id', 'name')
      .populate('period_id')
      .populate('teacher_id', 'name');
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

module.exports = {
  testClassScheduleResponse,
  getAllClassSchedules,
  createClassSchedule,
  getClassScheduleById,
  updateClassScheduleById,
  deleteClassScheduleById,
};

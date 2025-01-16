// controllers/attendanceController.js

const Attendance = require('../models/Attendance'); // Assuming you have an Attendance model

const testAttendanceResponse = (req, res) => {
  res.status(200).json({ message: 'Hi, this is attendance' });
};

// // Get all attendance records
const getAllAttendance = async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find();
    res.json(attendanceRecords);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// // Create a new attendance record
const createAttendance = async (req, res) => {
  try {
    const newAttendance = new Attendance(req.body);
    await newAttendance.save();
    res.status(201).json(newAttendance);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// // Get an attendance record by ID
const getAttendanceById = async (req, res) => {
  try {
    const attendance = await Attendance.findOne({attendance_id:req.params.id});
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// // Update attendance record by ID
const updateAttendanceById = async (req, res) => {
  try {
    const updatedAttendance = await Attendance.findByIdAndUpdate({attendance_id:req.params.id}, req.body, { new: true });
    if (!updatedAttendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.json(updatedAttendance);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// // Delete attendance record by ID
const deleteAttendanceById = async (req, res) => {
  try {
    const deletedAttendance = await Attendance.findByIdAndDelete({attendance_id:req.params.id});
    if (!deletedAttendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.json({ message: 'Attendance record deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  testAttendanceResponse,
  getAllAttendance,
  createAttendance,
  getAttendanceById,
  updateAttendanceById,
  deleteAttendanceById,
};

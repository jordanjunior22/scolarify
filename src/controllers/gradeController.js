const Grade = require('../models/Grade'); // Assuming you have a Grade model
const { ensureUniqueId } = require('../utils/generateId'); 
const mongoose = require('mongoose');

const testGradeResponse = (req, res) => {
  res.status(200).json({ message: 'Hi, this is grade' });
};

// // Get all grade records
const getAllGrades = async (req, res) => {
  try {
    const grades = await Grade.find();
    res.json(grades);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// // Create a new grade record
const createGrade = async (req, res) => {
  try {
    const newGrade = new Grade(req.body);
    await newGrade.save();
    res.status(201).json(newGrade);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// // Get a grade record by ID
const getGradeById = async (req, res) => {
  const _id = new mongoose.Types.ObjectId(req.params.id);
  try {
    const grade = await Grade.findById(_id);
    if (!grade) {
      return res.status(404).json({ message: 'Grade record not found' });
    }
    res.json(grade);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// // Update grade record by ID
const updateGradeById = async (req, res) => {
  try {
    const updatedGrade = await Grade.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedGrade) {
      return res.status(404).json({ message: 'Grade record not found' });
    }
    res.json(updatedGrade);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// // Delete grade record by ID
const deleteGradeById = async (req, res) => {
  try {
    const deletedGrade = await Grade.findByIdAndDelete(req.params.id);
    if (!deletedGrade) {
      return res.status(404).json({ message: 'Grade record not found' });
    }
    res.json({ message: 'Grade record deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Delete multiple grade records by IDs
const deleteMultipleGrades = async (req, res) => {
  const { ids } = req.body; // Expecting an array of grade IDs in the request body
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: 'Invalid input: ids should be a non-empty array' });
  }

  try {
    // Delete grade records where _id is in the provided array of IDs
    const result = await Grade.deleteMany({ _id: { $in: ids } });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No grade records found for the provided IDs' });
    }
    
    res.json({ message: `${result.deletedCount} grade records deleted successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  testGradeResponse,
  getAllGrades,
  createGrade,
  getGradeById,
  updateGradeById,
  deleteGradeById,
  deleteMultipleGrades,
};

const Grade = require('../models/Grade'); // Assuming you have a Grade model

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
  try {
    const grade = await Grade.findOne({grade_id:req.params.id});
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
    const updatedGrade = await Grade.findOneAndUpdate({grade_id:req.params.id}, req.body, { new: true });
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
    const deletedGrade = await Grade.findOneAndDelete({grade_id:req.params.id});
    if (!deletedGrade) {
      return res.status(404).json({ message: 'Grade record not found' });
    }
    res.json({ message: 'Grade record deleted successfully' });
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
};

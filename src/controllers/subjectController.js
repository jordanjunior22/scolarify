// controllers/subjectController.js

const Subject = require('../models/Subject'); // Subject model
const { ensureUniqueId } = require('../utils/generateId'); 

const testSubjectResponse = (req, res) => {
  res.status(200).json({ message: 'Hi, this is subject' });
};

// // Get all subjects
const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// // Create a new subject
const createSubject = async (req, res) => {
  try {
    const subjectId = await ensureUniqueId(Subject, 'subject_id', 'SBJ');
    const newSubject = new Subject({subject_id:subjectId , ...req.body});
    await newSubject.save();
    res.status(201).json(newSubject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// // Get a subject by ID
const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findOne({ subject_id: req.params.id });
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    } 
    res.json(subject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 

// // Update subject by ID
const updateSubjectById = async (req, res) => {
  try {
    const updatedSubject = await Subject.findOneAndUpdate(
      { subject_id: req.params.id }, // Find subject by id 
      req.body, // Update with the provided data
      { new: true } // Return the updated subject
    );

    if (!updatedSubject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.json(updatedSubject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// // Delete subject by ID
const deleteSubjectById = async (req, res) => {
  try {
    const deletedSubject = await Subject.findOneAndDelete({ subject_id: req.params.id});
    if (!deletedSubject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    res.json({ message: 'Subject deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete multiple subject records by IDs
const deleteMultipleSubjects = async (req, res) => {
  const { ids } = req.body; // Expecting an array of subject IDs in the request body
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: 'Invalid input: ids should be a non-empty array' });
  }

  try {
    // Delete subject records where _id is in the provided array of IDs
    const result = await Subject.deleteMany({ _id: { $in: ids } });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No subject records found for the provided IDs' });
    }
    
    res.json({ message: `${result.deletedCount} subject records deleted successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  testSubjectResponse,
  getAllSubjects,
  createSubject, 
  getSubjectById,
  updateSubjectById,
  deleteSubjectById,
  deleteMultipleSubjects,
};

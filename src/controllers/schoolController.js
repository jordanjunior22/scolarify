// controllers/schoolController.js
const mongoose = require('mongoose');
const School = require('../models/School'); // Assuming you have a School model
const { ensureUniqueId } = require('../utils/generateId'); 

const testSchoolResponse = (req, res) => {
  res.status(200).json({ message: 'Hi, this is school' });
};

// // Get all schools
const getAllSchools = async (req, res) => {
  try {
    const schools = await School.find();
    res.json(schools);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new school
const createSchool = async (req, res) => {
  try {
    const schoolId = await ensureUniqueId(School, 'school_id', 'SCHL');
    const newSchool = new School({school_id:schoolId, ...req.body});
    await newSchool.save();
    res.status(201).json(newSchool);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// // Get a school by ID
const getSchoolById = async (req, res) => {
  try {
    const school = await School.findOne({school_id:req.params.id});
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }
    res.json(school);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSchoolBy_id = async (req, res) => {
  try {
    const _id = mongoose.Types.ObjectId(req.params.id);

    const school = await School.findById(_id);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }
    res.json(school);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// // Update school by ID
const updateSchoolById = async (req, res) => {
  try {
    const updatedSchool = await School.findOneAndUpdate({school_id:req.params.id}, req.body, { new: true });
    if (!updatedSchool) {
      return res.status(404).json({ message: 'School not found' });
    }
    res.json(updatedSchool);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// // Delete school by ID
const deleteSchoolById = async (req, res) => {
  try {
  const deletedSchool = await School.findOneAndDelete({school_id:req.params.id});
    if (!deletedSchool) {
      return res.status(404).json({ message: 'School not found' });
    }
    res.json({ message: 'School deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete multiple school records by IDs
const deleteMultipleSchools = async (req, res) => {
  const { ids } = req.body; // Expecting an array of school IDs in the request body
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: 'Invalid input: ids should be a non-empty array' });
  }

  try {
    // Delete school records where _id is in the provided array of IDs
    const result = await School.deleteMany({ _id: { $in: ids } });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No school records found for the provided IDs' });
    }
    
    res.json({ message: `${result.deletedCount} school records deleted successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  testSchoolResponse,
  getAllSchools,
  createSchool,
  getSchoolById,
  getSchoolBy_id,
  updateSchoolById,
  deleteSchoolById,
  deleteMultipleSchools,
};

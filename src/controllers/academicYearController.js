const AcademicYear = require('../models/AcademicYear');

// Test response
const testAcademicYearResponse = (req, res) => {
  res.status(200).json({ message: 'Hi, this is academic year' });
};

// Get all academic years
const getAllAcademicYears = async (req, res) => {
  try {
    const academicYears = await AcademicYear.find();
    res.json(academicYears);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new academic year
const createAcademicYear = async (req, res) => {
  try {
    const { academic_year, start_date, end_date } = req.body;

    const existing = await AcademicYear.findOne({ academic_year });
    if (existing) {
      return res.status(400).json({ message: 'Academic year already exists' });
    }

    const newYear = new AcademicYear({
      academic_year,
      start_date,
      end_date,
    });

    await newYear.save();
    res.status(201).json(newYear);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get academic year by ID
const getAcademicYearById = async (req, res) => {
  try {
    const year = await AcademicYear.findById(req.params.id);
    if (!year) {
      return res.status(404).json({ message: 'Academic year not found' });
    }
    res.json(year);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update academic year by ID
const updateAcademicYearById = async (req, res) => {
  try {
    const updatedYear = await AcademicYear.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedYear) {
      return res.status(404).json({ message: 'Academic year not found' });
    }

    res.json(updatedYear);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete academic year by ID
const deleteAcademicYearById = async (req, res) => {
  try {
    const deletedYear = await AcademicYear.findByIdAndDelete(req.params.id);
    if (!deletedYear) {
      return res.status(404).json({ message: 'Academic year not found' });
    }
    res.json({ message: 'Academic year deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete multiple academic years by IDs
const deleteMultipleAcademicYears = async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: 'Invalid input: ids should be a non-empty array' });
  }

  try {
    const result = await AcademicYear.deleteMany({ _id: { $in: ids } });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No academic years found for the provided IDs' });
    }
    res.json({ message: `${result.deletedCount} academic years deleted successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  testAcademicYearResponse,
  getAllAcademicYears,
  createAcademicYear,
  getAcademicYearById,
  updateAcademicYearById,
  deleteAcademicYearById,
  deleteMultipleAcademicYears,
};

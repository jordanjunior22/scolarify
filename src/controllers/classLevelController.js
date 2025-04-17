const ClassLevel = require('../models/ClassLevel');

// Test route to verify connection
const testClassLevel = (req, res) => {
  res.status(200).json({ message: 'Class Level controller working 🚀' });
};

// Get all class levels
const getAllClassLevels = async (req, res) => {
    try {
      const levels = await ClassLevel.find(); // 
      res.json(levels);
    } catch (err) {
      res.status(500).json({ message: err.message });a
    }
  };

// Create a new class level
const createClassLevel = async (req, res) => {
  try {
    const { school_id, name } = req.body;

    const newLevel = new ClassLevel({
      school_id,
      name,
    });

    await newLevel.save();
    res.status(201).json(newLevel);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get a class level by ID
const getClassLevelById = async (req, res) => {
  try {
    const level = await ClassLevel.findById(req.params.id); // Removed .populate
    if (!level) {
      return res.status(404).json({ message: 'Class Level not found' });
    }
    res.json(level);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a class level by ID
const updateClassLevelById = async (req, res) => {
  try {
    const updated = await ClassLevel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Class Level not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a class level by ID
const deleteClassLevelById = async (req, res) => {
  try {
    const deleted = await ClassLevel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Class Level not found' });
    }
    res.json({ message: 'Class Level deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete multiple class levels
const deleteMultipleClassLevels = async (req, res) => {
  const { ids } = req.body; // expects an array of Mongo ObjectIds
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: 'Invalid input: ids should be a non-empty array' });
  }

  try {
    const result = await ClassLevel.deleteMany({ _id: { $in: ids } });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No class levels found for the provided IDs' });
    }

    res.json({ message: `${result.deletedCount} class levels deleted successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  testClassLevel,
  getAllClassLevels,
  createClassLevel,
  getClassLevelById,
  updateClassLevelById,
  deleteClassLevelById,
  deleteMultipleClassLevels,
};

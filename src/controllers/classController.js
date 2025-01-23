// controllers/classController.js

const Class = require('../models/Class'); // Assuming you have a Class model
const { ensureUniqueId } = require('../utils/generateId'); 

const testClassResponse = (req, res) => {
  res.status(200).json({ message: 'Hi, this is class' });
};

// // Get all classes
const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find();
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// // Create a new class
const createClass = async (req, res) => {
  try {
    const classId = await ensureUniqueId(Class, 'class_id', 'CLS');
    const newClass = new Class({class_id:classId, ...req.body});
    await newClass.save();
    res.status(201).json(newClass);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// // Get a class by ID
const getClassById = async (req, res) => {
  try {
    const classItem = await Class.findOne({class_id:req.params.id});
    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.json(classItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// // Update class by ID
const updateClassById = async (req, res) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate({class_id:req.params.id}, req.body, { new: true });
    if (!updatedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.json(updatedClass);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// // Delete class by ID
const deleteClassById = async (req, res) => {
  try {
    const deletedClass = await Class.findByIdAndDelete({class_id:req.params.id});
    if (!deletedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.json({ message: 'Class deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  testClassResponse,
  getAllClasses,
  createClass,
  getClassById,
  updateClassById,
  deleteClassById,
};

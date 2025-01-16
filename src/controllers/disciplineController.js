// controllers/disciplineController.js

const Discipline = require('../models/Discipline'); // Assuming you have a Discipline model

const testDisciplineResponse = (req, res) => {
  res.status(200).json({ message: 'Hi, this is discipline' });
};

// // Get all disciplines
const getAllDisciplines = async (req, res) => {
  try {
    const disciplines = await Discipline.find();
    res.json(disciplines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// // Create a new discipline
const createDiscipline = async (req, res) => {
  try {
    const newDiscipline = new Discipline(req.body);
    await newDiscipline.save();
    res.status(201).json(newDiscipline);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// // Get a discipline by ID
const getDisciplineById = async (req, res) => {
  try {
    const discipline = await Discipline.findOne({discipline_id:req.params.id});
    if (!discipline) {
      return res.status(404).json({ message: 'Discipline not found' });
    }
    res.json(discipline);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// // Update discipline by ID
const updateDisciplineById = async (req, res) => {
  try {
    const updatedDiscipline = await Discipline.findByIdAndUpdate({discipline_id:req.params.id}, req.body, { new: true });
    if (!updatedDiscipline) {
      return res.status(404).json({ message: 'Discipline not found' });
    }
    res.json(updatedDiscipline);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// // Delete discipline by ID
const deleteDisciplineById = async (req, res) => {
  try {
    const deletedDiscipline = await Discipline.findByIdAndDelete({discipline_id:req.params.id});
    if (!deletedDiscipline) {
      return res.status(404).json({ message: 'Discipline not found' });
    }
    res.json({ message: 'Discipline deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  testDisciplineResponse,
  getAllDisciplines,
  createDiscipline,
  getDisciplineById,
  updateDisciplineById,
  deleteDisciplineById,
};

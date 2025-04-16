// controllers/disciplineController.js

const Discipline = require('../models/Discipline'); // Assuming you have a Discipline model
const { ensureUniqueId } = require('../utils/generateId'); 

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
    const disciplineId = await ensureUniqueId(Discipline, 'discipline_id', 'DSP');
    const newDiscipline = new Discipline({discipline_id:disciplineId, ...req.body});
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
    const updatedDiscipline = await Discipline.findOneAndUpdate({discipline_id:req.params.id}, req.body, { new: true });
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
    const deletedDiscipline = await Discipline.findOneAndDelete({discipline_id:req.params.id});
    if (!deletedDiscipline) {
      return res.status(404).json({ message: 'Discipline not found' });
    }
    res.json({ message: 'Discipline deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Delete multiple discipline records by IDs
const deleteMultipleDisciplines = async (req, res) => {
  const { ids } = req.body; // Expecting an array of discipline IDs in the request body
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: 'Invalid input: ids should be a non-empty array' });
  }

  try {
    // Delete discipline records where _id is in the provided array of IDs
    const result = await Discipline.deleteMany({ _id: { $in: ids } });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No discipline records found for the provided IDs' });
    }
    
    res.json({ message: `${result.deletedCount} discipline records deleted successfully` });
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
  deleteMultipleDisciplines,
};

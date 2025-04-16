const Period = require('../models/Periods');
// Test response
const testPeriodResponse = (req, res) => {
  res.status(200).json({ message: "Hi, this is the period controller" });
};

// Get all periods
const getAllPeriods = async (req, res) => {
  try {
    const periods = await Period.find().populate("school_id", "name");
    res.json(periods);
  } catch (err) {
    res.status(500).json({ message: err.message });  
  }
};

// Create a new period
const createPeriod = async (req, res) => {
  try {
    const newPeriod = new Period(req.body);
    await newPeriod.save();
    res.status(201).json(newPeriod);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get a period by ID
const getPeriodById = async (req, res) => {
  try {
    const period = await Period.findById(req.params.id).populate("school_id", "name");
    if (!period) {
      return res.status(404).json({ message: "Period not found" });
    }
    res.json(period);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a period by ID
const updatePeriodById = async (req, res) => {
  try {
    const updatedPeriod = await Period.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPeriod) {
      return res.status(404).json({ message: "Period not found" });
    }
    res.json(updatedPeriod);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a period by ID
const deletePeriodById = async (req, res) => {
  try {
    const deletedPeriod = await Period.findByIdAndDelete(req.params.id);
    if (!deletedPeriod) {
      return res.status(404).json({ message: "Period not found" });
    }
    res.json({ message: "Period deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete multiple period records by IDs
const deleteMultiplePeriods = async (req, res) => {
  const { ids } = req.body; // Expecting an array of period IDs in the request body
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: 'Invalid input: ids should be a non-empty array' });
  }

  try {
    // Delete period records where _id is in the provided array of IDs
    const result = await Period.deleteMany({ _id: { $in: ids } });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No period records found for the provided IDs' });
    }
    
    res.json({ message: `${result.deletedCount} period records deleted successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  testPeriodResponse,
  getAllPeriods,
  createPeriod,
  getPeriodById,
  updatePeriodById,
  deletePeriodById,
  deleteMultiplePeriods,
};

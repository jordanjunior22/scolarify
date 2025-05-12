const Fee = require('../models/Fees');
const mongoose = require('mongoose');
 
// Test response
const testFeeResponse = (req, res) => {
  res.status(200).json({ message: 'Hi, this is the fee response' });
};

// Get all fee records
const getAllFees = async (req, res) => {
  try {
    const fees = await Fee.find();
    res.status(200).json(fees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new fee record
const createFee = async (req, res) => {
  try {
    const { school_id, fee_type, amount } = req.body;

    // Validation: Check if required fields are provided
    if (!school_id || !fee_type || !amount) {
      return res.status(400).json({ message: 'School ID, Fee Type, and Amount are required.' });
    }

    // Create a new fee document
    const newFee = new Fee({
      school_id,
      fee_type,
      amount,
    });

    // Save the fee document to the database
    await newFee.save();
    res.status(201).json(newFee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get fee by ID
const getFeeById = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);
    if (!fee) {
      return res.status(404).json({ message: 'Fee record not found' });
    }
    res.status(200).json(fee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update fee by ID
const updateFeeById = async (req, res) => {
  try {
    const updatedFee = await Fee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedFee) {
      return res.status(404).json({ message: 'Fee record not found' });
    }
    res.status(200).json(updatedFee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete fee by ID
const deleteFeeById = async (req, res) => {
  try {
    const deletedFee = await Fee.findByIdAndDelete(req.params.id);
    if (!deletedFee) {
      return res.status(404).json({ message: 'Fee record not found' });
    }
    res.status(200).json({ message: 'Fee record deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete multiple fees
const deleteMultipleFees = async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: 'Invalid input: ids should be a non-empty array' });
  }

  try {
    const result = await Fee.deleteMany({ _id: { $in: ids } });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No fees found for the provided IDs' });
    }
    res.status(200).json({ message: `${result.deletedCount} fee records deleted successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get all fees for a specific school
const getFeesBySchoolId = async (req, res) => {
  try {
    const { school_id } = req.params;

    if (!school_id) {
      return res.status(400).json({ message: 'School ID is required' });
    }

    // Fetch the fees associated with the given school_id
    const fees = await Fee.find({ school_id })

    if (fees.length === 0) {
      return res.status(404).json({ message: 'No fees found for this school' });
    }

    res.status(200).json(fees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  testFeeResponse,
  getAllFees,
  createFee,
  getFeeById,
  updateFeeById,
  deleteFeeById, 
  deleteMultipleFees,
  getFeesBySchoolId,
};

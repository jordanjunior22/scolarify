const FeePayment = require('../models/FeePayment');
const mongoose = require('mongoose');

// Test route
const testFeePayment = (req, res) => {
    res.status(200).json({ message: 'Fee payment service is active' });
};

// Create a new fee payment
const generateTransactionRef = () => {
    const randomPart = crypto.randomBytes(4).toString('hex').toUpperCase();
    const timestamp = Date.now();
    return `TXN-${timestamp}-${randomPart}`;
};

// Create a new fee payment
const createFeePayment = async (req, res) => {
    try {
        const body = req.body;

        // Generate transaction reference

        if (body.paymentMode === 'installment' && Array.isArray(body.installments)) {
            // Assign a unique transactionRef to each installment (or you could use the same one)
            body.installments = body.installments.map(inst => ({
                ...inst,
            }));
        }

        const newPayment = new FeePayment({
            ...body,
            // transactionRef: body.paymentMode === 'full' ? transactionRef : undefined, // Optional top-level field
        });

        await newPayment.save();
        res.status(201).json(newPayment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get all fee payments
const getAllFeePayments = async (req, res) => {
    try {
        const payments = await FeePayment.find();
        res.json(payments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a fee payment by ID
const getFeePaymentById = async (req, res) => {
    try {
        const payment = await FeePayment.findById(req.params.id);
        if (!payment) {
            return res.status(404).json({ message: 'Fee payment not found' });
        }
        res.json(payment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a fee payment
const updateFeePayment = async (req, res) => {
    try {
        const updated = await FeePayment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) {
            return res.status(404).json({ message: 'Fee payment not found' });
        }
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a fee payment
const deleteFeePayment = async (req, res) => {
    try {
        const deleted = await FeePayment.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Fee payment not found' });
        }
        res.json({ message: 'Fee payment deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
const getFeePaymentsBySchoolId = async (req, res) => {
    const { school_id } = req.params;

    if (!school_id) {
      return res.status(400).json({ message: 'School ID is required' });
    }

    try {
      const payments = await FeePayment.find({ school_id});
      res.json(payments);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  const getFeePaymentsByStudentId = async (req, res) => {
    const { student_id } = req.params;
    if (!student_id) {
        return res.status(400).json({ message: 'student ID is required' });
      }
    try {
        const payments = await FeePayment.find({ student_id});
        res.json(payments);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
module.exports = {
    testFeePayment,
    createFeePayment,
    getAllFeePayments,
    getFeePaymentById,
    updateFeePayment,
    deleteFeePayment,
    getFeePaymentsByStudentId,
    getFeePaymentsBySchoolId,
};

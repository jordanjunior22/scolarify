const express = require('express');

const feePaymentController = require('../controllers/feePaymentController');

const router = express.Router();

// Test route for Fee Payment
router.get('/test', feePaymentController.testFeePayment);

// GET all fee payments
router.get('/get-fee-payments', feePaymentController.getAllFeePayments);

// GET a fee payment by ID
router.get('/get-fee-payment/:id', feePaymentController.getFeePaymentById);

// POST to create a new fee payment
router.post('/create-fee-payment', feePaymentController.createFeePayment);

// PUT to update a fee payment by ID
router.put('/update-fee-payment/:id', feePaymentController.updateFeePayment);

// DELETE to remove a fee payment by ID
router.delete('/delete-fee-payment/:id', feePaymentController.deleteFeePayment);

// GET fee payments by school ID
router.get('/get-fee-payments-by-school/:school_id', feePaymentController.getFeePaymentsBySchoolId);

// GET fee payments by student ID
router.get('/get-fee-payments-by-student/:student_id', feePaymentController.getFeePaymentsByStudentId);

module.exports = router;

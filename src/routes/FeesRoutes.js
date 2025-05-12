const express = require('express');

const feeController = require('../controllers/FeesController');

const router = express.Router();

// Test route for Fee
router.get('/test', feeController.testFeeResponse);

// GET all fees
router.get('/get-fees', feeController.getAllFees);

// GET a fee by ID
router.get('/get-fee/:id', feeController.getFeeById);

// POST to create a new fee record
router.post('/create-fee', feeController.createFee);

// PUT to update a fee by ID
router.put('/update-fee/:id', feeController.updateFeeById);

// DELETE to remove a fee by ID
router.delete('/delete-fee/:id', feeController.deleteFeeById);

// DELETE multiple fees by IDs
router.delete('/delete-fees', feeController.deleteMultipleFees);
router.get('/get-fees-by-school/:school_id', feeController.getFeesBySchoolId);


module.exports = router;

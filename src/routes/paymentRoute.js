const express = require('express');

const paymentController = require('../controllers/paymentController');
const { authenticate, authorize } = require('../middleware/middleware');

const router = express.Router();
router.post('/webhook', paymentController.handleWebhook);
router.post('/initiatepay',paymentController.initiatePayment)
module.exports = router;
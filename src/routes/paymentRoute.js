const express = require('express');

const paymentController = require('../controllers/paymentController');
const { authenticate, authorize } = require('../middleware/middleware');

const router = express.Router();
router.post('/webhook',express.json(), paymentController.handleWebhook);
router.post('/initiatepay',paymentController.initiatePayment)
router.get('/payment-status/:transId',paymentController.checkPaymentStatus)

module.exports = router;
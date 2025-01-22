const express = require('express');
const webhookController = require('../controllers/paymentController');
const { authenticate, authorize } = require('../middleware/middleware');

const router = express.Router();
router.post('/webhook', webhookController.handleWebhook);
module.exports = router;
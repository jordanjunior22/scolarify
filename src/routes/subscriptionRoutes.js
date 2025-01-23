const express = require('express');
const subscriptionController = require('../controllers/subscriptionController'); // Updated controller import
const { authenticate, authorize, checkSubscription } = require('../middleware/middleware');

const router = express.Router();

// Test route for subscription controller
// router.get('/test', subscriptionController.testSubscriptionResponse);

// GET /subscriptions to fetch all subscription records
router.get('/get-subscriptions' , authenticate, checkSubscription, authorize(['admin', 'super', 'parent']) , subscriptionController.getAllSubscriptions);

// GET /subscription by id
router.get('/get-subscription/:id' , authenticate, checkSubscription, authorize(['admin', 'super', 'parent']) , subscriptionController.getSubscriptionById);

// POST /subscriptions to create a new subscription record
router.post('/create-subscription', authenticate, checkSubscription, authorize(['admin', 'super', 'parent']) , subscriptionController.createSubscription);

// PUT /subscriptions/:id to update a specific subscription record
router.put('/update-subscription/:id' , authenticate, authorize(['admin', 'super']) , subscriptionController.updateSubscriptionById);

// DELETE /subscriptions/:id to delete a specific subscription record
router.delete('/delete-subscription/:id', authenticate, authorize(['super']),  subscriptionController.deleteSubscriptionById);

module.exports = router;

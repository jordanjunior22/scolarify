const express = require('express');
const subscriptionController = require('../controllers/subscriptionController'); // Updated controller import

const router = express.Router();

// Test route for subscription controller
router.get('/test', subscriptionController.testSubscriptionResponse);

// GET /subscriptions to fetch all subscription records
router.get('/get-subscriptions', subscriptionController.getAllSubscriptions);

// GET /subscription by id
router.get('/get-subscription/:id', subscriptionController.getSubscriptionById);

// POST /subscriptions to create a new subscription record
router.post('/create-subscription', subscriptionController.createSubscription);

// PUT /subscriptions/:id to update a specific subscription record
router.put('/update-subscription/:id', subscriptionController.updateSubscriptionById);

// DELETE /subscriptions/:id to delete a specific subscription record
router.delete('/delete-subscription/:id', subscriptionController.deleteSubscriptionById);

module.exports = router;

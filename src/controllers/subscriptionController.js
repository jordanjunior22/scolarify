// controllers/subscriptionController.js

const Subscription = require('../models/Subscription'); // Assuming you have a Subscription model

// Test route to check if subscription controller is working
const testSubscriptionResponse = (req, res) => {
  res.status(200).json({ message: 'Hi, this is subscription' });
};

// Get all subscription records
const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    res.json(subscriptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new subscription record
const createSubscription = async (req, res) => {
  try {
    const newSubscription = new Subscription(req.body);
    await newSubscription.save();
    res.status(201).json(newSubscription);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get a subscription record by ID
const getSubscriptionById = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ subscription_id: req.params.id });
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription record not found' });
    }
    res.json(subscription);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update subscription record by ID
const updateSubscriptionById = async (req, res) => {
  try {
    const updatedSubscription = await Subscription.findOneAndUpdate({ subscription_id: req.params.id }, req.body, { new: true });
    if (!updatedSubscription) {
      return res.status(404).json({ message: 'Subscription record not found' });
    }
    res.json(updatedSubscription);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete subscription record by ID
const deleteSubscriptionById = async (req, res) => {
  try {
    const deletedSubscription = await Subscription.findOneAndDelete({ subscription_id: req.params.id });
    if (!deletedSubscription) {
      return res.status(404).json({ message: 'Subscription record not found' });
    }
    res.json({ message: 'Subscription record deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  testSubscriptionResponse,
  getAllSubscriptions,
  createSubscription,
  getSubscriptionById,
  updateSubscriptionById,
  deleteSubscriptionById,
};

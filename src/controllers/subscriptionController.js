// controllers/subscriptionController.js

const Subscription = require('../models/Subscription'); // Assuming you have a Subscription model
const { ensureUniqueId } = require('../utils/generateId'); 

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
    const subscriptionId = await ensureUniqueId(Subscription, 'subscription_id', 'SUB');
    const newSubscription = new Subscription({subscription_id:subscriptionId , ...req.body});
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

// Delete multiple subscription records by IDs
const deleteMultipleSubscriptions = async (req, res) => {
  const { ids } = req.body; // Expecting an array of subscription IDs in the request body
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: 'Invalid input: ids should be a non-empty array' });
  }

  try {
    // Delete subscription records where _id is in the provided array of IDs
    const result = await Subscription.deleteMany({ _id: { $in: ids } });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No subscription records found for the provided IDs' });
    }
    
    res.json({ message: `${result.deletedCount} subscription records deleted successfully` });
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
  deleteMultipleSubscriptions,
};

// controllers/webhookController.js
const fapshi = require('../utils/fapshi');
const mongoose = require('mongoose');
const moment = require('moment'); // Moment.js for date handling
const { ensureUniqueId } = require('../utils/generateId'); // Utility to generate unique IDs
const Subscription = require('../models/Subscription');
const User = require('../models/User');

async function handleWebhook(req, res) {
  try {
    // Get the transaction status from fapshi's API to be sure of its source
    const event = await fapshi.paymentStatus(req.body.transId);

    console.log('Webhook event:', event); // Log the event for debugging

    // if (event.statusCode !== 200) {
    //   return res.status(400).send({ message: event.message });
    // }

    const { transId, status, email, amount, dateInitiated, userId,externalId } = event;
    const subscriptionId = await ensureUniqueId(Subscription, 'subscription_id', 'SUB');
    const student_id = externalId.split("_");
    // Handle the event based on the status
    switch (status) {
      case 'SUCCESSFUL':
        // Calculate the expiry date for a yearly subscription
        const expiryDate = moment(dateInitiated).add(1, 'year').toDate();

        const subscriptionData = {
          transaction_id: transId,
          email: email,
          amount: amount,
          expiryDate: expiryDate,
          status: true, // Mark as active
          student_id:student_id,
          subscription_id: subscriptionId,
          guardian_id: userId, // Assuming userId is the guardian (optional, depending on your model)
        };

        // Check if subscription already exists with the same transaction_id
        let subscription = await Subscription.findOne({ guardian_id: userId });

        // If not, create a new subscription
        if (!subscription) {
          subscription = new Subscription(subscriptionData);
        } else {
          // Update the existing subscription (if necessary)
          subscription.expiryDate = expiryDate;
          subscription.transaction_id = transId,
          subscription.student_id = student_id,
          subscription.status = true; // Ensure the subscription is active
          subscription.subscription_id = subscriptionId; // Ensure unique subscription_id is added
        }

        // Save the subscription
        await subscription.save();
        break;

      case 'FAILED':
        // Mark subscription as inactive and log failure
        console.log(`Payment failed for transaction ${transId}`);
        let failedSubscription = await Subscription.findOne({ guardian_id: userId });

        if (failedSubscription) {
          subscription.transaction_id = transId,
          failedSubscription.status = false; 
          failedSubscription.expiryDate = null;
          await failedSubscription.save();
        }
        break;

      case 'EXPIRED':
        // Mark subscription as expired
        console.log(`Payment expired for transaction ${transId}`);
        let expiredSubscription = await Subscription.findOne({ guardian_id: userId });

        if (expiredSubscription) {
          subscription.transaction_id = transId,
          expiredSubscription.status = false; 
          expiredSubscription.expiryDate = null;
          await expiredSubscription.save();
        } 
        break;

      default:
        console.log(`Unhandled event status: ${event.status}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.send();
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

const initiatePayment = async (req, res) => {
  try {
    const { userId, amount, email, externalId,redirectUrl,webhook } = req.body;
    const objectId = new mongoose.Types.ObjectId(userId); // Use 'new' keyword

    // Check if the user exists and has the role 'parent'
    const user = await User.findById(objectId);
    if (!user || user.role !== 'parent') {
      return res.status(403).json({ message: 'You do not have permission to initiate a payment.' });
    }

    // Proceed with initiating the payment
    const response = await fapshi.initiatePay({userId, amount, email, externalId, redirectUrl,webhook});

    res.status(200).json(response);
  } catch (error) {
    console.error('Error handling payment:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const checkPaymentStatus = async (req, res) => {
  try {
    const { transId } = req.params;
    const response = await fapshi.paymentStatus(transId)

    res.status(200).json(response);
  } catch (error) {
    console.error('Error checking payment status:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
module.exports = { handleWebhook,initiatePayment, checkPaymentStatus};

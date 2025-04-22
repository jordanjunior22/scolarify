// controllers/webhookController.js
const fapshi = require('../utils/fapshi');
const moment = require('moment'); // Moment.js for date handling
const { ensureUniqueId } = require('../utils/generateId'); // Utility to generate unique IDs
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const cinetpay = require('../utils/cinetpay'); // Assuming you have a CinetPay utility for payment processing

const handleWebhook = async (req, res) => {
  try {
    const { code, message, data } = req.body;

    // Extract necessary fields from the `data` object
    const { amount, currency, status, payment_date, operator_id, metadata, customer_email } = data;

    // Extract user ID (and other details) from metadata if available
    const { userId, students_ids } = metadata ? JSON.parse(metadata) : {};

    // Use a switch statement to handle different payment statuses
    switch (status) {
      case "ACCEPTED":
        // Payment was successful
        console.log(`Payment Accepted: ${operator_id}`);

        // Calculate the subscription expiry date (e.g., 1 year from payment date)
        const expiryDate = moment(payment_date).add(1, "year").toDate();

        // Create or update subscription data
        const subscriptionId = await ensureUniqueId(Subscription, 'subscription_id', 'SUB');

        const subscriptionData = {
          transaction_id: operator_id,
          email: customer_email, // Replace with the actual email from metadata if available
          amount: amount,
          currency: currency,
          expiryDate: expiryDate,
          status: true, // Mark as active
          student_ids: students_ids || [], // Use students_ids from metadata if available
          subscription_id: subscriptionId,
          guardian_id: userId, // Assuming userId is the guardian (from metadata)
        };

        // Check if subscription already exists with the same user_id
        let subscription = await Subscription.findOne({ guardian_id: userId });

        // If no subscription exists, create a new one
        if (!subscription) {
          subscription = new Subscription(subscriptionData);
        } else {
          // If subscription exists, update the details
          subscription.expiryDate = expiryDate;
          subscription.transaction_id = operator_id;
          subscription.student_ids = students_ids || []; // Update student IDs
          subscription.status = true; // Active subscription
          subscription.subscription_id = subscriptionId; // Ensure unique subscription_id
        }

        // Save the subscription to the database
        await subscription.save();
        res.status(200).send({ message: "Subscription updated successfully." });
        break;

      case "REFUSED":
        // Payment failed or transaction was canceled, mark the subscription as inactive
        console.log(`Payment Failed or Transaction Canceled: ${operator_id}`);

        let failedSubscription = await Subscription.findOne({ guardian_id: userId });

        if (failedSubscription) {
          failedSubscription.transaction_id = operator_id;
          failedSubscription.status = false; // Mark as inactive
          failedSubscription.expiryDate = null; // Remove expiry date
          await failedSubscription.save();
        }
        res.status(200).send({ message: "Payment failed or transaction canceled. Subscription not activated." });
        break;

      default:
        // Unhandled payment status
        console.log(`Unhandled payment status: ${status}`);
        res.status(400).send({ message: "Unhandled payment status." });
        break;
    }

  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).send({ message: "Internal Server Error", error: error.message });
  }
};

const initiatePayment = async (req, res) => {
  try {
    const { userId, amount, email, students_ids, return_url } = req.body;
    const notify_url = process.env.CINETPAY_WEBHOOK_URL || "https://scolarify.onrender.com/payment/webhook"; // Replace with your actual webhook URL
    // Validate required fields
    if (!userId || !amount || !email || !students_ids || !notify_url || !return_url) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const students_ids_str = students_ids.join('_');

    // Call CinetPay's initiate payment function
    const paymentResponse = await cinetpay.initiatePay({
      userId,
      amount,
      email,
      students_ids_str,
      notify_url,
      return_url
    });

    // Return response with payment URL to redirect user for payment
    res.status(200).json({
      message: "Payment initiation successful",
      payment_url: paymentResponse.payment_url,
      transaction_id: paymentResponse.transaction_id
    });
  } catch (error) {
    console.error("Error initiating payment:", error);
    res.status(500).json({ message: "Failed to initiate payment with CinetPay", error: error.message });
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
module.exports = { handleWebhook, initiatePayment, checkPaymentStatus };

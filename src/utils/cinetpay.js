// utils/cinetpay.js
const axios = require("axios");
const dotenv = require('dotenv');
// Load environment variables
dotenv.config();

const BASE_URL = "https://api-checkout.cinetpay.com/v2";
const API_KEY = process.env.CINETPAY_API_KEY;
const SITE_ID = process.env.CINETPAY_SITE_ID;

/**
 * Initiates a CinetPay payment
 * @param {Object} params - Payment details
 * @param {string} params.userId - The user initiating the payment
 * @param {number} params.amount - Amount in XAF
 * @param {string} params.email - Customer email
 * @param {string[]} params.students_ids - Array of student IDs being paid for
 * @param {string} params.notify_url - Webhook endpoint for CinetPay
 * @param {string} params.return_url - URL to redirect after payment
 * @param {string} [params.channels="ALL"] - Payment method (optional)
 * @returns {Promise<Object>} - The response from CinetPay
 */
async function initiatePay({
  userId,
  amount,
  email,
  students_ids_str,
  notify_url,
  return_url,
  channels = "ALL"
}) {
  const transaction_id = `txn_${Date.now()}`;

  const payload = {
    apikey: "2929531236807a97f60d944.99385107",
    site_id: "105892960",
    transaction_id,
    amount,
    currency: "XAF",
    description: "Student Subscription Payment",
    customer_name: email,
    customer_email: email,
    notify_url,
    return_url,
    channels,
    customer_id: userId,
    metadata: students_ids_str
  };

  try {
    const response = await axios.post(`${BASE_URL}/payment`, payload, {
      headers: { "Content-Type": "application/json" }
    });

    return {
      success: true,
      payment_url: response.data.data.payment_url,
      transaction_id: transaction_id
    };
  } catch (error) {
    console.error("CinetPay payment initiation error:", error?.response?.data || error.message);
    throw new Error("Failed to initiate payment with CinetPay");
  }
}

/**
 * Check payment status from CinetPay
 * @param {string} transaction_id
 * @returns {Promise<Object>}
 */
async function paymentStatus(transaction_id) {
  const payload = {
    apikey: API_KEY,
    site_id: SITE_ID,
    transaction_id
  };

  try {
    const response = await axios.post(`${BASE_URL}/payment/check`, payload, {
      headers: { "Content-Type": "application/json" }
    });

    return response.data;
  } catch (error) {
    console.error("CinetPay payment status error:", error?.response?.data || error.message);
    throw new Error("Failed to retrieve payment status from CinetPay");
  }
}

module.exports = {
  initiatePay,
  paymentStatus
};

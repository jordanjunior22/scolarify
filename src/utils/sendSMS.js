// utils/sendSMS.js
const { Vonage } = require('@vonage/server-sdk');

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
});

/**
 * Send SMS using Vonage
 * @param {string} to - Recipient phone number in E.164 format (e.g., +2376XXXXXXXX)
 * @param {string} message - The message text to send
 * @param {string} from - Sender name (default: 'Scholarify')
 */
const sendSMS = (to, message, from = 'Scholarify') => {
  return new Promise((resolve, reject) => {
    vonage.sms.send({ to, from, text: message }, (err, responseData) => {
      if (err) {
        console.error('Vonage SMS error:', err);
        return reject(err);
      } else {
        console.log('Vonage SMS response:', responseData);
        return resolve(responseData);
      }
    });
  });
};

module.exports = sendSMS;

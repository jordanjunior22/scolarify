const nodemailer = require('nodemailer');

/**
 * Send an email using Nodemailer with Gmail
 * @param {Object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content of the email
 * @param {string} [options.from] - Sender name and email (optional, default: 'Scholarify <brymojunior5@gmail.com>')
 */
const sendEmail = async ({ to, subject, html, from = 'Scholarify <brymojunior5@gmail.com>' }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });

    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    console.error(' Error sending email:', error);
    throw error;
  }
};

module.exports = sendEmail;

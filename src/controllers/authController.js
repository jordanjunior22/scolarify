const admin = require("../utils/firebase");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const User = require('../models/User');  // Assuming you have a User model
const Invitation = require('../models/Invitation'); // Assuming you have an Invitation model
const { ensureUniqueId } = require('../utils/generateId');
const { auth, signInWithEmailAndPassword } = require('../utils/firebaseClient');
const mongoose = require('mongoose');



const { Vonage } = require('@vonage/server-sdk');

const verifyPassword = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Find user by email (assuming the email is unique)
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare entered password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      return res.status(200).json({ message: 'Password is valid' });
    } else {
      return res.status(401).json({ message: 'Invalid password' });
    }
  } catch (error) {
    console.error('Error comparing password:', error);
    return res.status(500).json({ message: 'Error verifying password' });
  }
};


const generateVerificationCode = async (user) => {
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expirationTime = new Date(Date.now() + 1 * 60 * 1000); // Code expires in 1 minute

  // Update user with the new code and expiration time
  user.verificationCode = verificationCode;
  user.verificationCodeExpires = expirationTime;
  await user.save();

  return verificationCode;
};

const getCode = async (req, res) => {
  const { email, phone } = req.body;

  try {
    if (!email && !phone) {
      return res.status(400).json({ message: "Email or phone number is required" });
    }

    let user = await User.findOne({ $or: [{ email }, { phone }] });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate and store the verification code
    const verificationCode = await generateVerificationCode(user);

    if (email) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      // Send code via email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your Verification Code",
        text: `Your verification code is: ${verificationCode}. It expires in 1 minute.`,
      };

      await transporter.sendMail(mailOptions);
      return res.status(200).json({ message: "Verification code sent to your email" });
    } else if (phone) {
      // Send code via SMS using Vonage

      const vonage = new Vonage({
        apiKey: process.env.VONAGE_API_KEY,
        apiSecret: process.env.VONAGE_API_SECRET
      });
      const from = "Vonage";
      const to = phone.startsWith("+") ? phone : `+${phone}`;
      const text = `Your verification code is: ${verificationCode}. It expires in 1 minute.`;

      await vonage.sms.send({ to, from, text });

      return res.status(200).json({ message: "Verification code sent to your phone" });
    } else {
      return res.status(400).json({ message: "Email or phone number is required" });
    }
  } catch (error) {
    console.error("Error sending verification code:", error);
    return res.status(500).json({ message: "Error sending verification code" });
  }
};

const verifyCode = async (req, res) => {
  const { email, phone, code } = req.body;

  try {
    // Validate input
    if ((!email && !phone) || !code) {
      return res.status(400).json({ message: "Email or phone and verification code are required" });
    }

    // Find the user
    const user = await User.findOne(email ? { email } : { phone });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Account verification logic
    if (user.verificationCode !== code) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    if (user.verificationCodeExpires < new Date()) {
      return res.status(400).json({ message: "Verification code expired. Resend code" });
    }

    // Mark the user as verified
    user.isVerified = true;
    await user.save();

    return res.status(200).json({ message: "Account verification successful", success: true, error: null });
  } catch (error) {
    console.error("Error verifying code:", error);
    return res.status(500).json({ message: "Verification failed", error: error.message, success: false });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify user with Firebase Authentication (email/password)
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // After login, get the Firebase ID token
    const idToken = await userCredential.user.getIdToken();

    // ✅ Update lastLogin timestamp
    user.lastLogin = new Date();
    await user.save(); // Save the updated user document

    return res.status(200).json({ message: 'Login successful', idToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists in your database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiration time (1 hour from now)
    const verificationCodeExpires = new Date(Date.now() + 60 * 60 * 1000);

    // Save the verification code and expiration time to the user record
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;
    await user.save();

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Configure email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Scholarify - Password Reset Code",
      html: `
        <h2>Password Reset</h2>
        <p>You have requested to reset your password.</p>
        <p>Your temporary verification code is: <strong>${verificationCode}</strong></p>
        <p>This code will expire in 1 hour.</p>
        <p>If you did not request this password reset, please ignore this email.</p>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Password reset code sent successfully to your email', success: true, error: null });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to send password reset email', error: error.message, success: false });
  }
};

const sendInvitation = async (req, res) => {
  const { name, email, phone, childrenIds, school_ids } = req.body;

  try {
    if (!email && !phone) {
      return res.status(400).json({ success: false, message: "Email & phone are required" });
    }

    const role = "parent";

    // Step 1: Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already registered" });
    }

    // Step 2: Check if invitation already exists
    const existingInvite = await Invitation.findOne({ email, status: "pending" });
    if (existingInvite) {
      return res.status(400).json({ success: false, message: "Invitation already sent" });
    }

    // Step 3: Generate Firebase token and encode childrenIds
    const firebaseUid = `parent_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const customToken = await admin.auth().createCustomToken(firebaseUid);

    let validChildrenIds = [];
    if (Array.isArray(childrenIds)) {
      validChildrenIds = childrenIds.map(id => new mongoose.Types.ObjectId(id));
    }

    let validSchoolIds = [];
    if (Array.isArray(school_ids)) {
      validSchoolIds = school_ids.map(id => new mongoose.Types.ObjectId(id));
    }

    const encodedChildren = Buffer.from(JSON.stringify(validChildrenIds)).toString("base64");

    const nameEncoded = encodeURIComponent(name || "");
    const emailEncoded = encodeURIComponent(email);
    const phoneEncoded = encodeURIComponent(phone);

    // Step 4: Create deep link and fallback URL
    const smartBaseUrl = "https://appurl.io/Zp2utUbj7g";
    const smartLink = `${smartBaseUrl}?token=${customToken}&children=${encodedChildren}&name=${nameEncoded}&role=${role}&email=${emailEncoded}&phone=${phoneEncoded}`;
    // Step 5: Save invitation to database
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    const newInvitation = new Invitation({
      name,
      email,
      phone,
      childrenIds: validChildrenIds,
      school_ids: validSchoolIds,
      token: customToken,
      status: "pending",
      expiresAt,
    });

    await newInvitation.save();

    // Step 6: Send Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "You have been invited to join Scolarify",
      html: `
        <p>Hello ${name || "Parent"},</p>
        <p>You have been invited to stay connected with your child's school activity via Scolarify.</p>
        <a href="${smartLink}" style="display:inline-block;padding:10px 20px;background-color:#0ab1d7;color:#fff;text-decoration:none;border-radius:5px;">Join Now</a>
        <p>If the button doesn't work, copy and paste this URL into your browser:</p>
        <p>${smartLink}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "Invitation sent successfully.",
    });

  } catch (error) {
    console.error("Error sending invitation:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const redirectToApp = (req, res) => {
  try {
    const { token, children, name, role, email, phone } = req.query;

    const deepLink = `myapp://signup?token=${token}&children=${children}&name=${encodeURIComponent(name || '')}&role=${role}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`;

    // Redirect to the app
    // return res.redirect(deepLink);

    return res.send(`
      <html>
        <body style="font-family:sans-serif;padding:2rem;">
          <h2>Test Deep Link</h2>
          <p>Click the link below on a mobile device with the app installed:</p>
          <a href="${deepLink}" style="font-size:18px;color:blue;">${deepLink}</a>
          <br/><br/>
          <p>Or copy & paste this deep link:</p>
          <code style="background:#f5f5f5;padding:10px;display:block;">${deepLink}</code>
        </body>
      </html>
    `);

  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const confirmInvitation = async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ success: false, message: "Token and password are required" });
  }

  try {
    // 1. Find the invitation by token
    const invitation = await Invitation.findOne({ token });
    if (!invitation) {
      return res.status(400).json({ success: false, message: "Invalid or expired invitation" });
    }

    if (invitation.status === "accepted") {
      return res.status(400).json({ success: false, message: "This invitation has already been used." });
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create a unique user ID
    const randomNumber = Math.floor(Math.random() * 25000000);
    const user_id = `PR-${randomNumber.toString().padStart(7, "0")}`;

    // 4. Create a new user
    const newUser = new User({
      user_id,
      name: invitation.name,
      email: invitation.email,
      phone: invitation.phone,
      password: hashedPassword,
      role: "parent",
      student_ids: invitation.childrenIds, // You can add this to User schema
    });

    await newUser.save();

    // 5. Update the invitation
    invitation.status = "accepted";
    await invitation.save();

    return res.status(201).json({
      success: true,
      message: "Account created successfully. You can now log in.",
    });
  } catch (error) {
    console.error("Error confirming invitation:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


const resendInvitation = async (req, res) => {
  const { email } = req.body;

  try {
    // Step 1: Find existing invitation
    const existingInvitation = await Invitation.findOne({ email });

    if (!existingInvitation) {
      return res.status(404).json({ success: false, message: "No previous invitation found" });
    }

    // Step 2: Check if invitation is expired
    if (existingInvitation.expiresAt > new Date()) {
      return res.status(400).json({ success: false, message: "Current invitation is still valid" });
    }

    // Step 3: Generate a new Firebase token and encode childrenIds
    const firebaseUid = `parent_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const customToken = await admin.auth().createCustomToken(firebaseUid);

    let validChildrenIds = [];
    if (Array.isArray(existingInvitation.childrenIds)) {
      validChildrenIds = existingInvitation.childrenIds.map(id => new mongoose.Types.ObjectId(id));
    }

    const encodedChildren = Buffer.from(JSON.stringify(validChildrenIds)).toString("base64");

    // Step 4: Update the invitation with a new token and expiration time
    const newExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    existingInvitation.token = customToken;
    existingInvitation.status = "pending"; // Reset status to pending
    existingInvitation.expiresAt = newExpiresAt;

    // Save updated invitation
    await existingInvitation.save();

    // Step 5: Generate smart link for the new invitation
    const smartBaseUrl = "https://appurl.io/Zp2utUbj7g";
    const smartLink = `${smartBaseUrl}?token=${customToken}&children=${encodedChildren}&name=${encodeURIComponent(existingInvitation.name)}&role=parent&email=${encodeURIComponent(existingInvitation.email)}&phone=${encodeURIComponent(existingInvitation.phone)}`;

    // Step 6: Send email with the new invitation link
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: existingInvitation.email,
      subject: "Your Scholarify Invitation Has Been Resent",
      html: `
        <p>Hello ${existingInvitation.name || "Parent"},</p>
        <p>Your invitation to join Scholarify has expired, but we've resent a new invitation for you.</p>
        <a href="${smartLink}" style="display:inline-block;padding:10px 20px;background-color:#0ab1d7;color:#fff;text-decoration:none;border-radius:5px;">Join Now</a>
        <p>If the button doesn't work, copy and paste this URL into your browser:</p>
        <p>${smartLink}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "New invitation resent successfully.",
    });
  } catch (error) {
    console.error("Error resending invitation:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};




const resendCode = async (req, res) => {
  const { email } = req.body;

  try {
    // Validate input
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a new 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiration time (1 hour from now)
    const expirationTime = new Date(Date.now() + 60 * 60 * 1000);

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Update user with the new verification code
    user.verificationCode = code;
    user.verificationCodeExpires = expirationTime;
    await user.save();

    // Send the email with the verification code
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Scholarify - New Account Verification Code",
      html: `
        <h2>Account Verification</h2>
          <p>Your new verification code is: <strong>${code}</strong></p>
          <p>This code will expire in 1 hour.</p>
        `,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "New verification code sent successfully", success: true, error: null });

  } catch (error) {
    console.error("Error resending code:", error);
    return res.status(500).json({ message: "Failed to resend code", error: error.message, success: false });
  }
};

const resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    // Validate input
    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: 'Email, verification code, and new password are required', success: false, error: 'Bad request' });
    }

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false, error: 'User not found' });
    }

    // Check if verificationCode exists and matches
    if (!user.verificationCode || user.verificationCode !== code) {
      return res.status(400).json({ message: 'Invalid verification code', success: false, error: 'Invalid verification code' });
    }

    // Check if the code has expired
    if (!user.verificationCodeExpires || user.verificationCodeExpires < new Date()) {
      return res.status(400).json({ message: 'Verification code has expired', success: false, error: 'Verification code has expired' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;

    // Clear the verification code fields
    user.verificationCode = null;
    user.verificationCodeExpires = null;

    await user.save();

    return res.status(200).json({ message: 'Password has been reset successfully', success: true, error: null });
  } catch (error) {
    console.error('Error resetting password:', error);
    return res.status(500).json({ message: 'Failed to reset password', error: error.message, success: false });
  }
};

module.exports = { loginUser, forgotPassword, resetPassword, resendCode, sendInvitation, redirectToApp, getCode, verifyCode, verifyPassword, confirmInvitation, resendInvitation };


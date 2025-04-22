const admin = require("../utils/firebase");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const User = require('../models/User');  // Assuming you have a User model
const Invitation = require('../models/Invitation'); // Assuming you have an Invitation model
const { ensureUniqueId } = require('../utils/generateId');
const { auth, signInWithEmailAndPassword, sendPasswordResetEmail } = require('../utils/firebaseClient');
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
  const { email, phone, verificationCode } = req.body;

  try {
    const user = await User.findOne(email ? { email } : { phone });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the verification code matches and is not expired
    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    if (user.verificationCodeExpires < new Date()) {
      return res.status(400).json({ message: "Verification code expired" });
    }

    // Mark the user as verified
    user.isVerified = true;
    user.verificationCode = null; // Remove the code after verification
    user.verificationCodeExpires = null;
    await user.save();

    return res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    console.error("Error verifying code:", error);
    return res.status(500).json({ message: "Verification failed" });
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
    // Check if the user exists in your database (optional but recommended)
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send a password reset email using Firebase Authentication
    await sendPasswordResetEmail(auth, email);

    return res.status(200).json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to send password reset email', error: error.message });
  }
};

const sendInvitation = async (req, res) => {
  const { name, email, phone, childrenIds } = req.body;

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
    const encodedChildren = Buffer.from(JSON.stringify(validChildrenIds)).toString("base64");

    const nameEncoded = encodeURIComponent(name || "");
    const emailEncoded = encodeURIComponent(email);
    const phoneEncoded = encodeURIComponent(phone);

    // Step 4: Create deep link and fallback URL
    const smartBaseUrl = "https://appurl.io/Zp2utUbj7g";
    const smartLink = `${smartBaseUrl}?token=${customToken}&children=${encodedChildren}&name=${nameEncoded}&role=${role}&email=${emailEncoded}&phone=${phoneEncoded}`;
    // Step 5: Save invitation to database
    const newInvitation = new Invitation({
      name,
      email,
      phone,
      childrenIds: validChildrenIds,
      token: customToken,
      status: "pending",
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



module.exports = { loginUser, forgotPassword, sendInvitation, redirectToApp, getCode, verifyCode, verifyPassword, confirmInvitation };


const admin = require("../utils/firebase");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const User = require('../models/User');  // Assuming you have a User model
const { auth, signInWithEmailAndPassword,sendPasswordResetEmail } = require('../utils/firebaseClient');



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


    return res.status(200).json({ message: 'Login successful', idToken}); 
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
      return res.status(400).json({ success: false, message: "Email & phone is required" });
    }

    const role = "parent";

    // Generate a Firebase custom token
    const firebaseUid = `parent_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const customToken = await admin.auth().createCustomToken(firebaseUid);

    // Ensure childrenIds is an array, otherwise set it as an empty array
    const validChildrenIds = Array.isArray(childrenIds) ? childrenIds : [];
    const encodedChildren = Buffer.from(JSON.stringify(validChildrenIds)).toString("base64");

    // Construct deep link
    const appLink = `myapp://signup?token=${customToken}&children=${encodedChildren}&name=${encodeURIComponent(name || "")}&role=${role}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`;
    const fallbackUrl = `http://localhost:3000/api/auth/redirect?token=${customToken}&children=${encodedChildren}&name=${encodeURIComponent(name || "")}&role=${role}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`;

    const saveUser = async () => {
      // Check if the user already exists
      const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
      if (existingUser) {
        return res.status(400).json({ success: false, message: "User already invited" });
      }
      const randomNumber = Math.floor(Math.random() * 25000000);  // Random number between 0 and 24,999,999
      const user_id = `PR-${randomNumber.toString().padStart(7, '0')}`;  // Format to always have 7 digits
      // Save new user
      const newUser = new User({
        user_id,
        name,
        email, 
        phone,
        role,
      });

      await newUser.save();
    };

    if (email) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER, 
          pass: process.env.EMAIL_PASS, 
        },
      });
      // Email Invitation
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your Invitation to Sign Up to Scolarify",
        html: `
          <p>Click below to Sign Up:</p>
          <a href="${fallbackUrl}" 
             style="display: inline-block; background-color: #0ab1d7; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Join Now
          </a>
          <br><br>
          If the button doesn't work, copy and paste this link:<br>
          <span>${fallbackUrl}</span>
        `,
      };
      await transporter.sendMail(mailOptions);
      await saveUser(); // Save user to the database
      return res.status(200).json({ success: true, message: "Email invitation sent" });

    }
    return res.status(400).json({ success: false, message: "Invalid request parameters" });

  } catch (error) {
    console.error("Error sending invitation:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const redirectToApp = (req, res) => {
  try {
    const { token, children, name,role, email,phone } = req.query;

    if (!token) {
      return res.status(400).json({ error: "Missing token" });
    }

    if (!children) {
      return res.status(400).json({ error: "Missing children" });
    }

    let childrenDecoded;

    try {
      console.log("Raw children:", children);

      // Check if children is already JSON (to avoid double decoding)
      if (children.startsWith("[") && children.endsWith("]")) {
        childrenDecoded = JSON.parse(children);
      } else {
        // Decode Base64
        const decodedChildren = Buffer.from(children, "base64").toString("utf-8");
        console.log("Base64 Decoded children:", decodedChildren);

        childrenDecoded = JSON.parse(decodedChildren);
      }

      if (!Array.isArray(childrenDecoded)) {
        throw new Error("Children must be an array.");
      }
    } catch (error) {
      console.error("Error parsing children:", error.message);
      return res.status(400).json({ error: "Invalid children parameter" });
    }

    // Deep link to the mobile app
    const deepLink = `myapp://signup?token=${token}&children=${encodeURIComponent(
      JSON.stringify(childrenDecoded)
    )}&name=${encodeURIComponent(name || "")}&role=${role}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`;

    const fallbackUrl = `http://localhost:3000/api/auth/redirect?token=${token}&children=${encodeURIComponent(
      JSON.stringify(childrenDecoded)
    )}&name=${encodeURIComponent(name || "")}&role=${role}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`;

    res.setHeader("Content-Type", "text/html"); // Ensuring correct content type
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Redirecting...</title>
          <script>
            document.addEventListener("DOMContentLoaded", function() {
              // Try opening the deep link
              window.location.href = "${deepLink}";

              // If the app is not installed, redirect to web signup after 3 seconds
              setTimeout(() => {
                window.location.href = "${fallbackUrl}";
              }, 3000);
            });
          </script>
        </head>
        <body>
          <p>Redirecting you to the app...</p>
          <p>If you are not redirected, <a href="${fallbackUrl}">click here</a>.</p>
        </body>
      </html>
    `);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};



module.exports = { loginUser, forgotPassword,sendInvitation,redirectToApp ,getCode, verifyCode,verifyPassword};


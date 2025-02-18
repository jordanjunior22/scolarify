const admin = require("../utils/firebase");
const nodemailer = require("nodemailer");
const User = require('../models/User');  // Assuming you have a User model
const { auth, signInWithEmailAndPassword,sendPasswordResetEmail } = require('../utils/firebaseClient');

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
  const { email, phone, role, childrenIds } = req.body;

  try {
    if (!email && !phone) {
      return res.status(400).json({ success: false, message: "Email or phone is required" });
    }

    // Generate a Firebase custom token
    const customToken = await admin.auth().createCustomToken(email || phone);

    // Ensure childrenIds is an array, otherwise set it as an empty array
    const validChildrenIds = Array.isArray(childrenIds) ? childrenIds : [];
    const encodedChildren = Buffer.from(JSON.stringify(validChildrenIds)).toString("base64");

    // Construct deep link
    const appLink = `myapp://signup?token=${customToken}&children=${encodedChildren}`;
    const fallbackUrl = `http://localhost:3000/api/auth/redirect?token=${customToken}&children=${encodedChildren}`;

    if (email) {
      // Email Invitation
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
      return res.status(200).json({ success: true, message: "Email invitation sent" });
    } else if (phone) {
      // SMS Invitation using a third-party service (Twilio recommended)
      return res.status(400).json({ success: false, message: "SMS invitations require an external provider like Twilio." });
    }

    return res.status(400).json({ success: false, message: "Invalid request parameters" });

  } catch (error) {
    console.error("Error sending invitation:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


const redirectToApp = (req, res) => {
  try {
    const { token, children } = req.query;

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
    const deepLink = `myapp://signup?token=${token}&children=${encodeURIComponent(JSON.stringify(childrenDecoded))}`;
    const fallbackUrl = `http://localhost:3000/api/auth/redirect?token=${token}&children=${encodeURIComponent(JSON.stringify(childrenDecoded))}`;

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


module.exports = { loginUser, forgotPassword,sendInvitation,redirectToApp };


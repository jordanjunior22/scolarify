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
    // Generate a Firebase custom token
    const customToken = await admin.auth().createCustomToken(email || phone);

    // Encode children IDs as a base64 string
    const encodedChildren = Buffer.from(JSON.stringify(childrenIds)).toString("base64");

    // Construct deep link to redirect user to app
    const appLink = `myapp://signup?token=${customToken}&children=${encodedChildren}`;
    const fallbackUrl = `http://localhost/3000/api/auth/redirect?token=${customToken}&children=${encodedChildren}`;


    if (email) {
      // Email Invitation
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER, // Use environment variable
          pass: process.env.EMAIL_PASS, // Use environment variable
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER, // Use environment variable
        to: email,
        subject: "Your Invitation to Join",
        html: `
        <p>Click below to join:</p>
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
      // SMS Invitation using Firebase SMS Authentication
      const actionCodeSettings = {
        url: fallbackUrl,
        handleCodeInApp: true,
      };

      await admin.auth().sendSignInLinkToPhoneNumber(phone, actionCodeSettings);

      return res.status(200).json({ success: true, message: "SMS invitation sent" });
    }

    return res.status(400).json({ success: false, message: "Email or phone is required" });

  } catch (error) {
    console.error("Error sending invitation:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const redirectToApp = (req, res) => {
  const { token, children } = req.query;

  if (!token) {
    return res.status(400).json({ error: "Missing token" });
  }

  if (!children) {
    return res.status(400).json({ error: "Missing children" });
  }

  // Assuming the children is a JSON-encoded array or stringified array
  const childrenDecoded = Array.isArray(children) ? children : JSON.parse(decodeURIComponent(children));

  // Deep link to the mobile app with customToken and children
  const deepLink = `myapp://signup?token=${token}&children=${encodeURIComponent(JSON.stringify(childrenDecoded))}`;

  // Web fallback URL
  const fallbackUrl = `http://localhost:3000/signup?token=${token}&children=${encodeURIComponent(JSON.stringify(childrenDecoded))}`;

  res.send(`
    <html>
      <head>
        <script>
          // Try opening the deep link
          window.location.href = "${deepLink}";

          // If the app is not installed, redirect to web signup after 3 seconds
          setTimeout(() => {
            window.location.href = "${fallbackUrl}";
          }, 3000);
        </script>
      </head>
      <body>
        <p>If you are not redirected, <a href="${fallbackUrl}">click here</a>.</p>
      </body>
    </html>
  `);
};

module.exports = { loginUser, forgotPassword,sendInvitation,redirectToApp };


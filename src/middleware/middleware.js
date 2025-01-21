// middleware/authMiddleware.js
const admin = require('../utils/firebase'); // Import the initialized Firebase Admin instance
const User = require('../models/User'); // Import your MongoDB user model

// Authentication Middleware to verify Firebase token
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header (Bearer <token>)

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verify the Firebase ID token using the Firebase Admin SDK instance
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    req.user = decodedToken; // Attach decoded user information (including UID) to the request object
    next(); // Proceed to next middleware or route handler
  } catch (error) {
    console.error('Error verifying Firebase token:', error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

// Authorization Middleware to check user role
const authorize = (roles = []) => {
  // Roles can be an array (e.g., ['admin', 'super']) or a single string role
  return async (req, res, next) => {
    try {
      // Fetch the user from MongoDB using Firebase UID (attached from the authentication middleware)
      const user = await User.findOne({ firebaseUid: req.user.uid });

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Check if the user has one of the required roles
      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      req.user = user; // Attach user object (including role) to the request
      next(); // Proceed to next middleware or route handler
    } catch (error) {
      console.error('Error during authorization:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
};

module.exports = { authenticate, authorize };

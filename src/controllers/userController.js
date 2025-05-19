// // controllers/userController.js
const firebase = require('../utils/firebase')
const bcrypt = require('bcryptjs'); 
const User = require('../models/User');  // Assuming you have a User model

const testUserResponse = (req, res) => {
    res.status(200).json({ message: 'Hi, this is user' });
  };
// // Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const registerUser = async (req, res) => {
  const { email, password, role, name, address, school_ids, phone } = req.body;
  
  try {
    // Validate that the required fields are provided
    if (!email || !password || !name || !role) {
      return res.status(400).json({ message: 'Email, password, name and role are required' });
    }

    // Check if a user with the same email or firebaseUid already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    // Register user with Firebase
    const userRecord = await firebase.auth().createUser({
      email,
      password,
    });

    // Hash password before saving to DB
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate user_id based on role
    let userIdPrefix = '';
    switch (role) {
      case 'teacher':
        userIdPrefix = 'TR'; // For teacher, user ID starts with 'TR'
        break;
      case 'admin':
        userIdPrefix = 'AD'; // For admin, user ID starts with 'AD'
        break;
      case 'super':
        userIdPrefix = 'SP'; // For super, user ID starts with 'SP'
        break;
      default:
        userIdPrefix = 'PR'; // For parent, user ID starts with 'PR'
        break;
    }

    const randomNumber = Math.floor(Math.random() * 25000000);  // Random number between 0 and 24,999,999
    const userId = `${userIdPrefix}-${randomNumber.toString().padStart(7, '0')}`;  // Format to always have 7 digits

    // Create user in MongoDB
    const user = new User({
      user_id: userId, // The user_id is now generated based on the role
      firebaseUid: userRecord.uid,
      name,
      role,
      phone,
      email,
      password: hashedPassword,
      address,
      school_ids: school_ids || [], // Default to an empty array if no school_ids are provided
    });

    await user.save();
    return res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ message: 'Registration failed', error: error.message });
  }
}


//
const createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    const customMessage = "Failed to create a new user.";
    res.status(400).json({ customMessage,message: err.message });
  }
};

// // Get a user by ID
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;  // Get the user_id from the URL parameter

    // Find the user by user_id
    const user = await User.findOne({ user_id: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' }); // If user not found
    }

    res.json(user); // Return the user data
  } catch (err) {
    res.status(500).json({ message: err.message }); // Handle server errors
  }
};

const getUserBy_id = async (req, res) => {
  try {
    const _id = req.params.id; // Get the MongoDB _id from the URL

    // Find the user by MongoDB's _id
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user); // Return the user data
  } catch (err) {
    res.status(500).json({ message: err.message }); // Handle server errors
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;  // Get the email from the URL parameter

    // Find the user by email
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' }); // If user not found
    }

    res.json(user); // Return the user data
  } catch (err) {
    res.status(500).json({ message: err.message }); // Handle server errors
  }
};

// // Update user by ID
const updateUserById = async (req, res) => {
  try {
    const userId = req.params.id; // Get the user_id from the URL parameter
    const updateData = req.body;  // Get the updated data from the request body

    // Use findOneAndUpdate to find by user_id instead of _id
    const updatedUser = await User.findOneAndUpdate(
      { user_id: userId },    // Search by user_id
      updateData,             // Update data
      { new: true }           // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).send({ message: 'User not found' }); // Handle user not found
    }

    res.status(200).send(updatedUser); // Return the updated user
  } catch (err) {
    console.error(err);
    res.status(400).send({ message: 'Failed to update user', error: err.message }); // Handle errors
  }
};

// // Delete user by ID
const deleteUserById = async (req, res) => {
  try {
    const userId = req.params.id; // Get the user_id from the URL parameter

    // Find the user by user_id and delete it
    const deletedUser = await User.findOneAndDelete({ user_id: userId });

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' }); // If user not found
    }

    res.json({ message: 'User deleted successfully' }); // If user is deleted
  } catch (err) {
    res.status(500).json({ message: err.message }); // Handle server errors
  }
};

// Delete multiple user records by IDs
const deleteMultipleUsers = async (req, res) => {
  const { ids } = req.body; // Expecting an array of user IDs in the request body
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: 'Invalid input: ids should be a non-empty array' });
  }

  try {
    // Delete user records where _id is in the provided array of IDs
    const result = await User.deleteMany({ _id: { $in: ids } });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No user records found for the provided IDs' });
    }
    
    res.json({ message: `${result.deletedCount} user records deleted successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Search users by name, email, or phone
const searchUsers = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },  // case-insensitive
        { email: { $regex: query, $options: "i" } },
        { phone: { $regex: query, $options: "i" } }
      ]
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
    getAllUsers,
    createUser,
    getUserById,
    updateUserById,
    deleteUserById,
    deleteMultipleUsers, //the new function
    testUserResponse,
    registerUser,
    getUserByEmail,
    getUserBy_id,
    searchUsers,
 };

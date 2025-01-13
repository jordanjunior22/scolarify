// // controllers/userController.js

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

// // Create a new user
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

module.exports = {
    getAllUsers,
    createUser,
    getUserById,
    updateUserById,
    deleteUserById,
    testUserResponse
 };

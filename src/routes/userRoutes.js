//routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();
router.get('/test', userController.testUserResponse);

// GET /users to fetch all users
router.get('/get-users', userController.getAllUsers); 

// Route to get user by user_id
router.get('/get-user/:id', userController.getUserById);

// POST /users to create a new user
router.post('/create-user', userController.createUser);

// PUT /users/:id to update a specific user
router.put('/update-user/:id', userController.updateUserById);

// DELETE /users/:id to delete a specific user
router.delete('/delete-user/:id', userController.deleteUserById);

module.exports = router;

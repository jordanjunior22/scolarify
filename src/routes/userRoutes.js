//routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');
const { authenticate, authorize, checkSubscription } = require('../middleware/middleware');
// 
const router = express.Router();
router.post('/register-user', authenticate, authorize(['admin', 'super']), userController.registerUser);

// GET /users to fetch all users
router.get('/get-users', authenticate, authorize(['admin', 'super', 'parent', 'teacher']), userController.getAllUsers);

// Route to get user by user_id
router.get('/get-user/:id', authenticate, authorize(['admin', 'super', 'parent', 'teacher']), userController.getUserById);

// POST /users to create a new user
// router.post('/create-user', userController.createUser);

// PUT /users/:id to update a specific user
router.put('/update-user/:id', authenticate, authorize(['admin', 'super', 'parent', 'teacher']), userController.updateUserById);

// DELETE /users/:id to delete a specific user
router.delete('/delete-user/:id', authenticate, authorize(['admin', 'super']), userController.deleteUserById);

module.exports = router;

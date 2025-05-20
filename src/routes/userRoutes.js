//routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');
const { authenticate, authorize, checkSubscription } = require('../middleware/middleware');
// 
const router = express.Router();
router.post('/register-user', authenticate, authorize(['admin', 'super']), userController.registerUser);
router.post('/register-parent', authenticate, authorize(['admin', 'super']), userController.registerParent);


// GET /users to fetch all users
router.get('/get-users', authenticate, checkSubscription, authorize(['admin', 'super', 'parent', 'teacher']), userController.getAllUsers);
router.get('/search-users', authenticate, checkSubscription, authorize(['admin', 'super', 'parent', 'teacher']), userController.searchUsers);

// Route to get user by user_id
router.get('/get-user/:id', authenticate, checkSubscription, authorize(['admin', 'super', 'parent', 'teacher']), userController.getUserById);
router.get('/get-user-by-id/:id', authenticate, checkSubscription, authorize(['admin', 'super', 'parent', 'teacher']), userController.getUserBy_id);
router.get('/get-user-email/:email', authenticate, checkSubscription, authorize(['admin', 'super', 'parent', 'teacher']), userController.getUserByEmail);

// POST /users to create a new user
// router.post('/create-user', userController.createUser);

// PUT /users/:id to update a specific user
router.put('/update-user/:id', authenticate, checkSubscription, authorize(['admin', 'super', 'parent', 'teacher']), userController.updateUserById);

// DELETE /users/:id to delete a specific user
router.delete('/delete-user/:id', authenticate, authorize(['admin', 'super']), userController.deleteUserById);

//DELETE multiple users
router.delete('/delete-users', authenticate, authorize(['admin', 'super']), userController.deleteMultipleUsers);
module.exports = router;

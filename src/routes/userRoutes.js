//routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();
router.get('/test', userController.testUserResponse);
// GET /users to fetch all users
// router.get('/', userController.getAllUsers);

// POST /users to create a new user
// router.post('/', userController.createUser);

// PUT /users/:id to update a specific user
// router.put('/:id', userController.updateUser);

// DELETE /users/:id to delete a specific user
// router.delete('/:id', userController.deleteUser);

module.exports = router;

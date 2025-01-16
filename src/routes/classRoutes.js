// routes/classRoutes.js
const express = require('express');
const classController = require('../controllers/classController');

const router = express.Router();
router.get('/test', classController.testClassResponse);

// GET /classes to fetch all classes
router.get('/get-classes', classController.getAllClasses);

// GET /class by id
router.get('/get-class/:id', classController.getClassById);

// POST /classes to create a new class
router.post('/create-class', classController.createClass);

// PUT /classes/:id to update a specific class
router.put('/update-class/:id', classController.updateClassById);

// DELETE /classes/:id to delete a specific class
router.delete('/delete-class/:id', classController.deleteClassById);

module.exports = router;

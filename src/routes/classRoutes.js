// routes/classRoutes.js
const express = require('express');
const classController = require('../controllers/classController');

const router = express.Router();
router.get('/test', classController.testClassResponse);

// GET /classes to fetch all classes
// router.get('/', classController.getAllClasses);

// POST /classes to create a new class
// router.post('/', classController.createClass);

// PUT /classes/:id to update a specific class
// router.put('/:id', classController.updateClassById);

// DELETE /classes/:id to delete a specific class
// router.delete('/:id', classController.deleteClassById);

module.exports = router;

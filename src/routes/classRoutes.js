// routes/classRoutes.js
const express = require('express');
const classController = require('../controllers/classController');
const { authenticate, authorize, checkSubscription } = require('../middleware/middleware');


const router = express.Router();
// router.get('/test', classController.testClassResponse);

// GET /classes to fetch all classes
router.get('/get-classes' , authenticate, checkSubscription, authorize(['admin', 'super', 'parent', 'teacher']) , classController.getAllClasses);

// GET /class by id
router.get('/get-class/:id' , authenticate, checkSubscription, authorize(['admin', 'super', 'parent', 'teacher']) , classController.getClassById);

// POST /classes to create a new class
router.post('/create-class' , authenticate, authorize(['admin', 'super']) , classController.createClass);

// PUT /classes/:id to update a specific class
router.put('/update-class/:id' , authenticate, authorize(['admin', 'super']) , classController.updateClassById);

// DELETE /classes/:id to delete a specific class
router.delete('/delete-class/:id' , authenticate, authorize(['admin', 'super']) , classController.deleteClassById);

//DELETE multiple classes
router.delete('/delete-classes', authenticate, authorize(['admin', 'super']), classController.deleteMultipleClasses);

module.exports = router;

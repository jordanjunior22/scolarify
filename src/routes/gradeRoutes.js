const express = require('express');
const gradeController = require('../controllers/gradeController'); // Updated controller import
const { authenticate, authorize, checkSubscription } = require('../middleware/middleware');


const router = express.Router();
// router.get('/test', gradeController.testGradeResponse); // Updated route to match grade

// GET /grades to fetch all grade records
router.get('/get-grades' , authenticate, checkSubscription, authorize(['admin', 'super', 'parent', 'teacher']) , gradeController.getAllGrades);

// GET /grade by id
router.get('/get-grade/:id' , authenticate, checkSubscription, authorize(['admin', 'super', 'parent', 'teacher']) , gradeController.getGradeById);

// POST /grades to create a new grade record
router.post('/create-grade' , authenticate, authorize(['admin', 'super', 'teacher']) , gradeController.createGrade);

// PUT /grades/:id to update a specific grade record
router.put('/update-grade/:id' , authenticate, authorize(['admin', 'super', 'teacher']) , gradeController.updateGradeById);

// DELETE /grades/:id to delete a specific grade record
router.delete('/delete-grade/:id' , authenticate, authorize(['admin', 'super', 'teacher']) , gradeController.deleteGradeById);

module.exports = router;

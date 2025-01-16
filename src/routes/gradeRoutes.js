const express = require('express');
const gradeController = require('../controllers/gradeController'); // Updated controller import

const router = express.Router();
router.get('/test', gradeController.testGradeResponse); // Updated route to match grade

// GET /grades to fetch all grade records
router.get('/get-grades', gradeController.getAllGrades);

// GET /grade by id
router.get('/get-grade/:id', gradeController.getGradeById);

// POST /grades to create a new grade record
router.post('/create-grade', gradeController.createGrade);

// PUT /grades/:id to update a specific grade record
router.put('/update-grade/:id', gradeController.updateGradeById);

// DELETE /grades/:id to delete a specific grade record
router.delete('delete-grade/:id', gradeController.deleteGradeById);

module.exports = router;

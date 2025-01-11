const express = require('express');
const gradeController = require('../controllers/gradeController'); // Updated controller import

const router = express.Router();
router.get('/test', gradeController.testGradeResponse); // Updated route to match grade

// GET /grades to fetch all grade records
// router.get('/', gradeController.getAllGrades);

// POST /grades to create a new grade record
// router.post('/', gradeController.createGrade);

// PUT /grades/:id to update a specific grade record
// router.put('/:id', gradeController.updateGradeById);

// DELETE /grades/:id to delete a specific grade record
// router.delete('/:id', gradeController.deleteGradeById);

module.exports = router;

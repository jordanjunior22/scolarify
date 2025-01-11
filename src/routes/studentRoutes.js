const express = require('express');
const studentController = require('../controllers/studentController'); // Updated controller import

const router = express.Router();
router.get('/test', studentController.testStudentResponse); // Updated route to match student

// GET /students to fetch all student records
// router.get('/', studentController.getAllStudents);

// POST /students to create a new student record
// router.post('/', studentController.createStudent);

// PUT /students/:id to update a specific student record
// router.put('/:id', studentController.updateStudentById);

// DELETE /students/:id to delete a specific student record
// router.delete('/:id', studentController.deleteStudentById);

module.exports = router;

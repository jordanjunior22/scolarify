const express = require('express');
const studentController = require('../controllers/studentController'); // Updated controller import

const router = express.Router();
router.get('/test', studentController.testStudentResponse); // Updated route to match student

// GET /students to fetch all student records
router.get('/get-students', studentController.getAllStudents);

// Get students by ID
router.get('/get-student/:id', studentController.getStudentById);

// POST /students to create a new student record
router.post('/create-student', studentController.createStudent);

// PUT /students/:id to update a specific student record
router.put('/update-student/:id', studentController.updateStudentById);

// DELETE /students/:id to delete a specific student record
router.delete('/delete-student/:id', studentController.deleteStudentById);

module.exports = router;

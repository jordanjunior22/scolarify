const express = require('express');
const studentController = require('../controllers/studentController'); // Updated controller import
const { authenticate, authorize, checkSubscription } = require('../middleware/middleware');


const router = express.Router();
// router.get('/test', studentController.testStudentResponse); // Updated route to match student

router.get('/search-students', authenticate, checkSubscription, authorize(['admin', 'super', 'teacher', 'parent']), studentController.searchStudent);

// GET /students to fetch all student records
router.get('/get-students', authenticate, checkSubscription, authorize(['admin', 'super', 'parent', 'teacher']), studentController.getAllStudents);
router.get('/get-students-by-school', studentController.getStudentsBySchoolId);
// Get students by ID
router.get('/get-student/:id', authenticate, checkSubscription, authorize(['admin', 'super', 'parent', 'teacher']), studentController.getStudentById);

router.get("/class/:classId/school/:schoolId", studentController.getStudentsByClassAndSchool);
// POST /students to create a new student record
router.post('/create-student', authenticate, authorize(['admin', 'super']), studentController.createStudent);

// PUT /students/:id to update a specific student record
router.put('/update-student/:id', authenticate, authorize(['admin', 'super']), studentController.updateStudentById);

// DELETE /students/:id to delete a specific student record
router.delete('/delete-student/:id', authenticate, authorize(['admin', 'super']), studentController.deleteStudentById);

//DELETE multiple students
router.delete('/delete-students', authenticate, authorize(['admin', 'super']), studentController.deleteMultipleStudents);
router.post('/import-csv-students/:schoolId', authenticate,authorize(['admin', 'super']),studentController.importStudentsFromCSV);

module.exports = router;

// routes/attendanceRoutes.js
const express = require('express');
const attendanceController = require('../controllers/attendanceController'); // Updated controller import

const router = express.Router();
router.get('/test', attendanceController.testAttendanceResponse); // Updated route to match attendance

// GET /attendances to fetch all attendance records
router.get('/get-attendances', attendanceController.getAllAttendance);

// GET /attendance by id
router.get('/get-attendance/:id', attendanceController.getAttendanceById);

// POST /attendances to create a new attendance record
router.post('/create-attendance', attendanceController.createAttendance);

// PUT /attendances/:id to update a specific attendance record
router.put('/update-attendance/:id', attendanceController.updateAttendanceById);

// DELETE /attendances/:id to delete a specific attendance record
router.delete('/delete-attendance/:id', attendanceController.deleteAttendanceById);

module.exports = router;

// routes/attendanceRoutes.js
const express = require('express');
const attendanceController = require('../controllers/attendanceController'); // Updated controller import

const router = express.Router();
router.get('/test', attendanceController.testAttendanceResponse); // Updated route to match attendance

// GET /attendances to fetch all attendance records
// router.get('/', attendanceController.getAllAttendances);

// POST /attendances to create a new attendance record
// router.post('/', attendanceController.createAttendance);

// PUT /attendances/:id to update a specific attendance record
// router.put('/:id', attendanceController.updateAttendanceById);

// DELETE /attendances/:id to delete a specific attendance record
// router.delete('/:id', attendanceController.deleteAttendanceById);

module.exports = router;

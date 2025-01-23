// routes/attendanceRoutes.js
const express = require('express');
const attendanceController = require('../controllers/attendanceController'); // Updated controller import
const { authenticate, authorize, checkSubscription } = require('../middleware/middleware');


const router = express.Router();
// router.get('/test', attendanceController.testAttendanceResponse); // Updated route to match attendance

// GET /attendances to fetch all attendance records
router.get('/get-attendances' , authenticate, authorize(['admin', 'super', 'parent', 'teacher']) , attendanceController.getAllAttendance);

// GET /attendance by id
router.get('/get-attendance/:id' , authenticate, authorize(['admin', 'super', 'parent', 'teacher']) , attendanceController.getAttendanceById);

// POST /attendances to create a new attendance record
router.post('/create-attendance' , authenticate, authorize(['admin', 'super', 'teacher']) , attendanceController.createAttendance);

// PUT /attendances/:id to update a specific attendance record
router.put('/update-attendance/:id' , authenticate, authorize(['admin', 'super', 'teacher']) , attendanceController.updateAttendanceById);

// DELETE /attendances/:id to delete a specific attendance record
router.delete('/delete-attendance/:id' , authenticate, authorize(['admin', 'super', 'teacher']) , attendanceController.deleteAttendanceById);

module.exports = router;

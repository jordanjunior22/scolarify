const express = require('express');
const classScheduleController = require('../controllers/classScheduleController');
const { authenticate, authorize } = require('../middleware/middleware');

const router = express.Router();

router.get('/get-class-schedules', authenticate, authorize(['admin', 'super', 'teacher','parent']), classScheduleController.getAllClassSchedules);
router.get('/get-class-schedule/:id', authenticate, authorize(['admin', 'super', 'teacher','parent']), classScheduleController.getClassScheduleById);
router.post('/create-class-schedule', authenticate, authorize(['admin', 'super']), classScheduleController.createClassSchedule);
router.put('/update-class-schedule/:id', authenticate, authorize(['admin', 'super']), classScheduleController.updateClassScheduleById);
router.delete('/delete-class-schedule/:id', authenticate, authorize(['admin', 'super']), classScheduleController.deleteClassScheduleById);

//delete multiple class schedules
router.delete('/delete-class-schedules', authenticate, authorize(['admin', 'super']), classScheduleController.deleteMultipleClassSchedules);

module.exports = router;

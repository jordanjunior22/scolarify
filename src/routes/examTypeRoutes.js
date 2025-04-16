const express = require('express');
const examTypeController = require('../controllers/examTypeController');
const { authenticate, authorize } = require('../middleware/middleware');

const router = express.Router();

router.get('/test', examTypeController.testexamType);
router.get('/exam-types', authenticate, authorize(['admin', 'super', 'teacher']), examTypeController.getAllExamTypes);
router.get('/exam-types/:id', authenticate, authorize(['admin', 'super', 'teacher']), examTypeController.getExamTypeById);
router.post('/exam-types', authenticate, authorize(['admin', 'super']), examTypeController.createExamType);
router.put('/exam-types/:id', authenticate, authorize(['admin', 'super']), examTypeController.updateExamTypeById);
router.delete('/exam-types/:id', authenticate, authorize(['admin', 'super']), examTypeController.deleteExamTypeById);

//DELETE multiple exam types
router.delete('/delete-exam-types', authenticate, authorize(['admin', 'super']), examTypeController.deleteMultipleExamTypes);
module.exports = router;

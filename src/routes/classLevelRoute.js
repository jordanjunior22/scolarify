const express = require('express');
const classLevelController = require('../controllers/classLevelController');
const { authenticate, authorize, checkSubscription } = require('../middleware/middleware');

const router = express.Router();

// Test route
router.get('/test', classLevelController.testClassLevel);

router.get(
    '/get-class-levels-by-school/:school_id',
    authenticate,
    checkSubscription,
    authorize(['admin', 'super', 'teacher']),
    classLevelController.getClassLevelsBySchoolId
  );
  
// GET all class levels
router.get(
    '/get-class-levels',
    authenticate,
    checkSubscription,
    authorize(['admin', 'super', 'parent', 'teacher']),
    classLevelController.getAllClassLevels
);

// GET class level by ID
router.get(
    '/get-class-level/:id',
    authenticate,
    checkSubscription,
    authorize(['admin', 'super', 'parent', 'teacher']),
    classLevelController.getClassLevelById
);

// POST create new class level
router.post(
    '/create-class-level',
    authenticate,
    authorize(['admin', 'super']),
    classLevelController.createClassLevel
);

// PUT update class level
router.put(
    '/update-class-level/:id',
    authenticate,
    authorize(['admin', 'super']),
    classLevelController.updateClassLevelById
);

// DELETE single class level
router.delete(
    '/delete-class-level/:id',
    authenticate,
    authorize(['admin', 'super']),
    classLevelController.deleteClassLevelById
);

// DELETE multiple class levels
router.delete(
    '/delete-class-levels',
    authenticate,
    authorize(['admin', 'super']),
    classLevelController.deleteMultipleClassLevels
);

module.exports = router;

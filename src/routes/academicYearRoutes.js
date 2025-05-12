const express = require('express');
const academicYearController = require('../controllers/academicYearController');
const { authenticate, authorize, checkSubscription } = require('../middleware/middleware');

const router = express.Router();

// Test route
router.get('/test', academicYearController.testAcademicYearResponse);

// GET all academic years
router.get(
  '/get-academic-years',
  authenticate,
  checkSubscription,
  authorize(['admin', 'super']),
  academicYearController.getAllAcademicYears
);

// GET academic year by ID
router.get(
  '/get-academic-year/:id',
  authenticate,
  checkSubscription,
  authorize(['admin', 'super']),
  academicYearController.getAcademicYearById
);

// CREATE a new academic year
router.post(
  '/create-academic-year',
  authenticate,
  authorize(['admin', 'super']),
  academicYearController.createAcademicYear
);

// UPDATE academic year by ID
router.put(
  '/update-academic-year/:id',
  authenticate,
  authorize(['admin', 'super']),
  academicYearController.updateAcademicYearById
);

// DELETE academic year by ID
router.delete(
  '/delete-academic-year/:id',
  authenticate,
  authorize(['admin', 'super']),
  academicYearController.deleteAcademicYearById
);

// DELETE multiple academic years
router.delete(
  '/delete-academic-years',
  authenticate,
  authorize(['admin', 'super']),
  academicYearController.deleteMultipleAcademicYears
);

module.exports = router;

// routes/schoolRoutes.js
const express = require('express');
const schoolController = require('../controllers/schoolController');

const router = express.Router();
router.get('/test', schoolController.testSchoolResponse);

// GET /schools to fetch all schools
// router.get('/', schoolController.getAllSchools);

// POST /schools to create a new school
// router.post('/', schoolController.createSchool);

// PUT /schools/:id to update a specific school
// router.put('/:id', schoolController.updateSchoolById);

// DELETE /schools/:id to delete a specific school
// router.delete('/:id', schoolController.deleteSchoolById);

module.exports = router;

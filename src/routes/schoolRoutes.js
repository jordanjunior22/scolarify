// routes/schoolRoutes.js
const express = require('express');
const schoolController = require('../controllers/schoolController');

const router = express.Router();
router.get('/test', schoolController.testSchoolResponse);

// GET /schools to fetch all schools
router.get('/get-schools', schoolController.getAllSchools);

// GET /school by id
router.get('/get-school/:id', schoolController.getSchoolById);

// POST /schools to create a new school
router.post('/create-school', schoolController.createSchool);

// PUT /schools/:id to update a specific school
router.put('/update-school/:id', schoolController.updateSchoolById);

// DELETE /schools/:id to delete a specific school
router.delete('/delete-school/:id', schoolController.deleteSchoolById);

module.exports = router;

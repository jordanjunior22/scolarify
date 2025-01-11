// routes/subjectRoutes.js
const express = require('express');
const subjectController = require('../controllers/subjectController');

const router = express.Router();
router.get('/test', subjectController.testSubjectResponse);

// GET /subjects to fetch all subjects
// router.get('/', subjectController.getAllSubjects);

// POST /subjects to create a new subject
// router.post('/', subjectController.createSubject);

// PUT /subjects/:id to update a specific subject
// router.put('/:id', subjectController.updateSubjectById);

// DELETE /subjects/:id to delete a specific subject
// router.delete('/:id', subjectController.deleteSubjectById);

module.exports = router;

// routes/subjectRoutes.js
const express = require('express');
const subjectController = require('../controllers/subjectController');

const router = express.Router();
router.get('/test', subjectController.testSubjectResponse);

// GET /subjects to fetch all subjects
router.get('/get-subjects', subjectController.getAllSubjects);

//GET subjects by id
router.get('/get-subject/:id', subjectController.getSubjectById);

// POST /subjects to create a new subject
router.post('/create-subject', subjectController.createSubject); 

// PUT /subjects/:id to update a specific subject
router.put('/update-subject/:id', subjectController.updateSubjectById);

// DELETE /subjects/:id to delete a specific subject
router.delete('/delete-subject/:id', subjectController.deleteSubjectById);

module.exports = router; 

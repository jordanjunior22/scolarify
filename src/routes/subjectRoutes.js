// routes/subjectRoutes.js
const express = require('express');
const subjectController = require('../controllers/subjectController');
const { authenticate, authorize, checkSubscription } = require('../middleware/middleware');


const router = express.Router();
// router.get('/test', subjectController.testSubjectResponse);

// GET /subjects to fetch all subjects
router.get('/get-subjects', authenticate, authorize(['admin', 'super', 'parent', 'teacher']) , subjectController.getAllSubjects);

//GET subjects by id
router.get('/get-subject/:id', authenticate, authorize(['admin', 'super', 'parent', 'teacher']) , subjectController.getSubjectById);

// POST /subjects to create a new subject
router.post('/create-subject' , authenticate, authorize(['admin', 'super']), subjectController.createSubject); 

// PUT /subjects/:id to update a specific subject
router.put('/update-subject/:id', authenticate, authorize(['admin', 'super']) , subjectController.updateSubjectById);

// DELETE /subjects/:id to delete a specific subject
router.delete('/delete-subject/:id', authenticate, authorize(['admin', 'super']) ,  subjectController.deleteSubjectById);

module.exports = router; 

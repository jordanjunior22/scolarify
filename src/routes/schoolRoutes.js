// routes/schoolRoutes.js
const express = require('express');
const schoolController = require('../controllers/schoolController');
const { authenticate, authorize, checkSubscription } = require('../middleware/middleware');


const router = express.Router();
// router.get('/test', schoolController.testSchoolResponse);

// GET /schools to fetch all schools
router.get('/get-schools' , authenticate, checkSubscription, authorize(['admin', 'super', 'parent', 'teacher']) , schoolController.getAllSchools);

// GET /school by id
router.get('/get-school/:id' , authenticate, checkSubscription, authorize(['admin', 'super', 'parent', 'teacher']) , schoolController.getSchoolById);

router.get('/get-school_id/:id' , authenticate, checkSubscription, authorize(['admin', 'super', 'parent', 'teacher']) , schoolController.getSchoolBy_id);

// POST /schools to create a new school
router.post('/create-school' , authenticate, authorize(['super']) ,  schoolController.createSchool);

// PUT /schools/:id to update a specific school
router.put('/update-school/:id' , authenticate, authorize(['admin', 'super']) , schoolController.updateSchoolById);

// DELETE /schools/:id to delete a specific school
router.delete('/delete-school/:id' , authenticate, authorize(['super']) , schoolController.deleteSchoolById);

module.exports = router;

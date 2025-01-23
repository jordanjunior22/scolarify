const express = require('express');
const announcementController = require('../controllers/announcementController'); // Updated controller import
const { authenticate, authorize, checkSubscription } = require('../middleware/middleware');


const router = express.Router();
router.get('/test', announcementController.testAnnouncementResponse); // Updated route to match announcement

// GET /announcements to fetch all announcement records
router.get('/get-announcements' , authenticate, authorize(['admin', 'super', 'parent', 'teacher']) ,  announcementController.getAllAnnouncements);

// GET /announcement by id
router.get('/get-announcement/:id' , authenticate, authorize(['admin', 'super', 'parent', 'teacher']) , announcementController.getAnnouncementById);

// POST /announcements to create a new announcement record
router.post('/create-announcement' , authenticate, authorize(['admin', 'super', 'teacher']) , announcementController.createAnnouncement);

// PUT /announcements/:id to update a specific announcement record
router.put('/update-announcement/:id' , authenticate, authorize(['admin', 'super', 'teacher']) , announcementController.updateAnnouncementById);

// DELETE /announcements/:id to delete a specific announcement record
router.delete('/delete-announcement/:id' , authenticate, authorize(['admin', 'super', 'teacher']) , announcementController.deleteAnnouncementById);

module.exports = router;

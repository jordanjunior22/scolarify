const express = require('express');
const announcementController = require('../controllers/announcementController'); // Updated controller import

const router = express.Router();
router.get('/test', announcementController.testAnnouncementResponse); // Updated route to match announcement

// GET /announcements to fetch all announcement records
// router.get('/', announcementController.getAllAnnouncements);

// POST /announcements to create a new announcement record
// router.post('/', announcementController.createAnnouncement);

// PUT /announcements/:id to update a specific announcement record
// router.put('/:id', announcementController.updateAnnouncementById);

// DELETE /announcements/:id to delete a specific announcement record
// router.delete('/:id', announcementController.deleteAnnouncementById);

module.exports = router;

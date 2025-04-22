const express = require('express');
const invitationController = require('../controllers/invitationController');
const { authenticate, authorize, checkSubscription } = require('../middleware/middleware');
const router = express.Router();

router.get('/get-invitations', authenticate, checkSubscription, authorize(['admin', 'super']), invitationController.getAllInvitations);
router.get('/get-invitation/:id', authenticate, checkSubscription, authorize(['admin', 'super']), invitationController.getInvitationById);
// router.post('/create-invitation', authenticate, authorize(['admin', 'super']), invitationController.createInvitation);
router.put('/update-invitation/:id', authenticate, authorize(['admin', 'super']), invitationController.updateInvitationById);
router.delete('/delete-invitation/:id', authenticate, authorize(['admin', 'super']), invitationController.deleteInvitationById);
router.delete('/delete-invitations', authenticate, authorize(['admin', 'super']), invitationController.deleteMultipleInvitations);

module.exports = router;

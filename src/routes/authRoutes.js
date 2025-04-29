const express = require('express');
const authController = require('../controllers/authController'); // Updated controller import


const router = express.Router();

// router.post('/register', registerUser); // POST /api/auth/register
router.post('/login', authController.loginUser);       // POST /api/auth/login
router.post('/forgot-password', authController.forgotPassword); // POST /api/auth/forgot-password
router.post('/invite-parent',authController.sendInvitation)
router.post('/resend-invite-parent',authController.resendInvitation)
router.get('/redirect',authController.redirectToApp)
router.post('/get-code',authController.getCode)
router.post('/verify-code',authController.verifyCode)

router.post('/verify-password',authController.verifyPassword)
// router.post('/signout', signOut);      // POST /api/auth/signout

module.exports = router; 
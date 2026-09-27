const express = require('express');
const router = express.Router();
const authController = require('../authController');

// 1. Email Verification Code (OTP with 45-min countdown)
router.post('/send-code', authController.sendVerificationCode);
router.post('/verify-code', authController.verifyCode);

// 2. Member Registration & Authentication
router.post('/register', authController.register);
router.post('/login', authController.login);

// 3. President / VP Governance Controls
router.post('/approve-member', authController.approveMember);
router.post('/reject-member', authController.rejectMember);
router.post('/update-hours', authController.updateMemberHours);

// 4. Member Directory, Unapproved Emails & Personal Profile
router.get('/users', authController.getUsers);
router.get('/unapproved-emails', authController.getUnapprovedEmails);
router.get('/profile/:id', authController.getProfile);

module.exports = router;

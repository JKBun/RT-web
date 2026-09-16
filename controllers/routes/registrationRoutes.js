const express = require('express');
const router = express.Router();
const registrationController = require('../registrationController');

router.post('/', registrationController.registerForEvent);
router.get('/user/:userId', registrationController.getUserRegistrations);
router.post('/verify', registrationController.verifyPass);
router.post('/cancel', registrationController.cancelRegistration);

module.exports = router;

const express = require('express');
const router = express.Router();
const registrationController = require('../registrationController');

router.post('/', registrationController.registerForEvent);
router.get('/user/:userId', registrationController.getUserRegistrations);
router.post('/verify', registrationController.verifyPass);
router.post('/cancel', registrationController.cancelRegistration);
router.post('/request-reregistration', registrationController.requestReRegistration);
router.get('/cancelled-passes', registrationController.getCancelledPasses);
router.post('/review-reregistration', registrationController.reviewReRegistration);
router.get('/my-status', registrationController.getMyPassStatus);

module.exports = router;

const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');

router.post('/', registrationController.registerForEvent);
router.get('/user/:userId', registrationController.getUserRegistrations);
router.post('/verify', registrationController.verifyPass);

module.exports = router;

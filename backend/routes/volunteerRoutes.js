const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');

router.post('/log', volunteerController.submitHours);
router.get('/user/:userId', volunteerController.getUserLogs);
router.get('/all', volunteerController.getAllLogs);
router.put('/status/:logId', volunteerController.updateLogStatus);

module.exports = router;

const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/attendance/:eventId', reportController.getEventAttendanceAudit);
router.get('/volunteer-summary', reportController.getAnnualVolunteerSummary);

module.exports = router;

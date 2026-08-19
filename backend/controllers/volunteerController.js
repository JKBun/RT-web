const VolunteerLog = require('../models/VolunteerLog');

exports.submitHours = async (req, res) => {
  try {
    const { userId, eventId, activityName, hoursLogged, description } = req.body;
    if (!userId || !activityName || !hoursLogged) {
      return res.status(400).json({ success: false, error: 'User ID, activity name, and hours are required.' });
    }

    const log = await VolunteerLog.create({ userId, eventId, activityName, hoursLogged, description });
    return res.status(201).json({ success: true, message: 'Volunteer hours submitted for verification.', log });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.getUserLogs = async (req, res) => {
  try {
    const userId = req.params.userId;
    const logs = await VolunteerLog.findByUserId(userId);
    const totalHours = await VolunteerLog.getTotalHoursForUser(userId);
    return res.json({ success: true, totalHours, count: logs.length, logs });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.getAllLogs = async (req, res) => {
  try {
    const logs = await VolunteerLog.findAll();
    return res.json({ success: true, count: logs.length, logs });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateLogStatus = async (req, res) => {
  try {
    const { logId } = req.params;
    const { status, verifiedBy } = req.body;
    if (!status || !['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Status must be Approved or Rejected.' });
    }

    await VolunteerLog.updateStatus(logId, status, verifiedBy || 1);
    return res.json({ success: true, message: `Volunteer log status updated to ${status}.` });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

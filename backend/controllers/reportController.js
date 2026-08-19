const Event = require('../models/Event');
const EventRegistration = require('../models/EventRegistration');
const VolunteerLog = require('../models/VolunteerLog');
const User = require('../models/User');

exports.getEventAttendanceAudit = async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId, 10);
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ success: false, error: 'Event not found.' });

    const registrations = await EventRegistration.findByEventId(eventId);
    const checkedInCount = registrations.filter(r => r.checkin_status === 'Checked-In').length;
    const noShowCount = registrations.filter(r => r.checkin_status === 'Confirmed').length;

    return res.json({
      success: true,
      reportLayoutNumber: 'RL-01',
      reportTitle: 'Event Attendance & Pass Verification Audit Report',
      event: {
        id: event.event_id,
        title: event.title,
        date: event.event_date,
        venue: event.venue,
        capacity: event.max_capacity,
        totalRegistered: registrations.length,
        checkedInCount,
        noShowCount,
        turnoutPercentage: registrations.length > 0 ? ((checkedInCount / registrations.length) * 100).toFixed(1) + '%' : '0%'
      },
      attendees: registrations
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.getAnnualVolunteerSummary = async (req, res) => {
  try {
    const users = await User.findAll();
    const allLogs = await VolunteerLog.findAll();

    const summary = users.map(u => {
      const userLogs = allLogs.filter(l => l.user_id === u.user_id && l.verification_status === 'Approved');
      const totalHours = userLogs.reduce((sum, l) => sum + (parseFloat(l.hours_logged) || 0), 0);
      let standing = 'Active Member';
      if (totalHours >= 50) standing = 'Gold Citation';
      else if (totalHours >= 30) standing = 'Silver Citation';
      else if (totalHours >= 15) standing = 'Bronze Citation';

      return {
        userId: u.user_id,
        fullName: u.full_name,
        indexNo: u.nibm_index_no || 'N/A',
        eventsParticipated: userLogs.length,
        verifiedHours: totalHours,
        standing
      };
    });

    return res.json({
      success: true,
      reportLayoutNumber: 'RL-02',
      reportTitle: 'Annual Member Volunteer Service Hours & Citation Report',
      year: '2025/2026',
      totalActiveMembers: users.length,
      totalHoursLogged: summary.reduce((sum, s) => sum + s.verifiedHours, 0),
      roster: summary
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

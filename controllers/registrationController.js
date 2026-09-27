const EventRegistration = require('../models/EventRegistration');
const Event = require('../models/Event');
const CancelledPass = require('../models/CancelledPass');

exports.registerForEvent = async (req, res) => {
  try {
    const { eventId, userId, attendeeName, attendeeEmail, contactNo } = req.body;
    if (!eventId || !attendeeName || !attendeeEmail) {
      return res.status(400).json({ success: false, error: 'Event ID, name, and email are required.' });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ success: false, error: 'Target event not found.' });

    if (event.registered_count >= event.max_capacity) {
      return res.status(400).json({ success: false, error: 'Sorry, this event has reached maximum capacity.' });
    }

    const registration = await EventRegistration.createRegistration({
      eventId,
      userId,
      attendeeName,
      attendeeEmail,
      contactNo
    });

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Digital event pass issued.',
      pass: {
        passCode: registration.pass_code,
        eventTitle: event.title,
        attendeeName: registration.attendee_name,
        attendeeEmail: registration.attendee_email,
        eventDate: event.event_date,
        venue: event.venue || event.location,
        registrationId: registration.registration_id
      }
    });
  } catch (err) {
    if (err.code === 'REQUIRES_BOARD_APPROVAL') {
      return res.status(403).json({
        success: false,
        code: 'REQUIRES_BOARD_APPROVAL',
        error: err.message,
        cancelledPassId: err.cancelledPassId
      });
    }
    if (err.code === 'PENDING_BOARD_APPROVAL') {
      return res.status(403).json({
        success: false,
        code: 'PENDING_BOARD_APPROVAL',
        error: err.message,
        cancelledPassId: err.cancelledPassId
      });
    }
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.getUserRegistrations = async (req, res) => {
  try {
    const regs = await EventRegistration.findByUserId(req.params.userId);
    return res.json({ success: true, count: regs.length, registrations: regs });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.verifyPass = async (req, res) => {
  try {
    const { passCode } = req.body;
    if (!passCode) return res.status(400).json({ success: false, error: 'Pass code is required.' });

    const result = await EventRegistration.markCheckIn(passCode);
    if (!result.success) {
      return res.status(400).json({ success: false, error: result.message, reg: result.reg });
    }

    return res.json({ success: true, message: result.message, checkinTime: result.checkinTime, reg: result.reg });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.cancelRegistration = async (req, res) => {
  try {
    const { passCode } = req.body;
    if (!passCode) return res.status(400).json({ success: false, error: 'Pass code is required.' });

    const result = await EventRegistration.cancelRegistration(passCode);
    if (!result.success) return res.status(400).json(result);

    return res.json({ success: true, message: result.message });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.requestReRegistration = async (req, res) => {
  try {
    const { eventId, attendeeEmail, attendeeName, contactNo, reason } = req.body;
    if (!eventId || !attendeeEmail) {
      return res.status(400).json({ success: false, error: 'Event ID and email are required.' });
    }

    const record = await CancelledPass.requestReRegistration({
      eventId,
      attendeeEmail,
      attendeeName: attendeeName || 'Attendee',
      contactNo: contactNo || '',
      reason: reason || 'Attendee requested re-registration after cancellation.'
    });

    return res.json({
      success: true,
      message: 'Re-registration request has been submitted to the Executive Board for review. You will be notified once a decision is made.',
      record
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.getCancelledPasses = async (req, res) => {
  try {
    const passes = await CancelledPass.findAll();
    return res.json({ success: true, count: passes.length, cancelledPasses: passes });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.reviewReRegistration = async (req, res) => {
  try {
    const { id, action, reviewerName, comment } = req.body;
    if (!id || !action) {
      return res.status(400).json({ success: false, error: 'Request ID and action (approve/decline/delete) are required.' });
    }

    const result = await CancelledPass.reviewReRegistration(id, action, reviewerName || 'Board Officer', comment || '');
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.getMyPassStatus = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ success: false, error: 'Email parameter is required.' });

    const cleanEmail = email.toLowerCase().trim();
    const allCancelled = await CancelledPass.findAll();
    const userCancelled = allCancelled.filter(cp => cp.attendee_email && cp.attendee_email.toLowerCase() === cleanEmail);

    return res.json({
      success: true,
      records: userCancelled
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

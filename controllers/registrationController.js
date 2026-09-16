const EventRegistration = require('../models/EventRegistration');
const Event = require('../models/Event');

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

    await Event.incrementRegisteredCount(eventId);

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Digital event pass issued.',
      pass: {
        passCode: registration.pass_code,
        eventTitle: event.title,
        attendeeName: registration.attendee_name,
        eventDate: event.event_date,
        venue: event.venue,
        registrationId: registration.registration_id
      }
    });
  } catch (err) {
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

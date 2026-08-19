const Event = require('../models/Event');
const Avenue = require('../models/Avenue');

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll();
    return res.json({ success: true, count: events.length, events });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, error: 'Event not found.' });
    return res.json({ success: true, event });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { avenueId, title, description, eventDate, venue, maxCapacity } = req.body;
    if (!title || !eventDate || !venue) {
      return res.status(400).json({ success: false, error: 'Title, event date, and venue are required.' });
    }

    const newEvent = await Event.create({ avenueId, title, description, eventDate, venue, maxCapacity });
    return res.status(201).json({ success: true, message: 'Event created successfully!', event: newEvent });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.getAvenues = async (req, res) => {
  try {
    const avenues = await Avenue.findAll();
    return res.json({ success: true, count: avenues.length, avenues });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

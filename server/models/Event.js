// models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  participants: { type: [String], required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  duration: { type: Number, required: true },
  sessionNotes: { type: String, required: true },
  user: { type: String, required: true },
  eventId: { type: String, required: true },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;

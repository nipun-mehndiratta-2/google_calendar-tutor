const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const authenticateToken = require('../middleware/authenticateToken');
const {
  createGoogleCalendarEvent,
  updateGoogleCalendarEvent,
  deleteGoogleCalendarEvent,
} = require('../googleCalendar');

// Create an event
router.post('/', authenticateToken, async (req, res) => {
  try {
    // console.log(req.body)
    const userEmail = req.userData.userEmail
    const data = await createGoogleCalendarEvent(userEmail, req.body);
    const eventid = data?.id ? data?.id : null;
    let event = new Event({...req.body, user: userEmail, eventId:eventid });
    await event.save();
    return res.status(201).send(event);
    
  } catch (error) {
    console.log(error)
    res.status(400).send(error);
  }
});

// Update an event by ID
router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, user: req.userData.userEmail },
      req.body,
      { new: true, runValidators: true }
    );
    if (!event) {
      return res.status(404).send();
    }
    if(event.eventId){
      const updateInGoogle = await updateGoogleCalendarEvent(req.userData.userEmail, event.eventId, req.body);
  }

    return res.status(200).send(event);
  } catch (error) {
    return res.status(400).send(error);
  }
});

// Get all events for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const events = await Event.find({ user: req.userData.userEmail });
    return res.status(200).send(events);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

// Delete an event by ID
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({ _id: req.params.id, user: req.userData.userEmail },{returnDocument:true});
    // if (!event) {
    //   return res.status(404).send();
    // }
    if(event.eventId){
    const resFromGoogle = await deleteGoogleCalendarEvent(req.userData.userEmail, event.eventId);
    }
    res.status(200).send(event);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;

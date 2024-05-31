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
    if(data?.id){
      let event = new Event({...req.body, user: userEmail, eventId:data.id });
      await event.save();
      return res.status(201).send(event);
    }
      return res.status(400).send("failed");

  } catch (error) {
    console.log(error)
    res.status(400).send(error);
  }
});

// Update an event by ID
router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findOneAndUpdate(
      { _id: req.body._id, user: req.userData.userEmail },
      req.body,
      { new: true, runValidators: true }
    );
    if (!event) {
      return res.status(404).send();
    }

    await updateGoogleCalendarEvent(req.userData.userEmail, req.params.id, req.body);

    res.status(200).send(event);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all events for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const events = await Event.find({ user: req.userData.userEmail });
    res.status(200).send(events);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete an event by ID
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    console.log(req.userData.userId)
    const event = await Event.findOneAndDelete({ eventId: req.params.id, user: req.userData.userEmail });
    // if (!event) {
    //   return res.status(404).send();
    // }
    const resFromGoogle = await deleteGoogleCalendarEvent(req.userData.userEmail, req.params.id);

    res.status(200).send(resFromGoogle);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;

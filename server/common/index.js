const {getGoogleCalendarEvents} = require("../googleCalendar")
const Event = require("../models/Event")
const moment = require('moment');



const utcToLocal = (dateTimeString) => {

    const localDateTime = moment(dateTimeString).local();
    return localDateTime;

  }


const getDuration = (start,end) => {

    const startTime = new Date(start); 
    const endTime = new Date(end);   

    const durationInMilliseconds = Math.abs(endTime - startTime);

    const durationInMinutes = durationInMilliseconds / (1000 * 60); 

    return durationInMinutes;
  } 

const handleEventsIntegration = async (userEmail) => {
    const events = await getGoogleCalendarEvents(userEmail);

    if (events?.length > 0) {
      for (const event of events) {
        const localStartDateTime = utcToLocal(event.start.dateTime);
        const localDate = localStartDateTime.format('YYYY-MM-DD');
        const localTime = localStartDateTime.format('HH:mm');
    
        await Event.findOneAndUpdate(
          { eventId: event?.id,user: userEmail },
          {
            title: event?.summary,
            description: event?.description,
            date: localDate,
            time: localTime,
            duration: getDuration(event.start.dateTime,event.end.dateTime),
            sessionNotes: "",
            participants: event?.attendees.map((attendee) => attendee.email),
            user: userEmail,
            eventId: event?.id
          },
          { upsert: true }
        );
      }
    }

}

module.exports = {
    handleEventsIntegration,
    getDuration,
    utcToLocal

}
const { google } = require('googleapis');
const User = require('./models/User');

const calculateEndTime = (startDateTime, duration) => {
  const endDateTime = new Date(startDateTime);
  endDateTime.setHours(endDateTime.getHours() + duration);
  return endDateTime.toISOString();
};

const getAuthenticatedClient = async (userEmail) => {
  try{
  const user = await User.findOne({ email: userEmail });
  if (!user || !user.googleTokens) {
    throw new Error('User not authenticated with Google');
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  oauth2Client.setCredentials(user.googleTokens);

  return oauth2Client;
}
catch(error){
  console.log(error);
  return null;
}
};

const createGoogleCalendarEvent = async (userEmail, event) => {
  try{
  const auth = await getAuthenticatedClient(userEmail);
  if(auth){
  const calendar = google.calendar({ version: 'v3', auth });

  const startDateTime = new Date(`${event.date}T${event.time}`);
  const endDateTime = calculateEndTime(startDateTime, event.duration);

  const googleEvent = {
    summary: event.title,
    description: event.description,
    start: {
      dateTime: startDateTime.toISOString(),
      timeZone: 'UTC',
    },
    end: {
      dateTime: endDateTime,
      timeZone: 'UTC',
    },
    attendees: event.participants.map((email) => ({ email })),
  };

  const eventResponse = await calendar.events.insert({
    calendarId: 'primary',
    resource: googleEvent,
  });
  return eventResponse.data;
}
return null;
}
catch(error){
console.log(error);
return null;
}
};

const updateGoogleCalendarEvent = async (userEmail, eventId, event) => {
  try{
    if(!eventId){
      return null;
    }
  const auth = await getAuthenticatedClient(userEmail);
  if(auth){
  const calendar = google.calendar({ version: 'v3', auth });

  const startDateTime = new Date(`${event.date}T${event.time}`);
  const endDateTime = calculateEndTime(startDateTime, event.duration);

  const googleEvent = {
    summary: event.title,
    description: event.description,
    start: {
      dateTime: startDateTime.toISOString(),
      timeZone: 'UTC',
    },
    end: {
      dateTime: endDateTime,
      timeZone: 'UTC',
    },
    attendees: event.participants.map((email) => ({ email })),
  };

  const eventResponse = calendar.events.update({
    calendarId: 'primary',
    eventId: eventId,
    resource: googleEvent,
  });

  return eventResponse.data;
}
return null;
}
catch(error){
  console.log(error);
  return null;
}
};

const deleteGoogleCalendarEvent = async (userEmail, eventId) => {
  try{
  const auth = await getAuthenticatedClient(userEmail);
  const calendar = google.calendar({ version: 'v3', auth });

  const deleteRes = await calendar.events.delete({
    calendarId: 'primary',
    eventId: eventId,
  });
  return { message: 'Event deleted successfully' };
}
catch(error){
  console.log(error)
}
};

const getGoogleCalendarEvents = async (userEmail) => {
  try {
    const auth = await getAuthenticatedClient(userEmail);
    const calendar = google.calendar({ version: 'v3', auth });

    const response = await calendar.events.list({
      calendarId: 'primary',
      singleEvents: true,
      orderBy: 'startTime',
      pageToken: null,
    });
    return response.data.items;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch events');
  }
};

module.exports = {
  createGoogleCalendarEvent,
  updateGoogleCalendarEvent,
  deleteGoogleCalendarEvent,
  getGoogleCalendarEvents
};

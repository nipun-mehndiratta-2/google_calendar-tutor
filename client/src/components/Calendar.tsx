import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";

import { fetchEvents } from '../api';

const Calendar = ({ onEventClick }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const getEvents = async () => {
      const response = await fetchEvents();
      setEvents(response.data);
    };
    getEvents();
  }, []);

  const handleDateClick = (arg) => {
    onEventClick({ event: { extendedProps: { date: arg.dateStr } } });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Calendar</h2>
      <FullCalendar
        plugins={[dayGridPlugin,interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={onEventClick}
        dateClick={handleDateClick}
      />
    </div>
  );
};

export default Calendar;

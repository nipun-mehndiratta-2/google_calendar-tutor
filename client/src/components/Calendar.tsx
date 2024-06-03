import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";


const Calendar = ({ onEventClick, events }) => {


  const handleDateClick = (arg) => {
    onEventClick({ event: { extendedProps: { date: arg.dateStr } } });
  };
  return (
    <div className="relative z-0 flex flex-col min-w-0 p-3 break-words bg-white border-0 shadow-xl rounded-2xl bg-clip-border">
      <h2 className="text-lg font-semibold mb-4">Calendar</h2>
      <FullCalendar
        plugins={[dayGridPlugin,interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClassNames={"bg-cyan-400 border-0 p-1"}
        eventClick={onEventClick}
        dateClick={handleDateClick}
      />
    </div>
  );
};

export default Calendar;

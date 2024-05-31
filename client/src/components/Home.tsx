import GoogleAuth from './GoogleAuth';
import Calendar from './Calendar';
import EventForm from './EventForm';
import { fetchUser } from '../api';
import { useState, useEffect } from 'react';

const HomeContent = ({ handleLogout }) => {

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
      const fetchUserEmail = async () => {
        try {
          await fetchUser();
        } catch (error) {
          handleLogout();
          console.error('Error fetching user email', error);
        }
      };
  
      fetchUserEmail();
    }, []);

    const handleEventClick = (eventClickInfo) => {
        setSelectedEvent(eventClickInfo.event.extendedProps);
        setShowForm(true);
      };
    
      const handleFormClose = () => {
        setSelectedEvent(null);
        setShowForm(false);
      };
    
      const handleFormSave = () => {
        setSelectedEvent(null);
        setShowForm(false);
      };

  return (
    <div style={{paddingRight:'20px',paddingLeft:'20px'}}>
        <div style={{display:"flex",justifyContent:'space-between'}}>
        <GoogleAuth />
        <button className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition duration-300"
 onClick={handleLogout}>Logout</button>
        </div>
        <Calendar onEventClick={handleEventClick} />
        {showForm && (
          <EventForm
            event={selectedEvent}
            onClose={handleFormClose}
            onSave={handleFormSave}
          />
        )}
      </div>
  );
};

export default HomeContent;

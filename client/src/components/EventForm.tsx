import { useState, useEffect } from 'react';
import { createEvent, updateEvent, deleteEvent } from '../api';
import { toast } from 'react-toastify';
import Card from './Card';

const EventForm = ({ event, onClose, onSave }) => {
  const initialFormData = {
    title: '',
    description: '',
    participants: [],
    date: '',
    time: '',
    duration: '',
    sessionNotes: '',
    ...event
  };

  if (!Array.isArray(initialFormData.participants)) {
    initialFormData.participants = [];
  }

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (event && !Array.isArray(event.participants)) {
      setFormData({ ...formData, participants: [] });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'participants') {
      const participantsArray = value.split(',').map(participant => participant.trim());
      setFormData({ ...formData, [name]: participantsArray });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (event.date) {
        await createEvent(formData);
        toast.success('Event created successfully!');
      } else {
        await updateEvent(formData.eventId, formData);
        toast.success('Event updated successfully!');
      }
      onSave();
    } catch (error) {
      toast.error('Please Sync With Google Calendar');
      console.error('Error:', error);
    }
  };

  const handleDeleteEvent = async (e) => {
    e.preventDefault();
    try {
      await deleteEvent(formData.eventId);
      toast.success('Event deleted successfully!');
      onSave();
    } catch (error) {
      toast.error('Please Sync With Google Calendar');
      console.error('Error:', error);
    }
  };
  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{event.date ? 'Create Event' : 'Edit Event'}</h2>
        <button onClick={handleDeleteEvent}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 text-red-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0V4.474c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201V5.79m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input w-full"
            required
          />
        </div>
        {/* Description */}
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input w-full"
          />
        </div>
        {/* Participants */}
        <div>
          <label className="block mb-1 font-medium">Participants</label>
          <input
            type="text"
            name="participants"
            value={formData.participants.join(', ')}
            onChange={handleChange}
            className="input w-full"
          />
        </div>
        {/* Date */}
        <div>
          <label className="block mb-1 font-medium">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="input w-full"
          />
        </div>
        {/* Time */}
        <div>
          <label className="block mb-1 font-medium">Time</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="input w-full"
          />
        </div>
        {/* Duration */}
        <div>
          <label className="block mb-1 font-medium">Duration (hrs)</label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="input w-full"
          />
        </div>
        {/* Session Notes */}
        <div>
          <label className="block mb-1 font-medium">Session Notes</label>
          <textarea
            name="sessionNotes"
            value={formData.sessionNotes}
            onChange={handleChange}
            className="input w-full"
          />
        </div>
        {/* Form actions */}
        <div className="flex justify-end space-x-2">
          <button
            type="submit"
            className="bg-cyan-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-cyan-600 transition duration-300"
          >
            {event.date ? 'Create' : 'Edit'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg shadow-md hover:bg-cyan-600 transition duration-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </Card>
  );
};

export default EventForm;

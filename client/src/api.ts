import axios from 'axios';

const API_URL = 'http://localhost:3000';

const getToken = () => {
    const token = localStorage.getItem('token');
    return token ? `Bearer ${token}` : '';
  };
  
  const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: getToken(),
      'Content-Type': 'application/json',
    },
  });
  
  // Function to update the headers with the token
  export const setAuthHeader = () => {
    axiosInstance.defaults.headers.Authorization = getToken();
  };
  
  // Fetch events with authenticated token
  export const fetchEvents = () => {
    setAuthHeader();
    return axiosInstance.get('/events');
  };
  
  // Create event with authenticated token
  export const createEvent = (event) => {
    setAuthHeader();
    return axiosInstance.post('/events', event);
  };
  
  // Update event with authenticated token
  export const updateEvent = (id, event) => {
    setAuthHeader();
    return axiosInstance.patch(`/events/${id}`, event);
  };
  
  // Delete event with authenticated token
  export const deleteEvent = (id) => {
    setAuthHeader();
    return axiosInstance.delete(`/events/${id}`);
  };

export const login = (credentials) => axios.post(`${API_URL}/users/login`, credentials);
  // Fetch events with authenticated token
  export const fetchUser = () => {
    setAuthHeader();
    return axiosInstance.get('/users');
  };
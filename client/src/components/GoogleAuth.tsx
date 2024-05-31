import { useEffect, useState } from 'react';
import { fetchUser } from '../api';

const GoogleAuth = () => {
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const response = await fetchUser();
        setUserEmail(response?.data?.email);
      } catch (error) {
        console.error('Error fetching user email', error);
      }
    };

    fetchUserEmail();
  }, []);

  const handleAuth = () => {
    const syncUrl = `${process.env.SERVER_URL}/auth/google?email=${userEmail}`;
    const width = 400, height = 600;
    const left = (window.innerWidth - width) / 2, top = (window.innerHeight - height) / 2;
    const popupWindow = window.open(syncUrl, "_blank", `width=${width}, height=${height}, left=${left}, top=${top}`);
    if (popupWindow) popupWindow.focus();
  };

  return (
    <div>
      <button className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition duration-300" onClick={handleAuth}>Sync with Google Calendar</button>
    </div>
  );
};

export default GoogleAuth;

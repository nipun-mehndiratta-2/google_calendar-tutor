import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomeContent from './components/Home';
import Login from './components/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const App = () => {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('token'));

  const handleLogin = () => {
    setLoggedIn(localStorage.getItem('token'));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(null);
  };

  return (
    <div>
              <ToastContainer />
      <Router>
        <Routes>
          {/* Redirect to the appropriate route based on authentication status */}
          {!loggedIn ? (
            <Route path="/" element={<Login onLogin={handleLogin} />} />
          ) : (
            <Route path="/" element={<Navigate to="/home" />} />
          )}

          {/* Home route */}
          <Route
            path="/home"
            element={
              loggedIn ? (
                <HomeContent handleLogout={handleLogout} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;

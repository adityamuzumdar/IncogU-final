import React from 'react';
import { useAuth } from '../AuthProvider';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const auth = useAuth(); // Access the AuthProvider context
  const navigate = useNavigate();

  const handleLogout = () => {
    auth?.logout(); // Clear authentication state
    navigate('/login'); // Redirect to the login page
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Welcome to IncogU!</h1>
      <p>
        You are successfully logged in. Explore the features and content available to you!
      </p>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#007BFF',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '20px',
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Home;
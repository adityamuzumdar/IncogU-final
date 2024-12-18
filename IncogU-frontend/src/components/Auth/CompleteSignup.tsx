import { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const CompleteSignup = () => {
  const [email, setEmail] = useState<string>('');  // State to store email
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const query = new URLSearchParams(useLocation().search);
  const navigate = useNavigate();

  // Handle form submission
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate if both email and password are provided
    if (!email || !password) {
      setMessage('Email and password are required.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5001/api/auth/complete-signup', {
        email,  // Send email to the backend
        password,
      });

      setMessage(response.data.message);  // Display success message from backend
      setTimeout(() => navigate('/'), 2000);  // Redirect to login after 2 seconds
    } catch (error: any) {
      // Display error message from the backend
      if (error.response && error.response.data && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('An unexpected error occurred.');
      }
      console.error('Complete Signup Error:', error);  // Log error for debugging
    }
  };

  return (
    <div>
      <h1>Complete Your Signup</h1>
      <p>{message}</p>
      <form onSubmit={handlePasswordSubmit}>
        {/* Email input */}
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {/* Password input */}
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Set Password</button>
      </form>
    </div>
  );
};

export default CompleteSignup;
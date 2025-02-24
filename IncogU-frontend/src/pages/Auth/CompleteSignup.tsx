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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', maxWidth: '400px', width: '100%' }}>
        <h1 style={{ textAlign: 'center', color: '#333' }}>Complete Your Signup</h1>
        <p style={{ textAlign: 'center', color: '#666' }}>{message}</p>
        <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {/* Email input */}
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          {/* Password input */}
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{ padding: '10px', borderRadius: '4px', border: 'none', backgroundColor: '#007bff', color: '#fff', cursor: 'pointer' }}>
            Set Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteSignup;
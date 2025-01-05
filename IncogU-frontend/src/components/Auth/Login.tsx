import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthProvider'; // Import the AuthProvider hook

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate();
  const auth = useAuth(); // Access the authentication context

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage('Email and password are required.');
      return;
    }

    try {
      // Send login request to the server
      const response = await axios.post('http://localhost:5001/api/auth/login', {
        email,
        password,
      });

      const { token } = response.data; // Extract the token from the response

      // Update authentication state using the context
      auth?.login(token);

      setMessage('Login successful!');
      
      // Redirect to the home page
      navigate('/');
    } catch (error: any) {
      // Handle errors
      if (error.response && error.response.data && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('An unexpected error occurred.');
      }
      console.error('Login Error:', error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <p>{message}</p>
      <form onSubmit={handleLoginSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
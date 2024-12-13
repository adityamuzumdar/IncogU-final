import React, { useState } from 'react';
import axios from 'axios';

const CompleteSignup = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/auth/complete-signup', { email, password });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error: Unable to complete signup.');
    }
  };

  return (
    <div>
      <h1>Complete Signup</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email (must be verified)"
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
        <button type="submit">Complete Signup</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CompleteSignup;
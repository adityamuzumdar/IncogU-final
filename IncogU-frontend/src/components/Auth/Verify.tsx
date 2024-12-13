import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const VerifyEmail = () => {
  const [message, setMessage] = useState<string>('');
  const query = new URLSearchParams(useLocation().search);
  const token = query.get('token');

  useEffect(() => {
    if (token) {
      axios.get(`http://localhost:5001/api/auth/verify?token=${token}`)
        .then(response => setMessage(response.data.message))
        .catch(error => setMessage('Verification failed. Invalid or expired token.'));
    }
  }, [token]);

  return (
    <div>
      <h1>Email Verification</h1>
      <p>{message}</p>
    </div>
  );
};

export default VerifyEmail;
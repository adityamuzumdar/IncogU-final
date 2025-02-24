import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
  const [message, setMessage] = useState<string>('');
  const query = new URLSearchParams(useLocation().search);
  const token = query.get('token');
  const navigate = useNavigate(); // Use useNavigate instead of history

  useEffect(() => {
    if (token) {
      axios
        .get(`http://localhost:5001/api/auth/verify?token=${token}`)
        .then((response) => {
          setMessage(response.data.message);
          // Redirect to the password setting page
          navigate('/complete-signup'); // Use navigate instead of history.push
        })
        .catch((error) => {
          if (error.response && error.response.data && error.response.data.message) {
            setMessage(error.response.data.message);
          } else {
            setMessage('An error occurred during verification.');
          }
        });
    } else {
      setMessage('Invalid or missing token.');
    }
  }, [token, navigate]);

  return (
    <div>
      <h1>Email Verification</h1>
      <p>{message}</p>
    </div>
  );
};

export default VerifyEmail;
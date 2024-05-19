import React, { useState } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import axios from 'axios';

function JobLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username: username,
        password: password
      });
      setMessage(response.data.message);
      if (response.data.message === 'Login successful') {
        navigate('/job'); // Redirect to Job component after successful login
      }
    } catch (error) {
      console.error('Error:', error.response.data.message);
      setMessage(error.response.data.message);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Login
      </Typography>
      <TextField
        label="Username"
        fullWidth
        margin="normal"
        variant="outlined"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        label="Password"
        fullWidth
        margin="normal"
        variant="outlined"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        variant="contained"
        color="secondary"
        fullWidth
        style={{ marginTop: '1rem' }}
        onClick={handleLogin}
      >
        Login
      </Button>
      {message && (
        <Typography variant="body1" style={{ marginTop: '1rem', textAlign: 'center' }}>
          {message}
        </Typography>
      )}
    </Container>
  );
}

export default JobLogin;

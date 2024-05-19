import React, { useState } from 'react';
import { Button, TextField, Snackbar, Box, Typography, Paper } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';

function AddUserForm() {
  const [sitename, setSitename] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSitenameChange = (event) => {
    setSitename(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const username = localStorage.getItem('username'); // Retrieve username from local storage
  
    try {
      const response = await axios.post('http://localhost:5000/add_user', {
        sitename: sitename,
        password: password
      }, {
        withCredentials: true
      });
  
      if (response.data.status === 'success') {
        setSuccessMessage(response.data.message);
        setOpenSnackbar(true);
        // Clear form fields
        setSitename('');
        setPassword('');
      } else {
        setErrorMessage(response.data.message);
        setOpenSnackbar(true);
      }
    } catch (error) {
      setErrorMessage('An error occurred while adding the site.');
      setOpenSnackbar(true);
    }
  };
  

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f0f0',
      }}
    >
      <Paper elevation={3} sx={{ padding: '24px', maxWidth: '400px' }}>
        <Typography variant="h5" align="center" gutterBottom>
          Add New Site
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Site Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={sitename}
            onChange={handleSitenameChange}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={handlePasswordChange}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Add Site
          </Button>
          <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
            <MuiAlert onClose={handleCloseSnackbar} severity={errorMessage ? 'error' : 'success'}>
              {errorMessage || successMessage}
            </MuiAlert>
          </Snackbar>
        </form>
      </Paper>
    </Box>
  );
}

export default AddUserForm;

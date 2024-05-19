import React, { useState } from 'react';
import { TextField, Button, Grid, Paper, Typography } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const VerifyPassword = () => {
  const [verifyUser, setVerifyUser] = useState({ verify_sitename: '', verify_password: '' });

  const handleVerifyPassword = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/verify_password',
        verifyUser,
        {
          withCredentials: true
        }
      );
  
      // Check if response and response.data are defined
      if (response && response.data && response.data.status === 'success') {
        console.log(response.data);
        // Display success notification
        toast.success('Site password is correct', { position: 'bottom-right' });
        // Add any additional logic or UI updates after successful verification
      } else {
        console.error('Invalid response format or login failed:', response);
        // Display error notification for unsuccessful login
        toast.error('Site password is Incorrect', { position: 'bottom-right' });
      }
    } catch (error) {
      console.error('Error:', error.message);
      // Display error notification for network or server errors
      toast.error('Error ', { position: 'bottom-right' });
    }
  };
  
  return (
    <Grid container justifyContent="center" alignItems="center" height="100vh">
      <Grid item xs={10} sm={8} md={6} lg={4}>
        <Paper elevation={3} style={{ padding: '16px' }}>
          <Typography variant="h5" align="center" gutterBottom>
            Verify Password
          </Typography>
          <form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="sitename"
                  variant="outlined"
                  value={verifyUser.verify_sitename}
                  onChange={(e) => setVerifyUser({ ...verifyUser, verify_sitename: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="Password"
                  variant="outlined"
                  value={verifyUser.verify_password}
                  onChange={(e) => setVerifyUser({ ...verifyUser, verify_password: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" fullWidth onClick={handleVerifyPassword}>
                  Verify Password
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
      <ToastContainer />
    </Grid>
  );
};

export default VerifyPassword;

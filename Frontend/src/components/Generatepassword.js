import React, { useState } from 'react';
import { Button, Grid, Paper, Typography, IconButton } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import axios from 'axios';

const GeneratePassword = () => {
  const [generatedPassword, setGeneratedPassword] = useState('');

  const handleGeneratePassword = async () => {
    try {
      const response = await axios.get('http://localhost:5000/generate_strong_password');

      if (response && response.data) {
        setGeneratedPassword(response.data.message);
      } else {
        console.error('Invalid response format:', response);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handleRefreshPassword = () => {
    setGeneratedPassword('');
  };

  return (
    <Grid container justifyContent="center" alignItems="center" height="100vh">
      <Grid item xs={10} sm={8} md={6} lg={4}>
        <Paper elevation={3} style={{ padding: '16px' }}>
          <Typography variant="h5" align="center" gutterBottom>
            Generate Strong Password
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleGeneratePassword}
                disabled={!!generatedPassword}
              >
                Generate Password
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" align="center" style={{ margin: '16px' }}>
                {generatedPassword ? (
                  <>
                    Generated Password: {generatedPassword}
                    <IconButton onClick={handleRefreshPassword} size="small" color="primary">
                      <RefreshIcon />
                    </IconButton>
                  </>
                ) : (
                  'Click the button above to generate a password.'
                )}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default GeneratePassword;

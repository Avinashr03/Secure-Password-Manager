import React, { useState } from 'react';
import { TextField, Button, Grid, Paper, Typography, LinearProgress } from '@mui/material';
import axios from 'axios';

const PasswordStrengthChecker = () => {
  const [passwordStrength, setPasswordStrength] = useState({ password_to_assess: '' });
  const [strengthResult, setStrengthResult] = useState('');
  const [passwordStrengthValue, setPasswordStrengthValue] = useState(null);

  const handlePasswordStrength = async () => {
    try {
      const response = await axios.post('http://localhost:5000/password_strength', passwordStrength);

      if (response && response.data) {
        console.log(response.data);
        setStrengthResult(response.data.message);
        const passwordStrengthValue = parseInt(response.data.message.match(/\d+/)[0]);
        setPasswordStrengthValue(passwordStrengthValue);
      } else {
        console.error('Invalid response format:', response);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const getProgressBarColor = () => {
    if (passwordStrengthValue && passwordStrengthValue < 20) {
      return 'error'; // Set color to red for weak passwords
    }
    return 'primary'; // Set color to primary for passwords of sufficient strength
  };

  return (
    <Grid container justifyContent="center" alignItems="center" height="100vh">
      <Grid item xs={10} sm={8} md={6} lg={4}>
        <Paper elevation={3} style={{ padding: '16px' }}>
          <Typography variant="h5" align="center" gutterBottom>
            Password Strength Checker
          </Typography>
          <form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="Password to Assess"
                  variant="outlined"
                  value={passwordStrength.password_to_assess}
                  onChange={(e) => setPasswordStrength({ ...passwordStrength, password_to_assess: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" fullWidth onClick={handlePasswordStrength}>
                  Check Password Strength
                </Button>
              </Grid>
              <Grid item xs={12}>
                {strengthResult && (
                  <div>
                    <Typography variant="body1" align="center" style={{ margin: '16px' }}>
                      {strengthResult}
                    </Typography>
                    <LinearProgress variant="determinate" value={passwordStrengthValue * 10} color={getProgressBarColor()} />
                  </div>
                )}
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default PasswordStrengthChecker;

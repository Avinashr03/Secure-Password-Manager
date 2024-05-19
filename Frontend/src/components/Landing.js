import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Grid, Paper, Typography } from '@mui/material';

const Home = () => {
  return (
    <Grid container justifyContent="center" alignItems="center" height="100vh">
      <Grid item xs={10} sm={8} md={6} lg={4}>
        <Paper elevation={3} style={{ padding: '16px' }}>
          <Typography variant="h4" align="center" gutterBottom>
            Password Manager
          </Typography>
          <Typography variant="body1" align="center" paragraph>
            Welcome to the Password Manager application. Use the following features to manage your passwords:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" component={Link} to="/add_user" fullWidth>
                Add sitename
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" component={Link} to="/verify_password" fullWidth>
                Verify Password
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" component={Link} to="/search_username" fullWidth>
                Search sitename
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" component={Link} to="/password_strength" fullWidth>
                Password Strength Checker
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" component={Link} to="/generate_password" fullWidth>
                Generate Strong Password
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Home;

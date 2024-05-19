import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Grid } from '@mui/material';
import axios from 'axios';

function Login() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [signupMessage, setSignupMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5000/login', formData, {
            withCredentials: true
          }).then(response => {
                if (response.data.status === 'success') {
                    // Store username and message in local storage
                    localStorage.setItem('username', formData.username);
                    console.log(response.data.message);
                    window.location.href = '/mainhome';
                } else {
                    // Handle error
                    console.error(response.data.message);
                    setSignupMessage(response.data.message);
                }
            })
            .catch(error => console.error('Error:', error));
    };

    return (
        <Container component="main" maxWidth="xs"  sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
          }}>
            <div>
                <Typography variant="h5" align="center" gutterBottom>
                    Login
                </Typography>
                {signupMessage && <Typography color="error" align="center" gutterBottom>{signupMessage}</Typography>}
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                label="Username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                label="Password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="large"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Login
                    </Button>
                </form>
            </div>
        </Container>
    );
}

export default Login;

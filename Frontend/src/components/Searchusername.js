import React, { useState } from 'react';
import { TextField, Button, Grid, Paper, Typography } from '@mui/material';
import axios from 'axios';
const SearchUsername = () => {
    const [searchUser, setSearchUser] = useState({ search_sitename: '' });
    const [searchResult, setSearchResult] = useState('');

    const handleSearchUsername = async () => {
        try {
            const response = await axios.post(
                'http://localhost:5000/search_sitename', 
                searchUser, 
                { withCredentials: true }
            );
     
            // Check if response and response.data are defined
            if (response && response.data) {
                console.log(response.data);
                // Update search result state
                setSearchResult(response.data.message);
            } else {
                console.error('Invalid response format:', response);
            }
        } catch (error) {
            console.error('Error:', error.message);
            // Handle errors or display error messages to the user
        }
    };
    
    return (
        <Grid container justifyContent="center" alignItems="center" height="100vh">
            <Grid item xs={10} sm={8} md={6} lg={4}>
                <Paper elevation={3} style={{ padding: '16px' }}>
                    <Typography variant="h5" align="center" gutterBottom>
                        Site Name
                    </Typography>
                    <form>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Username to Search"
                                    variant="outlined"
                                    value={searchUser.search_sitename}
                                    onChange={(e) => setSearchUser({ ...searchUser, search_sitename: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant="contained" color="primary" fullWidth onClick={handleSearchUsername}>
                                    Search site Name
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body1" align="center" style={{ margin: '16px', padding: '12px', border: '1px solid #ccc', borderRadius: '4px' }}>
                                    {searchResult}
                                </Typography>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default SearchUsername;

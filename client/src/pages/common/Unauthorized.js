import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';

const Unauthorized = () => (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 3, textAlign: 'center' }}>
        <Box>
            <Typography variant="h4" sx={{ mb: 1 }}>Unauthorized</Typography>
            <Typography variant="body1" sx={{ mb: 3, color: 'var(--text-muted)' }}>
                You do not have permission to access this page.
            </Typography>
            <Button component={Link} to="/dashboard" variant="contained">Go to Dashboard</Button>
        </Box>
    </Box>
);

export default Unauthorized;

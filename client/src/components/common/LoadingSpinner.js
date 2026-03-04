import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const LoadingSpinner = () => (
    <Box sx={{ display: 'grid', placeItems: 'center', py: 4 }}>
        <CircularProgress sx={{ color: 'var(--primary)' }} />
    </Box>
);

export default LoadingSpinner;

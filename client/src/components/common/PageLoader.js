import React from 'react';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';

const PageLoader = ({ label = 'Loading' }) => (
    <Box
        sx={{
            position: 'fixed',
            inset: 0,
            zIndex: 1300,
            display: 'grid',
            placeItems: 'center',
            background: 'var(--bg)',
            color: 'var(--text)',
            backdropFilter: 'blur(6px)',
        }}
    >
        <Stack spacing={1.5} alignItems="center">
            <CircularProgress sx={{ color: 'var(--primary)' }} />
            <Typography variant="body2" sx={{ color: 'var(--text-muted)', fontWeight: 600 }}>
                {label}
            </Typography>
        </Stack>
    </Box>
);

export default PageLoader;

import React from 'react';
import { Box, Typography } from '@mui/material';

const EmptyState = ({ title = 'No data yet', description = 'Create your first item to get started.' }) => (
    <Box
        sx={{
            border: '1px dashed var(--border)',
            borderRadius: 'var(--radius)',
            p: 3,
            textAlign: 'center',
            background: 'linear-gradient(180deg, var(--bg-card), var(--bg))',
        }}
    >
        <Typography variant="h6" sx={{ color: 'var(--text)', mb: 0.5 }}>
            {title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>
            {description}
        </Typography>
    </Box>
);

export default EmptyState;

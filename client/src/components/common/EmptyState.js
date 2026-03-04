import React from 'react';
import { Box, Typography } from '@mui/material';
import AppButton from './AppButton';

const EmptyState = ({ 
    title = 'No data yet', 
    description = 'Create your first item to get started.',
    icon: Icon,
    actionLabel,
    onAction,
    sx = {}
}) => (
    <Box
        sx={{
            border: '1px dashed var(--border)',
            borderRadius: 'var(--radius)',
            p: 6,
            textAlign: 'center',
            background: 'rgba(249, 115, 22, 0.02)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            ...sx,
        }}
    >
        {Icon && (
            <Box sx={{ color: 'var(--text-muted)', mb: 2, opacity: 0.5 }}>
                <Icon size={48} />
            </Box>
        )}
        <Typography variant="h6" sx={{ color: 'var(--text)', mb: 1, fontWeight: 600 }}>
            {title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--text-muted)', mb: actionLabel ? 3 : 0, maxWidth: 300, mx: 'auto' }}>
            {description}
        </Typography>
        {actionLabel && (
            <AppButton onClick={onAction}>
                {actionLabel}
            </AppButton>
        )}
    </Box>
);

export default EmptyState;

import React from 'react';
import { Button } from '@mui/material';

const AppButton = ({ children, variant = 'contained', sx = {}, ...props }) => (
    <Button
        variant={variant}
        sx={{
            borderRadius: 'var(--radius)',
            textTransform: 'none',
            fontWeight: 600,
            ...(variant === 'contained'
                ? {
                    background: 'var(--primary)',
                    color: '#fff',
                    '&:hover': { background: 'var(--primary-hover)' },
                }
                : {
                    borderColor: 'var(--border)',
                    color: 'var(--text)',
                    '&:hover': {
                        borderColor: 'var(--primary)',
                        background: 'var(--primary-light)',
                    },
                }),
            ...sx,
        }}
        {...props}
    >
        {children}
    </Button>
);

export default AppButton;

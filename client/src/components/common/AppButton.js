import React from 'react';
import { Button } from '@mui/material';

const AppButton = ({ 
    children, 
    variant = 'contained', 
    sx = {}, 
    startIcon: StartIcon, 
    endIcon: EndIcon,
    iconSize = 18,
    ...props 
}) => (
    <Button
        variant={variant}
        startIcon={StartIcon && <StartIcon size={iconSize} />}
        endIcon={EndIcon && <EndIcon size={iconSize} />}
        sx={{
            borderRadius: 'var(--radius)',
            textTransform: 'none',
            fontWeight: 600,
            padding: '8px 16px',
            transition: 'all 0.2s ease',
            ...(variant === 'contained'
                ? {
                    background: 'var(--primary)',
                    color: '#fff',
                    boxShadow: '0 4px 12px var(--primary-shadow)',
                    '&:hover': { 
                        background: 'var(--primary-hover)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 6px 16px var(--primary-shadow)',
                    },
                    '&:active': { transform: 'translateY(0)' },
                }
                : {
                    borderColor: 'var(--border)',
                    color: 'var(--text)',
                    '&:hover': {
                        borderColor: 'var(--primary)',
                        background: 'var(--primary-light)',
                        color: 'var(--primary)',
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

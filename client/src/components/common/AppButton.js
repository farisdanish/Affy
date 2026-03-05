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
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 600,
            padding: '8px 16px',
            transition: 'all 0.2s ease',
            ...(variant === 'contained'
                ? {
                    background: 'primary.main',
                    color: '#fff',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                    '&:hover': {
                        background: 'primary.dark',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 6px 16px rgba(99, 102, 241, 0.4)',
                    },
                    '&:active': { transform: 'translateY(0)' },
                }
                : {
                    borderColor: 'divider',
                    color: 'text.primary',
                    '&:hover': {
                        borderColor: 'primary.main',
                        background: 'primary.light',
                        color: 'primary.main',
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

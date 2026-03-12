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
}) => {
    const isContained = variant === 'contained';

    return (
        <Button
            variant={variant}
            startIcon={StartIcon && <StartIcon size={iconSize} />}
            endIcon={EndIcon && <EndIcon size={iconSize} />}
            sx={{
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                padding: '10px 18px',
                transition: 'all 0.2s ease',
                ...(isContained
                    ? {
                        background: 'var(--primary)',
                        color: 'var(--text-contrast)',
                        boxShadow: 'var(--shadow)',
                        border: '1px solid transparent',
                        '&:hover': {
                            background: 'var(--primary-hover)',
                            transform: 'translateY(-1px)',
                            boxShadow: 'var(--shadow)',
                        },
                        '&:active': { transform: 'translateY(0)' },
                    }
                    : {
                        borderColor: 'var(--border)',
                        color: 'var(--text)',
                        background: 'transparent',
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
};

export default AppButton;

import React from 'react';
import { Box, Typography } from '@mui/material';

const AppBadge = ({ 
    label, 
    color = 'primary', 
    variant = 'soft', 
    size = 'md',
    icon: Icon,
    sx = {} 
}) => {
    const getColorStyles = () => {
        const colors = {
            primary: {
                bg: 'primary.light',
                text: 'primary.main',
                border: 'rgba(249, 115, 22, 0.2)',
            },
            success: {
                bg: 'rgba(34, 197, 94, 0.12)',
                text: '#16a34a',
                border: 'rgba(34, 197, 94, 0.2)',
            },
            error: {
                bg: 'rgba(239, 68, 68, 0.12)',
                text: '#dc2626',
                border: 'rgba(239, 68, 68, 0.2)',
            },
            warning: {
                bg: 'rgba(234, 179, 8, 0.12)',
                text: '#ca8a04',
                border: 'rgba(234, 179, 8, 0.2)',
            },
            info: {
                bg: 'rgba(59, 130, 246, 0.12)',
                text: '#2563eb',
                border: 'rgba(59, 130, 246, 0.2)',
            },
            neutral: {
                bg: 'rgba(120, 113, 108, 0.12)',
                text: 'text.secondary',
                border: 'divider',
            }
        };

        return colors[color] || colors.primary;
    };

    const styles = getColorStyles();
    
    const sizePadding = {
        sm: '2px 8px',
        md: '4px 12px',
        lg: '6px 16px',
    }[size];

    const fontSize = {
        sm: '0.7rem',
        md: '0.75rem',
        lg: '0.875rem',
    }[size];

    const iconSize = {
        sm: 12,
        md: 14,
        lg: 16,
    }[size];

    return (
        <Box
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                padding: sizePadding,
                borderRadius: '9999px',
                background: variant === 'soft' ? styles.bg : 'transparent',
                border: variant === 'outlined' ? `1px solid ${styles.border}` : 'none',
                color: styles.text,
                fontWeight: 600,
                ...sx,
            }}
        >
            {Icon && <Icon size={iconSize} />}
            <Typography 
                component="span" 
                sx={{ 
                    fontSize: fontSize,
                    fontWeight: 'inherit',
                    lineHeight: 1,
                    fontFamily: 'inherit'
                }}
            >
                {label}
            </Typography>
        </Box>
    );
};

export default AppBadge;

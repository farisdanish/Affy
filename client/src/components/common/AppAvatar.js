import React from 'react';
import { Avatar } from '@mui/material';

const AppAvatar = ({ name, src, size = 40, sx = {}, ...props }) => {
    const getInitials = (n) => {
        if (!n) return '?';
        const parts = n.split(' ');
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[1][0]).toUpperCase();
    };

    return (
        <Avatar
            src={src}
            alt={name}
            sx={{
                width: size,
                height: size,
                fontSize: size * 0.4,
                fontWeight: 600,
                bgcolor: 'var(--primary-light)',
                color: 'var(--primary)',
                border: '1px solid var(--border)',
                ...sx,
            }}
            {...props}
        >
            {getInitials(name)}
        </Avatar>
    );
};

export default AppAvatar;

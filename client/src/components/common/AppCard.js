import React from 'react';
import { Card } from '@mui/material';

const AppCard = ({ children, sx = {}, ...props }) => (
    <Card
        sx={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            background: 'var(--bg-card)',
            boxShadow: 'var(--shadow)',
            ...sx,
        }}
        {...props}
    >
        {children}
    </Card>
);

export default AppCard;

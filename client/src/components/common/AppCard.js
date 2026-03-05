import React from 'react';
import { Card } from '@mui/material';

const AppCard = ({ children, sx = {}, ...props }) => (
    <Card
        sx={{
            border: '1px solid divider',
            borderRadius: '12px',
            background: 'background.paper',
            boxShadow: 'none',
            ...sx,
        }}
        {...props}
    >
        {children}
    </Card>
);

export default AppCard;

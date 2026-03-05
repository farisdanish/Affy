import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

export default function AdminStatCard({ title, value, trend, icon: Icon }) {
    return (
        <Card sx={{ minWidth: 240, transition: '0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

                {/* Soft colored background for the Lucide Icon */}
                <Box sx={{
                    backgroundColor: 'rgba(99, 102, 241, 0.1)', // Soft primary color
                    p: 1.5,
                    borderRadius: 2,
                    display: 'flex',
                    color: 'primary.main'
                }}>
                    {Icon && <Icon size={24} />}
                </Box>

                <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight="500">
                        {title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                        <Typography variant="h5" fontWeight="bold">
                            {value}
                        </Typography>
                        <Typography variant="body2" color="success.main" fontWeight="600">
                            {trend}
                        </Typography>
                    </Box>
                </Box>

            </CardContent>
        </Card>
    );
}

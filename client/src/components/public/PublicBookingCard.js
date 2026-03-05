import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { Clock, User } from 'lucide-react';

export default function PublicBookingCard({ slotName, merchantName, time }) {
    return (
        <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 3, maxWidth: 300 }}>
            <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {slotName}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: 'text.secondary' }}>
                    <User size={16} />
                    <Typography variant="body2">{merchantName}</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, color: 'text.secondary' }}>
                    <Clock size={16} />
                    <Typography variant="body2">{time}</Typography>
                </Box>

                <Button variant="contained" color="primary" fullWidth disableElevation>
                    Book This Slot
                </Button>
            </CardContent>
        </Card>
    );
}

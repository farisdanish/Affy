import React, { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import useBookings from '../../hooks/useBookings';
import { createBooking } from '../../services/bookingsService';
import { useAuth } from '../../context/AuthContext';

const BookSlotPage = () => {
    const { slotId } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { isAuthenticated } = useAuth();
    const { loading, error, refetch } = useBookings();
    const [success, setSuccess] = useState('');
    const [guestName, setGuestName] = useState('');
    const [guestEmail, setGuestEmail] = useState('');

    const refCode = useMemo(() => searchParams.get('ref') || '', [searchParams]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSuccess('');
        const payload = {
            slotId,
            ...(refCode ? { ref: refCode } : {}),
        };

        if (!isAuthenticated) {
            payload.guestName = guestName;
            payload.guestEmail = guestEmail;
        }

        const result = await refetch(() => createBooking(payload));
        if (result?.booking?._id) {
            setSuccess('Booking created. Status is pending.');
        }
    };

    return (
        <Card sx={{ maxWidth: 640, border: '1px solid var(--border)' }}>
            <CardContent>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>Book Slot</Typography>
                <Typography variant="body2" sx={{ mb: 2, color: 'var(--text-muted)' }}>
                    Slot ID: {slotId}
                </Typography>
                {refCode && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                        Referral captured: {refCode}
                    </Alert>
                )}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        {!isAuthenticated && (
                            <>
                                <TextField
                                    label="Guest Name"
                                    value={guestName}
                                    onChange={(e) => setGuestName(e.target.value)}
                                    required
                                />
                                <TextField
                                    label="Guest Email"
                                    type="email"
                                    value={guestEmail}
                                    onChange={(e) => setGuestEmail(e.target.value)}
                                    required
                                />
                            </>
                        )}
                        <Button type="submit" variant="contained" disabled={loading}>
                            {loading ? 'Submitting...' : 'Confirm Booking'}
                        </Button>
                        <Button variant="outlined" onClick={() => navigate('/slots')}>
                            Back to Slots
                        </Button>
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
};

export default BookSlotPage;

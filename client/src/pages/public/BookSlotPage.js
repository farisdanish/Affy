import React, { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Alert, Box, CardContent, Stack, Typography } from '@mui/material';
import useBookings from '../../hooks/useBookings';
import { createBooking } from '../../services/bookingsService';
import { useAuth } from '../../context/AuthContext';
import { AppButton, AppCard, AppInput } from '../../components/common';

const BookSlotPage = () => {
    const { slotId } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { isAuthenticated } = useAuth();
    const { loading, error, refetch } = useBookings();
    const [success, setSuccess] = useState('');
    const [guestName, setGuestName] = useState('');
    const [guestEmail, setGuestEmail] = useState('');
    const [honeypot, setHoneypot] = useState('');

    const refCode = useMemo(() => searchParams.get('ref') || '', [searchParams]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSuccess('');
        const payload = {
            slotId,
            _hp: honeypot,
        };

        if (!isAuthenticated) {
            payload.guestName = guestName;
            payload.guestEmail = guestEmail;
        }

        const result = await refetch(() => createBooking(payload, refCode));
        if (result?.booking?._id) {
            setSuccess('Booking created. Status is pending.');
        }
    };

    return (
        <AppCard sx={{ maxWidth: 640 }}>
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
                        <Box
                            sx={{
                                position: 'absolute',
                                left: '-9999px',
                                width: 1,
                                height: 1,
                                overflow: 'hidden',
                            }}
                            aria-hidden="true"
                        >
                            <AppInput
                                label="Website"
                                value={honeypot}
                                onChange={(e) => setHoneypot(e.target.value)}
                                tabIndex={-1}
                                autoComplete="off"
                            />
                        </Box>
                        {!isAuthenticated && (
                            <>
                                <AppInput
                                    label="Guest Name"
                                    value={guestName}
                                    onChange={(e) => setGuestName(e.target.value)}
                                    required
                                />
                                <AppInput
                                    label="Guest Email"
                                    type="email"
                                    value={guestEmail}
                                    onChange={(e) => setGuestEmail(e.target.value)}
                                    required
                                />
                            </>
                        )}
                        <AppButton type="submit" disabled={loading}>
                            {loading ? 'Submitting...' : 'Confirm Booking'}
                        </AppButton>
                        <AppButton variant="outlined" onClick={() => navigate('/slots')}>
                            Back to Slots
                        </AppButton>
                    </Stack>
                </Box>
            </CardContent>
        </AppCard>
    );
};

export default BookSlotPage;

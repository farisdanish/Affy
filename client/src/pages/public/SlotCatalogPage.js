import React from 'react';
import { Link } from 'react-router-dom';
import { Alert, CardContent, Chip, Stack, Typography } from '@mui/material';
import useSlots from '../../hooks/useSlots';
import { getPublicSlots } from '../../services/slotsService';
import { AppButton, AppCard, EmptyState, LoadingSpinner } from '../../components/common';

const SlotCatalogPage = () => {
    const { data: slots = [], loading, error } = useSlots(getPublicSlots, { auto: true, initialData: [] });

    return (
        <Stack spacing={2}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>Available Slots</Typography>
            {loading && <LoadingSpinner />}
            {error && <Alert severity="error">{error}</Alert>}
            {!loading && slots.length === 0 && (
                <EmptyState title="No active slots available" description="Check back soon for new offers." />
            )}

            {slots.map((slot) => (
                <AppCard key={slot._id}>
                    <CardContent>
                        <Typography variant="h6">{slot.title}</Typography>
                        <Typography variant="body2" sx={{ color: 'var(--text-muted)', mb: 1 }}>
                            {slot.description || 'No description'}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                            {slot.price !== undefined && <Chip label={`RM ${slot.price}`} size="small" />}
                            {slot.locationLabel && <Chip label={slot.locationLabel} size="small" variant="outlined" />}
                        </Stack>
                        <AppButton component={Link} to={`/book/${slot._id}`}>
                            Book Now
                        </AppButton>
                    </CardContent>
                </AppCard>
            ))}
        </Stack>
    );
};

export default SlotCatalogPage;

import React from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button, Card, CardContent, Chip, CircularProgress, Stack, Typography } from '@mui/material';
import useSlots from '../../hooks/useSlots';
import { getPublicSlots } from '../../services/slotsService';

const SlotCatalogPage = () => {
    const { data: slots = [], loading, error } = useSlots(getPublicSlots, { auto: true, initialData: [] });

    return (
        <Stack spacing={2}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>Available Slots</Typography>
            {loading && <CircularProgress />}
            {error && <Alert severity="error">{error}</Alert>}
            {!loading && slots.length === 0 && <Alert severity="info">No active slots available.</Alert>}

            {slots.map((slot) => (
                <Card key={slot._id} sx={{ border: '1px solid var(--border)' }}>
                    <CardContent>
                        <Typography variant="h6">{slot.title}</Typography>
                        <Typography variant="body2" sx={{ color: 'var(--text-muted)', mb: 1 }}>
                            {slot.description || 'No description'}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                            {slot.price !== undefined && <Chip label={`RM ${slot.price}`} size="small" />}
                            {slot.locationLabel && <Chip label={slot.locationLabel} size="small" variant="outlined" />}
                        </Stack>
                        <Button component={Link} to={`/book/${slot._id}`} variant="contained">
                            Book Now
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </Stack>
    );
};

export default SlotCatalogPage;

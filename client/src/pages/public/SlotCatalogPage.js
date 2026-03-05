import React from 'react';
import { Link } from 'react-router-dom';
import { Alert, CardContent, Chip, Stack, Typography, Box, Grid } from '@mui/material';
import useSlots from '../../hooks/useSlots';
import { getPublicSlots } from '../../services/slotsService';
import { AppButton, AppCard, EmptyState, LoadingSpinner } from '../../components/common';

const SlotCatalogPage = () => {
    const { data: slots = [], loading, error } = useSlots(getPublicSlots, { auto: true, initialData: [] });

    return (
        <Box>
            {/* Hero Section */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                    borderRadius: '24px',
                    color: '#fff',
                    p: { xs: 4, md: 6 },
                    mb: 5,
                    boxShadow: '0 10px 30px rgba(79, 70, 229, 0.15)'
                }}
            >
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.5px' }}>
                    Discover Available Slots
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600, fontWeight: 400 }}>
                    Find the perfect opportunity. Browse our curated catalog of slots and book directly to get started.
                </Typography>
            </Box>

            {loading && <LoadingSpinner />}
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {!loading && slots.length === 0 && (
                <EmptyState title="No active slots available" description="Check back soon for new offers." />
            )}

            {/* Catalog Grid */}
            <Grid container spacing={3}>
                {slots.map((slot) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={slot._id}>
                        <AppCard
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'transform 0.2s ease',
                                '&:hover': { transform: 'translateY(-4px)' }
                            }}
                        >
                            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>{slot.title}</Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, flexGrow: 1 }}>
                                    {slot.description || 'No description'}
                                </Typography>
                                <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                                    {slot.price !== undefined && <Chip label={`RM ${slot.price}`} size="small" color="primary" variant="outlined" sx={{ fontWeight: 600 }} />}
                                    {slot.locationLabel && <Chip label={slot.locationLabel} size="small" />}
                                </Stack>
                                <AppButton component={Link} to={`/book/${slot._id}`} fullWidth>
                                    View Details
                                </AppButton>
                            </CardContent>
                        </AppCard>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default SlotCatalogPage;

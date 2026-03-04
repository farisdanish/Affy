import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Box, CardContent, Chip, Stack, Typography } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import useSlots from '../../hooks/useSlots';
import { deactivateSlot, getMySlots } from '../../services/slotsService';
import { AppButton, AppCard, ConfirmDialog, EmptyState, LoadingSpinner } from '../../components/common';

const SlotListPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { data: slots = [], loading, error, refetch } = useSlots(getMySlots, { auto: true, initialData: [] });
    const [selectedSlotId, setSelectedSlotId] = React.useState(null);
    const [deactivating, setDeactivating] = React.useState(false);
    const isAdminScope = user?.role === 'admin' || user?.role === 'developer';

    const handleDeactivate = async () => {
        if (!selectedSlotId) return;
        setDeactivating(true);
        await deactivateSlot(selectedSlotId);
        setDeactivating(false);
        setSelectedSlotId(null);
        await refetch();
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {isAdminScope ? 'All Slots' : 'My Slots'}
                </Typography>
                <AppButton component={Link} to="/workspace/slots/new">New Slot</AppButton>
            </Box>

            {loading && <LoadingSpinner />}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {!loading && slots.length === 0 && (
                <EmptyState
                    title={isAdminScope ? 'No slots in the system yet' : 'No slots yet'}
                    description={isAdminScope
                        ? 'Create the first slot to start the affiliate loop.'
                        : 'Create your first slot to start receiving referrals and bookings.'}
                />
            )}

            <Stack spacing={2}>
                {slots.map((slot) => (
                    <AppCard key={slot._id}>
                        <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                            <Box>
                                <Typography variant="h6">{slot.title}</Typography>
                                <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>
                                    {slot.description || 'No description'}
                                </Typography>
                                <Box sx={{ mt: 1 }}>
                                    <Chip
                                        size="small"
                                        color={slot.isActive ? 'success' : 'default'}
                                        label={slot.isActive ? 'Active' : 'Inactive'}
                                    />
                                </Box>
                            </Box>
                            <Stack direction="row" spacing={1}>
                                <AppButton variant="outlined" onClick={() => navigate(`/workspace/slots/${slot._id}/edit`)}>
                                    Edit
                                </AppButton>
                                <AppButton
                                    variant="outlined"
                                    disabled={!slot.isActive}
                                    onClick={() => setSelectedSlotId(slot._id)}
                                >
                                    Deactivate
                                </AppButton>
                            </Stack>
                        </CardContent>
                    </AppCard>
                ))}
            </Stack>
            <ConfirmDialog
                open={Boolean(selectedSlotId)}
                title="Deactivate Slot?"
                description="This performs a soft delete by setting isActive=false."
                confirmText="Deactivate"
                loading={deactivating}
                onClose={() => setSelectedSlotId(null)}
                onConfirm={handleDeactivate}
            />
        </Box>
    );
};

export default SlotListPage;

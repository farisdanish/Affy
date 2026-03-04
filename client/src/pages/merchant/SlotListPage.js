import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Box, Stack, Typography, Grid } from '@mui/material';
import { 
    Calendar, 
    Plus, 
    Edit2, 
    Trash2, 
    Clock, 
    MapPin, 
    DollarSign,
    AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import useSlots from '../../hooks/useSlots';
import { deactivateSlot, getMySlots } from '../../services/slotsService';
import { 
    AppButton, 
    AppCard, 
    ConfirmDialog, 
    EmptyState, 
    LoadingSpinner,
    AppBadge 
} from '../../components/common';

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
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                    mb: 4,
                }}
            >
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--text)' }}>
                        {isAdminScope ? 'All Slots' : 'My Slots'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>
                        {isAdminScope 
                            ? 'Manage all booking slots across the platform.' 
                            : 'Create and manage your available booking slots.'}
                    </Typography>
                </Box>
                <AppButton 
                    component={Link} 
                    to="/workspace/slots/new"
                    startIcon={Plus}
                    sx={{ alignSelf: { xs: 'stretch', sm: 'auto' } }}
                >
                    New Slot
                </AppButton>
            </Box>

            {loading && <LoadingSpinner />}
            {error && (
                <Alert 
                    severity="error" 
                    icon={<AlertCircle size={20} />}
                    sx={{ mb: 3, borderRadius: 'var(--radius)' }}
                >
                    {error}
                </Alert>
            )}
            
            {!loading && slots.length === 0 && (
                <EmptyState
                    icon={Calendar}
                    title={isAdminScope ? 'No slots in the system yet' : 'No slots yet'}
                    description={isAdminScope
                        ? 'Create the first slot to start the affiliate loop.'
                        : 'Create your first slot to start receiving referrals and bookings.'}
                    actionLabel="Create Slot"
                    onAction={() => navigate('/workspace/slots/new')}
                />
            )}

            <Grid container spacing={3}>
                {slots.map((slot) => (
                    <Grid item xs={12} key={slot._id}>
                        <AppCard 
                            sx={{ 
                                p: 0,
                                overflow: 'hidden',
                                '&:hover': { borderColor: 'var(--primary)' }
                            }}
                        >
                            <Box sx={{ p: 3 }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} md={6}>
                                        <Stack spacing={1}>
                                            <Stack direction="row" spacing={1.5} alignItems="center">
                                                <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--text)' }}>
                                                    {slot.title}
                                                </Typography>
                                                <AppBadge 
                                                    label={slot.isActive ? 'Active' : 'Inactive'} 
                                                    color={slot.isActive ? 'success' : 'neutral'}
                                                    size="sm"
                                                />
                                            </Stack>
                                            <Typography variant="body2" sx={{ color: 'var(--text-muted)', mb: 1 }}>
                                                {slot.description || 'No description provided for this slot.'}
                                            </Typography>
                                            <Stack direction="row" spacing={2} sx={{ color: 'var(--text-muted)' }}>
                                                <Stack direction="row" spacing={0.5} alignItems="center">
                                                    <Clock size={14} />
                                                    <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
                                                        {slot.startTime ? new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                                                    </Typography>
                                                </Stack>
                                                <Stack direction="row" spacing={0.5} alignItems="center">
                                                    <MapPin size={14} />
                                                    <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
                                                        {slot.locationLabel || 'Remote'}
                                                    </Typography>
                                                </Stack>
                                                <Stack direction="row" spacing={0.5} alignItems="center">
                                                    <DollarSign size={14} />
                                                    <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
                                                        {slot.price || 0}
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Stack direction="row" spacing={1.5} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                                            <AppButton 
                                                variant="outlined" 
                                                size="small"
                                                startIcon={Edit2}
                                                onClick={() => navigate(`/workspace/slots/${slot._id}/edit`)}
                                            >
                                                Edit
                                            </AppButton>
                                            <AppButton
                                                variant="outlined"
                                                size="small"
                                                color="error"
                                                startIcon={Trash2}
                                                disabled={!slot.isActive}
                                                onClick={() => setSelectedSlotId(slot._id)}
                                                sx={{ 
                                                    '&:hover': { 
                                                        borderColor: '#dc2626', 
                                                        color: '#dc2626',
                                                        background: 'rgba(239, 68, 68, 0.05)'
                                                    } 
                                                }}
                                            >
                                                Deactivate
                                            </AppButton>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Box>
                        </AppCard>
                    </Grid>
                ))}
            </Grid>

            <ConfirmDialog
                open={Boolean(selectedSlotId)}
                title="Deactivate Slot?"
                description="This will hide the slot from the public catalog. You can reactivate it later by editing."
                confirmText="Deactivate"
                loading={deactivating}
                onClose={() => setSelectedSlotId(null)}
                onConfirm={handleDeactivate}
            />
        </Box>
    );
};

export default SlotListPage;

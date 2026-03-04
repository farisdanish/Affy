import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Card, CardContent, Chip, CircularProgress, Stack, Typography } from '@mui/material';
import useSlots from '../../hooks/useSlots';
import { deactivateSlot, getMySlots } from '../../services/slotsService';

const SlotListPage = () => {
    const navigate = useNavigate();
    const { data: slots = [], loading, error, refetch } = useSlots(getMySlots, { auto: true, initialData: [] });

    const handleDeactivate = async (slotId) => {
        await deactivateSlot(slotId);
        await refetch();
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>My Slots</Typography>
                <Button variant="contained" component={Link} to="/merchant/slots/new">New Slot</Button>
            </Box>

            {loading && <CircularProgress />}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {!loading && slots.length === 0 && (
                <Alert severity="info">No slots yet. Create your first slot.</Alert>
            )}

            <Stack spacing={2}>
                {slots.map((slot) => (
                    <Card key={slot._id} sx={{ border: '1px solid var(--border)' }}>
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
                                <Button variant="outlined" onClick={() => navigate(`/merchant/slots/${slot._id}/edit`)}>
                                    Edit
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    disabled={!slot.isActive}
                                    onClick={() => handleDeactivate(slot._id)}
                                >
                                    Deactivate
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                ))}
            </Stack>
        </Box>
    );
};

export default SlotListPage;

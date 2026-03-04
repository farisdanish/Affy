import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { createSlot, getMySlots, updateSlot } from '../../services/slotsService';

const emptyForm = {
    title: '',
    description: '',
    price: '',
    startTime: '',
    endTime: '',
    capacity: '',
    locationLabel: '',
};

const toInputDateTime = (dateLike) => {
    if (!dateLike) return '';
    const date = new Date(dateLike);
    if (Number.isNaN(date.getTime())) return '';
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

const SlotFormPage = () => {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const [form, setForm] = useState(emptyForm);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadSlot = async () => {
            if (!isEdit) return;
            try {
                const mySlots = await getMySlots();
                const slot = mySlots.find((item) => item._id === id);
                if (!slot) {
                    setError('Slot not found in your scope');
                    return;
                }
                setForm({
                    title: slot.title || '',
                    description: slot.description || '',
                    price: slot.price ?? '',
                    startTime: toInputDateTime(slot.startTime),
                    endTime: toInputDateTime(slot.endTime),
                    capacity: slot.capacity ?? '',
                    locationLabel: slot.locationLabel || '',
                });
            } catch (err) {
                setError(err?.response?.data?.message || err.message);
            }
        };
        loadSlot();
    }, [id, isEdit]);

    const payload = useMemo(() => ({
        ...form,
        price: form.price === '' ? undefined : Number(form.price),
        capacity: form.capacity === '' ? undefined : Number(form.capacity),
        startTime: form.startTime || undefined,
        endTime: form.endTime || undefined,
    }), [form]);

    const handleChange = (field) => (event) => {
        setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (isEdit) {
                await updateSlot(id, payload);
            } else {
                await createSlot(payload);
            }
            navigate('/merchant/slots');
        } catch (err) {
            setError(err?.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card sx={{ maxWidth: 760, border: '1px solid var(--border)' }}>
            <CardContent>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
                    {isEdit ? 'Edit Slot' : 'Create Slot'}
                </Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <TextField label="Title" value={form.title} onChange={handleChange('title')} required />
                        <TextField label="Description" value={form.description} onChange={handleChange('description')} multiline minRows={3} />
                        <TextField label="Price" type="number" value={form.price} onChange={handleChange('price')} />
                        <TextField label="Start Time" type="datetime-local" value={form.startTime} onChange={handleChange('startTime')} InputLabelProps={{ shrink: true }} />
                        <TextField label="End Time" type="datetime-local" value={form.endTime} onChange={handleChange('endTime')} InputLabelProps={{ shrink: true }} />
                        <TextField label="Capacity" type="number" value={form.capacity} onChange={handleChange('capacity')} />
                        <TextField label="Location Label" value={form.locationLabel} onChange={handleChange('locationLabel')} />
                        <Stack direction="row" spacing={1}>
                            <Button variant="contained" type="submit" disabled={loading}>
                                {loading ? 'Saving...' : 'Save Slot'}
                            </Button>
                            <Button variant="outlined" onClick={() => navigate('/merchant/slots')}>
                                Cancel
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
};

export default SlotFormPage;

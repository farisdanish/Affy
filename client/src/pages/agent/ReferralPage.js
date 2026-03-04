import React, { useMemo, useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Chip, CircularProgress, Stack, Typography } from '@mui/material';
import useReferrals from '../../hooks/useReferrals';
import useSlots from '../../hooks/useSlots';
import { getMyRefCode, generateReferralLink } from '../../services/referralsService';
import { getPublicSlots } from '../../services/slotsService';

const ReferralPage = () => {
    const { data: refData, loading: refLoading, error: refError, refetch: refetchCode } = useReferrals(getMyRefCode, { auto: true });
    const { data: slots = [], loading: slotsLoading, error: slotsError } = useSlots(getPublicSlots, { auto: true, initialData: [] });
    const [generatedLinks, setGeneratedLinks] = useState({});
    const [actionError, setActionError] = useState('');

    const refCode = useMemo(() => refData?.refCode || '-', [refData]);

    const handleGenerate = async (slotId) => {
        setActionError('');
        try {
            const result = await generateReferralLink(slotId);
            setGeneratedLinks((prev) => ({ ...prev, [slotId]: result.shareUrl }));
            if (!refData?.refCode) {
                await refetchCode();
            }
        } catch (err) {
            setActionError(err?.response?.data?.message || err.message);
        }
    };

    const handleCopy = async (url) => {
        await navigator.clipboard.writeText(url);
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>Referral Links</Typography>
            <Card sx={{ mb: 3, border: '1px solid var(--border)' }}>
                <CardContent>
                    <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>Your referral code</Typography>
                    {refLoading ? <CircularProgress size={20} /> : <Chip label={refCode} color="primary" sx={{ mt: 1 }} />}
                    {refError && <Alert severity="error" sx={{ mt: 2 }}>{refError}</Alert>}
                </CardContent>
            </Card>

            {actionError && <Alert severity="error" sx={{ mb: 2 }}>{actionError}</Alert>}
            {slotsLoading && <CircularProgress />}
            {slotsError && <Alert severity="error">{slotsError}</Alert>}

            <Stack spacing={2}>
                {slots.map((slot) => {
                    const link = generatedLinks[slot._id];
                    return (
                        <Card key={slot._id} sx={{ border: '1px solid var(--border)' }}>
                            <CardContent>
                                <Typography variant="h6">{slot.title}</Typography>
                                <Typography variant="body2" sx={{ mb: 1, color: 'var(--text-muted)' }}>
                                    {slot.description || 'No description'}
                                </Typography>
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                                    <Button variant="contained" onClick={() => handleGenerate(slot._id)}>
                                        Generate Link
                                    </Button>
                                    {link && (
                                        <>
                                            <Button variant="outlined" onClick={() => handleCopy(link)}>Copy Link</Button>
                                            <Typography variant="body2" sx={{ alignSelf: 'center', wordBreak: 'break-all' }}>
                                                {link}
                                            </Typography>
                                        </>
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>
                    );
                })}
            </Stack>
        </Box>
    );
};

export default ReferralPage;

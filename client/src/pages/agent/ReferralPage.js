import React, { useMemo, useState } from 'react';
import { Alert, Box, CardContent, Chip, Stack, Typography } from '@mui/material';
import useReferrals from '../../hooks/useReferrals';
import useSlots from '../../hooks/useSlots';
import { getMyRefCode, generateReferralLink } from '../../services/referralsService';
import { getPublicSlots } from '../../services/slotsService';
import { AppButton, AppCard, LoadingSpinner } from '../../components/common';

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
            <AppCard sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>Your referral code</Typography>
                    {refLoading ? <LoadingSpinner /> : <Chip label={refCode} color="primary" sx={{ mt: 1 }} />}
                    {refError && <Alert severity="error" sx={{ mt: 2 }}>{refError}</Alert>}
                </CardContent>
            </AppCard>

            {actionError && <Alert severity="error" sx={{ mb: 2 }}>{actionError}</Alert>}
            {slotsLoading && <LoadingSpinner />}
            {slotsError && <Alert severity="error">{slotsError}</Alert>}

            <Stack spacing={2}>
                {slots.map((slot) => {
                    const link = generatedLinks[slot._id];
                    return (
                        <AppCard key={slot._id}>
                            <CardContent>
                                <Typography variant="h6">{slot.title}</Typography>
                                <Typography variant="body2" sx={{ mb: 1, color: 'var(--text-muted)' }}>
                                    {slot.description || 'No description'}
                                </Typography>
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                                    <AppButton onClick={() => handleGenerate(slot._id)}>
                                        Generate Link
                                    </AppButton>
                                    {link && (
                                        <>
                                            <AppButton variant="outlined" onClick={() => handleCopy(link)}>Copy Link</AppButton>
                                            <Typography variant="body2" sx={{ alignSelf: 'center', wordBreak: 'break-all' }}>
                                                {link}
                                            </Typography>
                                        </>
                                    )}
                                </Stack>
                            </CardContent>
                        </AppCard>
                    );
                })}
            </Stack>
        </Box>
    );
};

export default ReferralPage;

import React, { useMemo, useState } from 'react';
import { Alert, Box, Stack, Typography, Grid, Tooltip, IconButton } from '@mui/material';
import {
    Copy,
    ExternalLink,
    CheckCircle,
    AlertCircle,
    Share2,
    Calendar,
    Code
} from 'lucide-react';
import useReferrals from '../../hooks/useReferrals';
import useSlots from '../../hooks/useSlots';
import { getMyRefCode, generateReferralLink } from '../../services/referralsService';
import { getPublicSlots } from '../../services/slotsService';
import {
    AppButton,
    AppCard,
    LoadingSpinner,
    EmptyState
} from '../../components/common';

const ReferralPage = () => {
    const { data: refData, loading: refLoading, refetch: refetchCode } = useReferrals(getMyRefCode, { auto: true });
    const { data: slots = [], loading: slotsLoading, error: slotsError } = useSlots(getPublicSlots, { auto: true, initialData: [] });
    const [generatedLinks, setGeneratedLinks] = useState({});
    const [actionError, setActionError] = useState('');
    const [copiedId, setCopiedId] = useState(null);

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

    const handleCopy = async (url, id) => {
        await navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    Referral Dashboard
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Generate and manage your referral links to earn commissions.
                </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <AppCard
                        sx={{
                            height: '100%',
                            background: 'linear-gradient(135deg, background.paper 0%, primary.light 100%)',
                            border: '1px solid primary.light'
                        }}
                    >
                        <Stack spacing={2} sx={{ p: 1 }}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Box sx={{ p: 1, borderRadius: '10px', background: 'primary.main', color: '#fff' }}>
                                    <Code size={20} />
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>Your Unique Code</Typography>
                            </Stack>
                            <Box sx={{ py: 1 }}>
                                {refLoading ? (
                                    <LoadingSpinner />
                                ) : (
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: '1px' }}>
                                            {refCode}
                                        </Typography>
                                        <Tooltip title="Copy referral code">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleCopy(refCode, 'refcode')}
                                                sx={{ color: 'primary.main' }}
                                            >
                                                {copiedId === 'refcode' ? <CheckCircle size={18} /> : <Copy size={18} />}
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                )}
                            </Box>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                This code is automatically appended to your generated links.
                            </Typography>
                        </Stack>
                    </AppCard>
                </Grid>

                <Grid size={{ xs: 12, md: 8 }}>
                    <AppCard sx={{ height: '100%', p: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Performance Summary</Typography>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 6, sm: 3 }}>
                                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Total Clicks</Typography>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>1,240</Typography>
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3 }}>
                                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Conversions</Typography>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>42</Typography>
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3 }}>
                                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Conv. Rate</Typography>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#16a34a' }}>3.4%</Typography>
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3 }}>
                                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Earned</Typography>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>$420.00</Typography>
                            </Grid>
                        </Grid>
                    </AppCard>
                </Grid>
            </Grid>

            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Available Slots for Promotion</Typography>

            {actionError && (
                <Alert severity="error" icon={<AlertCircle size={20} />} sx={{ mb: 2, borderRadius: '12px' }}>
                    {actionError}
                </Alert>
            )}

            {slotsLoading && <LoadingSpinner />}
            {slotsError && <Alert severity="error" sx={{ mb: 2 }}>{slotsError}</Alert>}

            {!slotsLoading && slots.length === 0 && (
                <EmptyState
                    icon={Calendar}
                    title="No slots available"
                    description="There are currently no active slots to promote. Check back later."
                />
            )}

            <Stack spacing={2}>
                {slots.map((slot) => {
                    const link = generatedLinks[slot._id];
                    return (
                        <AppCard
                            key={slot._id}
                            sx={{
                                p: 3,
                                '&:hover': { borderColor: 'primary.light' }
                            }}
                        >
                            <Grid container spacing={3} alignItems="center">
                                <Grid size={{ xs: 12, md: 5 }}>
                                    <Stack spacing={0.5}>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>{slot.title}</Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', lineClamp: 1 }}>
                                            {slot.description || 'Join this exciting slot and book your spot today.'}
                                        </Typography>
                                    </Stack>
                                </Grid>
                                <Grid size={{ xs: 12, md: 7 }}>
                                    <Stack
                                        direction={{ xs: 'column', sm: 'row' }}
                                        spacing={2}
                                        alignItems={{ xs: 'stretch', sm: 'center' }}
                                        justifyContent="flex-end"
                                    >
                                        {!link ? (
                                            <AppButton
                                                variant="contained"
                                                size="small"
                                                startIcon={Share2}
                                                onClick={() => handleGenerate(slot._id)}
                                            >
                                                Generate Link
                                            </AppButton>
                                        ) : (
                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                sx={{
                                                    background: 'background.default',
                                                    p: 0.75,
                                                    borderRadius: '10px',
                                                    border: '1px solid divider',
                                                    width: '100%',
                                                    maxWidth: { sm: 400 }
                                                }}
                                            >
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        flex: 1,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        color: 'text.secondary',
                                                        alignSelf: 'center',
                                                        pl: 1
                                                    }}
                                                >
                                                    {link}
                                                </Typography>
                                                <Tooltip title={copiedId === slot._id ? 'Copied!' : 'Copy to clipboard'}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleCopy(link, slot._id)}
                                                        sx={{ color: copiedId === slot._id ? '#16a34a' : 'primary.main' }}
                                                    >
                                                        {copiedId === slot._id ? <CheckCircle size={18} /> : <Copy size={18} />}
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        )}
                                        <AppButton
                                            variant="outlined"
                                            size="small"
                                            startIcon={ExternalLink}
                                            onClick={() => window.open(`/book/${slot._id}`, '_blank')}
                                        >
                                            Preview
                                        </AppButton>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </AppCard>
                    );
                })}
            </Stack>
        </Box>
    );
};

export default ReferralPage;

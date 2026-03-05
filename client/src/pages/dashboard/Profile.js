import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile } from '../../services/profileService';
import { checkAvailability } from '../../services/authService';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
    Stack,
    Divider,
    Container,
    IconButton
} from '@mui/material';
import { Save, User as UserIcon, ArrowLeft } from 'lucide-react';

const Profile = () => {
    const { user, refreshUser } = useAuth();
    const navigate = useNavigate();

    // Account details form state
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    // Availability state
    const [usernameStatus, setUsernameStatus] = useState({ available: null, checking: false });
    const [emailStatus, setEmailStatus] = useState({ available: null, checking: false });

    // Merchant form state
    const [place, setPlace] = useState('');
    const [contactInfo, setContactInfo] = useState('');

    // User/Agent form state (Payout)
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState('');



    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getProfile();
                setName(data.name || '');
                setUsername(data.username || '');
                setEmail(data.email || '');
                if (data.merchantProfile) {
                    setPlace(data.merchantProfile.place || '');
                    setContactInfo(data.merchantProfile.contactInfo || '');
                }
                if (data.payoutConfig) {
                    setBankName(data.payoutConfig.bankName || '');
                    setAccountNumber(data.payoutConfig.accountNumber || '');
                }
            } catch (err) {
                setError('Failed to load profile.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    // Debounced username availability check
    useEffect(() => {
        if (!username || username === user?.username) {
            setUsernameStatus({ available: null, checking: false });
            return;
        }

        const timer = setTimeout(async () => {
            // Only show checking state if it takes longer than 300ms
            const checkTimer = setTimeout(() => {
                setUsernameStatus(prev => ({ ...prev, checking: true }));
            }, 300);

            try {
                const available = await checkAvailability('username', username, user?.id);
                clearTimeout(checkTimer);
                setUsernameStatus({ available, checking: false });
            } catch (err) {
                clearTimeout(checkTimer);
                setUsernameStatus({ available: null, checking: false });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [username, user?.username, user?.id]);

    // Debounced email availability check
    useEffect(() => {
        if (!email || email === user?.email) {
            setEmailStatus({ available: null, checking: false });
            return;
        }

        const timer = setTimeout(async () => {
            const checkTimer = setTimeout(() => {
                setEmailStatus(prev => ({ ...prev, checking: true }));
            }, 300);

            try {
                const available = await checkAvailability('email', email, user?.id);
                clearTimeout(checkTimer);
                setEmailStatus({ available, checking: false });
            } catch (err) {
                clearTimeout(checkTimer);
                setEmailStatus({ available: null, checking: false });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [email, user?.email, user?.id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSaving(true);

        const isMerchantType = user?.role === 'merchant' || user?.role === 'developer';
        const isUserType = ['agent', 'user'].includes(user?.role);

        const payload = { name, username, email };
        if (isMerchantType) payload.merchantProfile = { place, contactInfo };
        if (isUserType) payload.payoutConfig = { bankName, accountNumber };

        try {
            const updatedUser = await updateProfile(payload);
            setSuccess('Profile updated successfully!');
            refreshUser({
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                username: updatedUser.username
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    const showMerchantForm = user?.role === 'merchant' || user?.role === 'developer';
    const showPayoutForm = ['agent', 'user'].includes(user?.role);

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton
                    onClick={() => navigate(-1)}
                    sx={{
                        mr: 1,
                        bgcolor: 'background.paper',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        '&:hover': { bgcolor: 'action.hover' }
                    }}
                >
                    <ArrowLeft size={20} />
                </IconButton>
                <Box
                    sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        background: 'primary.light',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'primary.main',
                    }}
                >
                    <UserIcon size={24} />
                </Box>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>Profile Settings</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage your account information and preferences
                    </Typography>
                </Box>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

            <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', mb: 4 }}>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                    <Box component="form" onSubmit={handleSubmit}>

                        {/* Display Username Details (Readonly) */}
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Account Details</Typography>
                        <Stack spacing={3} sx={{ mb: 4 }}>
                            <TextField
                                label="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder={username || 'Not set'}
                                fullWidth
                                helperText={
                                    usernameStatus.checking ? 'Checking availability...' :
                                        usernameStatus.available === true ? 'Username is available' :
                                            usernameStatus.available === false ? 'Username is already taken' : ''
                                }
                                error={usernameStatus.available === false}
                                FormHelperTextProps={{
                                    sx: { color: usernameStatus.available === true ? 'success.main' : '' }
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />
                            <TextField
                                label="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                fullWidth
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />
                            <TextField
                                label="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                fullWidth
                                helperText={
                                    emailStatus.checking ? 'Checking availability...' :
                                        emailStatus.available === true ? 'Email is available' :
                                            emailStatus.available === false ? 'Email is already taken' : ''
                                }
                                error={emailStatus.available === false}
                                FormHelperTextProps={{
                                    sx: { color: emailStatus.available === true ? 'success.main' : '' }
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />
                        </Stack>

                        {showMerchantForm && (
                            <>
                                <Divider sx={{ my: 4 }} />
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Merchant Profile</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    Provide your location and contact info to help users find your business.
                                </Typography>
                                <Stack spacing={3}>
                                    <TextField
                                        label="Business Location (Place)"
                                        value={place}
                                        onChange={(e) => setPlace(e.target.value)}
                                        fullWidth
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                    />
                                    <TextField
                                        label="Contact Information"
                                        value={contactInfo}
                                        onChange={(e) => setContactInfo(e.target.value)}
                                        fullWidth
                                        multiline
                                        rows={3}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                    />
                                </Stack>
                            </>
                        )}

                        {showPayoutForm && (
                            <>
                                <Divider sx={{ my: 4 }} />
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Payout Configuration</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    Fill out this information to receive commissions from your affiliate links.
                                </Typography>
                                <Stack spacing={3}>
                                    <TextField
                                        label="Bank Name"
                                        value={bankName}
                                        onChange={(e) => setBankName(e.target.value)}
                                        fullWidth
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                    />
                                    <TextField
                                        label="Account Number"
                                        value={accountNumber}
                                        onChange={(e) => setAccountNumber(e.target.value)}
                                        fullWidth
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                    />
                                </Stack>
                            </>
                        )}

                        <Box sx={{ mt: 5, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={saving}
                                startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Save size={20} />}
                                sx={{
                                    py: 1.5,
                                    px: 4,
                                    borderRadius: '12px',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                }}
                            >
                                {saving ? 'Saving...' : 'Save Profile'}
                            </Button>
                        </Box>

                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default Profile;

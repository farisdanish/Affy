import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../services/authService';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
    MenuItem,
    ThemeProvider,
    CssBaseline,
} from '@mui/material';
import { UserPlus } from 'lucide-react';
import { REGISTRABLE_ROLES } from '../../config/roles';
import { publicTheme } from '../../theme';

const inputSx = {
    mb: 2,
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        color: 'text.primary',
        '& fieldset': { borderColor: 'divider' },
        '&:hover fieldset': { borderColor: 'primary.main' },
        '&.Mui-focused fieldset': { borderColor: 'primary.main' },
    },
    '& .MuiInputLabel-root': { color: 'text.secondary' },
    '& .MuiInputLabel-root.Mui-focused': { color: 'primary.main' },
    '& .MuiSvgIcon-root': { color: 'text.secondary' },
};

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await register(name, email, password, role);
            navigate('/login', { state: { registered: true } });
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={publicTheme}>
            <CssBaseline />
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
                    padding: 3,
                }}
            >
                <Card
                    sx={{
                        maxWidth: 420,
                        width: '100%',
                        background: 'background.paper',
                        border: '1px solid divider',
                        borderRadius: '12px',
                        boxShadow: 'none',
                        transition: 'background 0.3s ease, box-shadow 0.3s ease',
                    }}
                >
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Box
                                sx={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: '50%',
                                    background: 'primary.light',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mx: 'auto',
                                    mb: 2,
                                }}
                            >
                                <UserPlus size={28} style={{ color: 'primary.main' }} />
                            </Box>
                            <Typography
                                variant="h5"
                                sx={{ fontWeight: 700, color: 'text.primary', fontFamily: 'Inter, sans-serif' }}
                            >
                                Create an Account
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: 'text.secondary', mt: 0.5 }}
                            >
                                Join Affy to get started
                            </Typography>
                        </Box>

                        {error && (
                            <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>
                                {error}
                            </Alert>
                        )}

                        <Box component="form" onSubmit={handleSubmit}>
                            <TextField
                                id="register-name"
                                label="Full Name"
                                fullWidth
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                sx={inputSx}
                            />
                            <TextField
                                id="register-email"
                                label="Email"
                                type="email"
                                fullWidth
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                sx={inputSx}
                            />
                            <TextField
                                id="register-password"
                                label="Password"
                                type="password"
                                fullWidth
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                sx={inputSx}
                            />
                            <TextField
                                id="register-role"
                                label="I am a..."
                                select
                                fullWidth
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                sx={{ ...inputSx, mb: 3 }}
                            >
                                {REGISTRABLE_ROLES.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <Button
                                id="register-submit"
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                                sx={{
                                    py: 1.5,
                                    borderRadius: '12px',
                                    background: 'primary.main',
                                    fontWeight: 600,
                                    fontFamily: 'Inter, sans-serif',
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    '&:hover': { background: 'primary.dark' },
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
                            </Button>
                        </Box>

                        <Typography
                            variant="body2"
                            sx={{ textAlign: 'center', mt: 3, color: 'text.secondary' }}
                        >
                            Already have an account?{' '}
                            <Link to="/login" style={{ color: 'primary.main', fontWeight: 500 }}>
                                Sign in
                            </Link>
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        </ThemeProvider>
    );
};

export default Register;

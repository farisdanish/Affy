import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
    ThemeProvider,
    CssBaseline,
} from '@mui/material';
import { Lock } from 'lucide-react';
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
};

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
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
                                <Lock size={28} style={{ color: 'primary.main' }} />
                            </Box>
                            <Typography
                                variant="h5"
                                sx={{ fontWeight: 700, color: 'text.primary', fontFamily: 'Inter, sans-serif' }}
                            >
                                Welcome to Affy
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: 'text.secondary', mt: 0.5 }}
                            >
                                Sign in to continue
                            </Typography>
                        </Box>

                        {error && (
                            <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>
                                {error}
                            </Alert>
                        )}

                        <Box component="form" onSubmit={handleSubmit}>
                            <TextField
                                id="login-email"
                                label="Email"
                                type="email"
                                fullWidth
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                sx={inputSx}
                            />
                            <TextField
                                id="login-password"
                                label="Password"
                                type="password"
                                fullWidth
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                sx={{ ...inputSx, mb: 3 }}
                            />
                            <Button
                                id="login-submit"
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
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                            </Button>
                        </Box>

                        <Typography
                            variant="body2"
                            sx={{ textAlign: 'center', mt: 3, color: 'text.secondary' }}
                        >
                            Don't have an account?{' '}
                            <Link to="/register" style={{ color: 'primary.main', fontWeight: 500 }}>
                                Create one
                            </Link>
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        </ThemeProvider>
    );
};

export default Login;

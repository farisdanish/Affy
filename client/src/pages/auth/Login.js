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
} from '@mui/material';
import { Lock } from 'lucide-react';

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
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg)',
                padding: 3,
            }}
        >
            <Card
                sx={{
                    maxWidth: 420,
                    width: '100%',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    boxShadow: '0 4px 24px rgba(99, 102, 241, 0.1)',
                }}
            >
                <CardContent sx={{ p: 4 }}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Box
                            sx={{
                                width: 56,
                                height: 56,
                                borderRadius: '50%',
                                background: 'rgba(99, 102, 241, 0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 2,
                            }}
                        >
                            <Lock size={28} color="#6366f1" />
                        </Box>
                        <Typography
                            variant="h5"
                            sx={{ fontWeight: 700, color: 'var(--text)', fontFamily: 'Inter, sans-serif' }}
                        >
                            Welcome to Affy
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ color: 'var(--text-muted)', mt: 0.5 }}
                        >
                            Sign in to continue
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2, borderRadius: 'var(--radius)' }}>
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
                            sx={{
                                mb: 2,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 'var(--radius)',
                                    color: 'var(--text)',
                                    '& fieldset': { borderColor: 'var(--border)' },
                                    '&:hover fieldset': { borderColor: 'var(--primary)' },
                                    '&.Mui-focused fieldset': { borderColor: 'var(--primary)' },
                                },
                                '& .MuiInputLabel-root': { color: 'var(--text-muted)' },
                                '& .MuiInputLabel-root.Mui-focused': { color: 'var(--primary)' },
                            }}
                        />
                        <TextField
                            id="login-password"
                            label="Password"
                            type="password"
                            fullWidth
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{
                                mb: 3,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 'var(--radius)',
                                    color: 'var(--text)',
                                    '& fieldset': { borderColor: 'var(--border)' },
                                    '&:hover fieldset': { borderColor: 'var(--primary)' },
                                    '&.Mui-focused fieldset': { borderColor: 'var(--primary)' },
                                },
                                '& .MuiInputLabel-root': { color: 'var(--text-muted)' },
                                '& .MuiInputLabel-root.Mui-focused': { color: 'var(--primary)' },
                            }}
                        />
                        <Button
                            id="login-submit"
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{
                                py: 1.5,
                                borderRadius: 'var(--radius)',
                                background: 'var(--primary)',
                                fontWeight: 600,
                                fontFamily: 'Inter, sans-serif',
                                textTransform: 'none',
                                fontSize: '1rem',
                                '&:hover': { background: 'var(--primary-hover)' },
                            }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                        </Button>
                    </Box>

                    <Typography
                        variant="body2"
                        sx={{ textAlign: 'center', mt: 3, color: 'var(--text-muted)' }}
                    >
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 500 }}>
                            Create one
                        </Link>
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Login;

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Button, Stack, Toolbar, Typography, Menu, MenuItem, IconButton } from '@mui/material';
import { Menu as MenuIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * Shared navbar component used by all layouts.
 * Nav items are derived from the user's role automatically.
 */
const AppNavbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const role = user?.role;

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // ── Derive title from role ──
    const title = (() => {
        switch (role) {
            case 'admin': return 'Admin';
            case 'developer': return 'Developer';
            case 'merchant': return 'Merchant';
            case 'agent': return 'Agent';
            default: return 'Affy';
        }
    })();

    // ── Derive nav items from role ──
    const navItems = (() => {
        if (!isAuthenticated) {
            return [
                { label: 'Slots', to: '/slots' },
                { label: 'Login', to: '/login' },
            ];
        }

        const items = [{ label: 'Dashboard', to: '/dashboard' }];

        // Merchant workspace items
        if (['merchant', 'admin', 'developer'].includes(role)) {
            items.push({
                label: role === 'admin' || role === 'developer' ? 'All Slots' : 'My Slots',
                to: '/workspace/slots',
            });
            items.push({ label: 'Create Slot', to: '/workspace/slots/new' });
        }

        // Agent-specific items
        if (role === 'agent') {
            items.push({ label: 'Referrals', to: '/agent/referrals' });
        }

        // Common items for all authenticated users
        items.push({ label: 'Slots', to: '/slots' });
        items.push({ label: 'Profile', to: '/profile' });
        items.push({ label: 'Logout', onClick: handleLogout });

        return items;
    })();

    return (
        <AppBar
            position="static"
            color="transparent"
            elevation={0}
            sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}
        >
            <Toolbar sx={{ px: { xs: 2, md: 3 }, py: { xs: 1, md: 0.5 } }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
                    <Typography
                        component={Link}
                        to="/"
                        variant="h6"
                        sx={{ fontWeight: 700, color: 'inherit', textDecoration: 'none' }}
                    >
                        {title}
                    </Typography>

                    {/* ── Desktop nav ── */}
                    <Stack
                        direction="row"
                        spacing={0.5}
                        alignItems="center"
                        sx={{ display: { xs: 'none', md: 'flex' } }}
                    >
                        {navItems.map((item) =>
                            item.to ? (
                                <Button
                                    key={item.label}
                                    component={Link}
                                    to={item.to}
                                    color="inherit"
                                    sx={{ whiteSpace: 'nowrap' }}
                                >
                                    {item.label}
                                </Button>
                            ) : (
                                <Button
                                    key={item.label}
                                    onClick={item.onClick}
                                    color="inherit"
                                    sx={{ whiteSpace: 'nowrap' }}
                                >
                                    {item.label}
                                </Button>
                            )
                        )}
                    </Stack>

                    {/* ── Burger icon (mobile) ── */}
                    <IconButton
                        color="inherit"
                        onClick={handleMenuClick}
                        sx={{ display: { xs: 'flex', md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* ── Burger menu ── */}
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleMenuClose}
                        PaperProps={{ sx: { width: 220 } }}
                    >
                        {navItems.map((item) =>
                            item.to ? (
                                <MenuItem
                                    key={item.label}
                                    component={Link}
                                    to={item.to}
                                    onClick={handleMenuClose}
                                >
                                    {item.label}
                                </MenuItem>
                            ) : (
                                <MenuItem
                                    key={item.label}
                                    onClick={() => { handleMenuClose(); item.onClick?.(); }}
                                >
                                    {item.label}
                                </MenuItem>
                            )
                        )}
                    </Menu>
                </Stack>
            </Toolbar>
        </AppBar>
    );
};

export default AppNavbar;

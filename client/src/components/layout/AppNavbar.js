import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Button, Stack, Toolbar, Typography, Menu, MenuItem, IconButton } from '@mui/material';
import { Menu as MenuIcon } from 'lucide-react';

/**
 * Shared navbar component used by all layouts.
 *
 * @param {string}  title    – Text shown on the left (e.g. "Admin", "Agent", "Affy")
 * @param {Array}   navItems – Array of { label, to?, onClick? }
 *                              Provide `to` for links, `onClick` for actions (e.g. Logout).
 */
const AppNavbar = ({ title, navItems = [] }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar
            position="static"
            color="transparent"
            elevation={0}
            sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}
        >
            <Toolbar sx={{ px: { xs: 2, md: 3 }, py: { xs: 1, md: 0.5 } }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
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

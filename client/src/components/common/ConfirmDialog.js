import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import AppButton from './AppButton';

const ConfirmDialog = ({
    open,
    title = 'Confirm action',
    description = 'Are you sure you want to continue?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onClose,
    loading = false,
}) => (
    <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{
            sx: {
                borderRadius: '12px',
                border: '1px solid divider',
                background: 'background.paper',
                color: 'text.primary',
            },
        }}
    >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {description}
            </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
            <AppButton variant="outlined" onClick={onClose} disabled={loading}>
                {cancelText}
            </AppButton>
            <AppButton onClick={onConfirm} disabled={loading}>
                {loading ? 'Processing...' : confirmText}
            </AppButton>
        </DialogActions>
    </Dialog>
);

export default ConfirmDialog;

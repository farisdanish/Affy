import React from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/dashboard/Dashboard';
import Unauthorized from '../pages/common/Unauthorized';
import MerchantLayout from '../components/layout/MerchantLayout';
import AgentLayout from '../components/layout/AgentLayout';
import PublicLayout from '../components/layout/PublicLayout';
import SlotListPage from '../pages/merchant/SlotListPage';
import SlotFormPage from '../pages/merchant/SlotFormPage';
import ReferralPage from '../pages/agent/ReferralPage';
import SlotCatalogPage from '../pages/public/SlotCatalogPage';
import BookSlotPage from '../pages/public/BookSlotPage';

// Redirect root path based on auth state
const RootRedirect = () => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return null;
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

const MerchantEditRedirect = () => {
    const { id } = useParams();
    return <Navigate to={`/workspace/slots/${id}/edit`} replace />;
};

const AppRoutes = () => (
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route element={<PublicLayout />}>
            <Route path="/slots" element={<SlotCatalogPage />} />
            <Route path="/book/:slotId" element={<BookSlotPage />} />
        </Route>

        <Route
            path="/dashboard"
            element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            }
        />

        <Route
            path="/workspace"
            element={
                <ProtectedRoute allowedRoles={['merchant', 'admin', 'developer']}>
                    <MerchantLayout />
                </ProtectedRoute>
            }
        >
            <Route path="slots" element={<SlotListPage />} />
            <Route path="slots/new" element={<SlotFormPage />} />
            <Route path="slots/:id/edit" element={<SlotFormPage />} />
        </Route>

        {/* Legacy compatibility redirects */}
        <Route path="/merchant" element={<Navigate to="/workspace/slots" replace />} />
        <Route path="/merchant/slots" element={<Navigate to="/workspace/slots" replace />} />
        <Route path="/merchant/slots/new" element={<Navigate to="/workspace/slots/new" replace />} />
        <Route path="/merchant/slots/:id/edit" element={<MerchantEditRedirect />} />

        <Route
            path="/agent"
            element={
                <ProtectedRoute allowedRoles={['agent']}>
                    <AgentLayout />
                </ProtectedRoute>
            }
        >
            <Route path="referrals" element={<ReferralPage />} />
        </Route>

        <Route path="/" element={<RootRedirect />} />
        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
);

export default AppRoutes;

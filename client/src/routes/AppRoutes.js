import React from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/dashboard/Dashboard';
import Unauthorized from '../pages/common/Unauthorized';
import LandingPage from '../pages/public/LandingPage';
import MerchantLayout from '../components/layout/MerchantLayout';
import AgentLayout from '../components/layout/AgentLayout';
import PublicLayout from '../components/layout/PublicLayout';
import DashboardLayout from '../components/layout/DashboardLayout';
import Profile from '../pages/dashboard/Profile';
import SlotListPage from '../pages/merchant/SlotListPage';
import SlotFormPage from '../pages/merchant/SlotFormPage';
import ReferralPage from '../pages/agent/ReferralPage';
import SlotCatalogPage from '../pages/public/SlotCatalogPage';
import BookSlotPage from '../pages/public/BookSlotPage';

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
            <Route index element={<LandingPage />} />
            <Route path="/slots" element={<SlotCatalogPage />} />
            <Route path="/book/:slotId" element={<BookSlotPage />} />
        </Route>

        <Route
            element={
                <ProtectedRoute>
                    <DashboardLayout />
                </ProtectedRoute>
            }
        >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
        </Route>

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

        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
);

export default AppRoutes;

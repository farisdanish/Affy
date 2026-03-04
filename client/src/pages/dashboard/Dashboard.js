import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();
    const role = user?.role;

    if (role === 'merchant' || role === 'admin' || role === 'developer') {
        return <Navigate to="/merchant/slots" replace />;
    }
    if (role === 'agent') {
        return <Navigate to="/agent/referrals" replace />;
    }
    return <Navigate to="/slots" replace />;
};

export default Dashboard;

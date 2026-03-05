import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as loginApi, fetchCurrentUser, logout as logoutApi } from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // H5: Rehydrate auth state from httpOnly cookie session on mount
    useEffect(() => {
        let cancelled = false;
        const checkSession = async () => {
            try {
                const data = await fetchCurrentUser();
                if (!cancelled) setUser(data.user);
            } catch (_) {
                // No valid session — stay logged out
                if (!cancelled) setUser(null);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        checkSession();
        return () => { cancelled = true; };
    }, []);

    // H3: Listen for forced logout from the refresh interceptor
    useEffect(() => {
        const handleForceLogout = () => {
            setUser(null);
        };
        window.addEventListener('auth:logout', handleForceLogout);
        return () => window.removeEventListener('auth:logout', handleForceLogout);
    }, []);

    const login = async (identifier, password) => {
        const data = await loginApi(identifier, password);
        setUser(data.user);
    };

    const logout = useCallback(async () => {
        try {
            await logoutApi();
        } catch (_) {
            // Best-effort server logout
        }
        setUser(null);
    }, []);

    const refreshUser = useCallback((userData) => {
        setUser(prev => ({ ...prev, ...userData }));
    }, []);

    const value = {
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        refreshUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

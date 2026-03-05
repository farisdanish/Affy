import api from './api';

export const login = async (identifier, password) => {
    const response = await api.post('/api/v1/auth/login', { identifier, password });
    return response.data; // { user: { id, name, email, username, role } }
};

export const register = async (name, username, email, password, role) => {
    const response = await api.post('/api/v1/auth/register', { name, username, email, password, role });
    return response.data;
};

export const checkAvailability = async (field, value, excludeId) => {
    const response = await api.get('/api/v1/auth/check-availability', {
        params: { field, value, excludeId }
    });
    return response.data.available;
};

// H5: Fetch current user from httpOnly cookie session
export const fetchCurrentUser = async () => {
    const response = await api.get('/api/v1/auth/me');
    return response.data; // { user: { id, name, email, username, role } }
};

// H5: Server clears httpOnly cookies
export const logout = async () => {
    await api.post('/api/v1/auth/logout');
};

// H3: Refresh access token using refresh token cookie
export const refreshToken = async () => {
    const response = await api.post('/api/v1/auth/refresh');
    return response.data;
};

import api from './api';

export const login = async (identifier, password) => {
    const response = await api.post('/auth/login', { identifier, password });
    return response.data; // { token, user: { id, name, role } }
};

export const register = async (name, username, email, password, role) => {
    const response = await api.post('/auth/register', { name, username, email, password, role });
    return response.data;
};

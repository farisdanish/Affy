import api from './api';

export const getProfile = async () => {
    const response = await api.get('/api/v1/profile');
    return response.data;
};

export const updateProfile = async (profileData) => {
    const response = await api.put('/api/v1/profile', profileData);
    return response.data;
};

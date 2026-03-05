import api from './api';

export const getActivityLogs = async ({ page = 1, limit = 20, action, entityType } = {}) => {
    const response = await api.get('/api/v1/activity-logs', {
        params: { page, limit, action, entityType },
    });
    return response.data;
};

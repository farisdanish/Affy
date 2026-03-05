import api from './api';

/**
 * Stats Service
 * Fetches dashboard metrics (bookings, referrals, users, revenue)
 */
const statsService = {
    /**
     * Get dashboard stats for the current user
     * @returns {Promise<Object>} { totalBookings, activeReferrals, totalUsers, totalRevenue }
     */
    getStats: async () => {
        try {
            const response = await api.get('/api/v1/stats');
            return response.data;
        } catch (error) {
            console.error('Error fetching stats:', error);
            throw error;
        }
    }
};

export default statsService;

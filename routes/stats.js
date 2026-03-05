const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Slot = require('../models/Slot');
const User = require('../models/User');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { sendError } = require('../utils/apiError');

const TREND_WINDOW_DAYS = 30;

const getDateWindows = () => {
    const now = new Date();
    const currentStart = new Date(now);
    currentStart.setUTCDate(currentStart.getUTCDate() - TREND_WINDOW_DAYS);

    const previousStart = new Date(currentStart);
    previousStart.setUTCDate(previousStart.getUTCDate() - TREND_WINDOW_DAYS);

    return { now, currentStart, previousStart };
};

const computeTrendPercent = (currentValue, previousValue) => {
    if (previousValue === 0) return currentValue === 0 ? 0 : 100;
    return Math.round(((currentValue - previousValue) / previousValue) * 100);
};

// GET /api/v1/stats
// Restricted to admin, merchant, developer
router.get('/', authenticateToken, authorizeRoles('admin', 'merchant', 'developer'), async (req, res) => {
    try {
        const isPrivileged = ['admin', 'developer'].includes(req.user.role);
        const merchantId = req.user.id;
        const { now, currentStart, previousStart } = getDateWindows();

        // 1. Get relevant slot IDs if merchant
        let slotFilter = {};
        if (!isPrivileged) {
            const merchantSlots = await Slot.find({ merchant: merchantId }).select('_id');
            const slotIds = merchantSlots.map(s => s._id);
            slotFilter = { slot: { $in: slotIds } };
        }

        // 2. Total Bookings
        const totalBookings = await Booking.countDocuments(slotFilter);
        const currentBookings = await Booking.countDocuments({
            ...slotFilter,
            createdAt: { $gte: currentStart, $lte: now }
        });
        const previousBookings = await Booking.countDocuments({
            ...slotFilter,
            createdAt: { $gte: previousStart, $lt: currentStart }
        });

        // 3. Active Referrals (Unique Agents involved)
        const activeReferralsCount = await Booking.distinct('agentId', {
            ...slotFilter,
            agentId: { $ne: null }
        });
        const currentActiveReferrals = await Booking.distinct('agentId', {
            ...slotFilter,
            agentId: { $ne: null },
            createdAt: { $gte: currentStart, $lte: now }
        });
        const previousActiveReferrals = await Booking.distinct('agentId', {
            ...slotFilter,
            agentId: { $ne: null },
            createdAt: { $gte: previousStart, $lt: currentStart }
        });

        // 4. Users / Customers
        let userCount = 0;
        let currentUsers = 0;
        let previousUsers = 0;
        if (isPrivileged) {
            // Global users with role "user"
            userCount = await User.countDocuments({ role: 'user' });
            currentUsers = await User.countDocuments({
                role: 'user',
                createdAt: { $gte: currentStart, $lte: now }
            });
            previousUsers = await User.countDocuments({
                role: 'user',
                createdAt: { $gte: previousStart, $lt: currentStart }
            });
        } else {
            // Unique customers for this merchant
            const uniqueAuthUsers = await Booking.distinct('user', { ...slotFilter, user: { $ne: null } });
            const uniqueGuestEmails = await Booking.distinct('guestEmail', { ...slotFilter, guestEmail: { $ne: null } });
            userCount = uniqueAuthUsers.length + uniqueGuestEmails.length;

            const currentAuthUsers = await Booking.distinct('user', {
                ...slotFilter,
                user: { $ne: null },
                createdAt: { $gte: currentStart, $lte: now }
            });
            const currentGuestEmails = await Booking.distinct('guestEmail', {
                ...slotFilter,
                guestEmail: { $ne: null },
                createdAt: { $gte: currentStart, $lte: now }
            });
            currentUsers = currentAuthUsers.length + currentGuestEmails.length;

            const previousAuthUsers = await Booking.distinct('user', {
                ...slotFilter,
                user: { $ne: null },
                createdAt: { $gte: previousStart, $lt: currentStart }
            });
            const previousGuestEmails = await Booking.distinct('guestEmail', {
                ...slotFilter,
                guestEmail: { $ne: null },
                createdAt: { $gte: previousStart, $lt: currentStart }
            });
            previousUsers = previousAuthUsers.length + previousGuestEmails.length;
        }

        // 5. Total Revenue (Sum of prices of confirmed bookings)
        // We need to join with Slot to get the price.
        const aggregateRevenue = async (extraMatch = {}) => {
            const revenueResult = await Booking.aggregate([
                { $match: { ...slotFilter, status: 'confirmed', ...extraMatch } },
                {
                    $lookup: {
                        from: 'slots',
                        localField: 'slot',
                        foreignField: '_id',
                        as: 'slotData'
                    }
                },
                { $unwind: '$slotData' },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$slotData.price' }
                    }
                }
            ]);
            return revenueResult.length > 0 ? revenueResult[0].total : 0;
        };

        const totalRevenue = await aggregateRevenue();
        const currentRevenue = await aggregateRevenue({
            createdAt: { $gte: currentStart, $lte: now }
        });
        const previousRevenue = await aggregateRevenue({
            createdAt: { $gte: previousStart, $lt: currentStart }
        });

        res.json({
            totalBookings,
            activeReferrals: activeReferralsCount.length,
            totalUsers: userCount,
            totalRevenue,
            trends: {
                totalBookings: computeTrendPercent(currentBookings, previousBookings),
                activeReferrals: computeTrendPercent(currentActiveReferrals.length, previousActiveReferrals.length),
                totalUsers: computeTrendPercent(currentUsers, previousUsers),
                totalRevenue: computeTrendPercent(currentRevenue, previousRevenue),
                periodDays: TREND_WINDOW_DAYS
            }
        });

    } catch (err) {
        console.error('Stats error:', err);
        return sendError(res, 500, 'Internal server error', 'INTERNAL_ERROR', err.message);
    }
});

module.exports = router;

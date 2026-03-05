const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Slot = require('../models/Slot');
const User = require('../models/User');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { sendError } = require('../utils/apiError');

// GET /api/v1/stats
// Restricted to admin, merchant, developer
router.get('/', authenticateToken, authorizeRoles('admin', 'merchant', 'developer'), async (req, res) => {
    try {
        const isPrivileged = ['admin', 'developer'].includes(req.user.role);
        const merchantId = req.user.id;

        // 1. Get relevant slot IDs if merchant
        let slotFilter = {};
        if (!isPrivileged) {
            const merchantSlots = await Slot.find({ merchant: merchantId }).select('_id');
            const slotIds = merchantSlots.map(s => s._id);
            slotFilter = { slot: { $in: slotIds } };
        }

        // 2. Total Bookings
        const totalBookings = await Booking.countDocuments(slotFilter);

        // 3. Active Referrals (Unique Agents involved)
        const activeReferralsCount = await Booking.distinct('agentId', {
            ...slotFilter,
            agentId: { $ne: null }
        });

        // 4. Users / Customers
        let userCount = 0;
        if (isPrivileged) {
            // Global new users
            userCount = await User.countDocuments({ role: 'user' });
        } else {
            // Unique customers for this merchant
            const uniqueAuthUsers = await Booking.distinct('user', { ...slotFilter, user: { $ne: null } });
            const uniqueGuestEmails = await Booking.distinct('guestEmail', { ...slotFilter, guestEmail: { $ne: null } });
            userCount = uniqueAuthUsers.length + uniqueGuestEmails.length;
        }

        // 5. Total Revenue (Sum of prices of confirmed bookings)
        // We need to join with Slot to get the price
        const revenueResult = await Booking.aggregate([
            { $match: { ...slotFilter, status: 'confirmed' } },
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

        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        res.json({
            totalBookings,
            activeReferrals: activeReferralsCount.length,
            totalUsers: userCount,
            totalRevenue
        });

    } catch (err) {
        console.error('Stats error:', err);
        return sendError(res, 500, 'Internal server error', 'INTERNAL_ERROR', err.message);
    }
});

module.exports = router;

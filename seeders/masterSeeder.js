/**
 * Master Seeder
 *
 * Populates the database with a full set of test data:
 * - Multiple users of each role (Admin, Developer, Agent, Merchant, User)
 * - Slots for each merchant
 * - Bookings for slots (Guest & Authenticated)
 * - Activity logs
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { nanoid } = require('nanoid');

// Models
const User = require('../models/User');
const Slot = require('../models/Slot');
const Booking = require('../models/Booking');
const ActivityLog = require('../models/ActivityLog');

const SEED_CONFIG = {
    merchants: 3,
    agents: 2,
    users: 5,
    slotsPerMerchant: 4,
    bookingsPerSlot: 2
};

const hashPassword = async (pwd) => await bcrypt.hash(pwd, 10);

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Optional: Clear existing data (use with CAUTION)
        // console.log('Cleaning database...');
        // await User.deleteMany({});
        // await Slot.deleteMany({});
        // await Booking.deleteMany({});
        // await ActivityLog.deleteMany({});

        console.log('Seeding Users...');

        // 1. Admin & Developer
        const adminPwd = await hashPassword('admin123');
        const admin = await User.findOneAndUpdate(
            { email: 'admin@affy.com' },
            { name: 'Admin User', username: 'admin', password: adminPwd, role: 'admin' },
            { upsert: true, new: true }
        );

        const devPwd = await hashPassword('dev123');
        const developer = await User.findOneAndUpdate(
            { email: 'dev@affy.com' },
            { name: 'Dev User', username: 'developer', password: devPwd, role: 'developer' },
            { upsert: true, new: true }
        );

        // 2. Merchants & their Slots
        const merchants = [];
        for (let i = 1; i <= SEED_CONFIG.merchants; i++) {
            const mPwd = await hashPassword(`merchant${i}123`);
            const m = await User.findOneAndUpdate(
                { email: `merchant${i}@affy.com` },
                {
                    name: `Merchant ${i}`,
                    username: `merchant${i}`,
                    password: mPwd,
                    role: 'merchant',
                    merchantProfile: { place: `City ${i}`, contactInfo: `+12345678${i}` }
                },
                { upsert: true, new: true }
            );
            merchants.push(m);

            // Create Slots for this Merchant
            console.log(`Creating slots for Merchant ${i}...`);
            for (let j = 1; j <= SEED_CONFIG.slotsPerMerchant; j++) {
                const startTime = new Date();
                startTime.setDate(startTime.getDate() + j); // future dates
                startTime.setHours(10 + j, 0, 0, 0);

                const endTime = new Date(startTime);
                endTime.setHours(startTime.getHours() + 2);

                await Slot.create({
                    merchant: m._id,
                    title: `Excellent Service ${j} by ${m.name}`,
                    description: `This is a premium service provided by Merchant ${i}. Highly recommended.`,
                    price: 50 + (j * 10),
                    startTime,
                    endTime,
                    capacity: 5,
                    locationLabel: `Booth ${j}`,
                    isActive: true
                });
            }
        }

        // 3. Agents (with refCodes)
        const agents = [];
        for (let i = 1; i <= SEED_CONFIG.agents; i++) {
            const aPwd = await hashPassword(`agent${i}123`);
            const a = await User.findOneAndUpdate(
                { email: `agent${i}@affy.com` },
                {
                    name: `Agent ${i}`,
                    username: `agent${i}`,
                    password: aPwd,
                    role: 'agent',
                    refCode: `AGENT00${i}`
                },
                { upsert: true, new: true }
            );
            agents.push(a);
        }

        // 4. Regular Users
        const users = [];
        for (let i = 1; i <= SEED_CONFIG.users; i++) {
            const uPwd = await hashPassword(`user${i}123`);
            const u = await User.findOneAndUpdate(
                { email: `user${i}@affy.com` },
                { name: `User ${i}`, username: `user${i}`, password: uPwd, role: 'user' },
                { upsert: true, new: true }
            );
            users.push(u);
        }

        console.log('Seeding Bookings...');
        const allSlots = await Slot.find({ isActive: true });

        for (const slot of allSlots) {
            // Guest Booking
            await Booking.findOneAndUpdate(
                { slot: slot._id, guestEmail: 'guest@example.com' },
                {
                    bookingType: 'guest',
                    guestName: 'Guest User',
                    guestEmail: 'guest@example.com',
                    status: 'confirmed'
                },
                { upsert: true }
            );

            // Authenticated Booking with Referral
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const randomAgent = agents[Math.floor(Math.random() * agents.length)];

            await Booking.findOneAndUpdate(
                { slot: slot._id, user: randomUser._id },
                {
                    bookingType: 'authenticated',
                    user: randomUser._id,
                    refCode: randomAgent.refCode,
                    agentId: randomAgent._id,
                    attributionSource: 'query_param',
                    status: 'pending'
                },
                { upsert: true }
            );
        }

        console.log('Seeding Activity Logs...');
        // Just a few sample logs
        await ActivityLog.create({
            actorId: admin._id,
            actorRole: 'admin',
            action: 'system.seeded',
            entityType: 'booking', // filler
            metadata: { timestamp: new Date() }
        });

        console.log('Master Seeding complete!');

    } catch (err) {
        console.error('Seeding ERROR:', err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

seed();

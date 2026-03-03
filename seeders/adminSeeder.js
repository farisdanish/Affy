/**
 * Admin User Seeder
 *
 * Creates a default admin user in the database.
 * Safe to run multiple times — skips if the admin email already exists.
 *
 * Usage:
 *   node seeders/adminSeeder.js
 *
 * Requires MONGO_URI in .env (or set as environment variable).
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const ADMIN_USER = {
    name: 'Admin',
    email: 'admin@affy.com',
    password: 'admin123',   // Change this in production!
    role: 'admin',
};

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const existing = await User.findOne({ email: ADMIN_USER.email });
        if (existing) {
            console.log(`Admin user already exists (${ADMIN_USER.email}). Skipping.`);
        } else {
            const hashed = await bcrypt.hash(ADMIN_USER.password, 10);
            await User.create({ ...ADMIN_USER, password: hashed });
            console.log(`Admin user created: ${ADMIN_USER.email}`);
        }
    } catch (err) {
        console.error('Seeder error:', err.message);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

seed();

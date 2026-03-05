/**
 * Regular User Seeder
 *
 * Creates a default regular user in the database.
 * Safe to run multiple times — skips if the user email already exists.
 *
 * Usage:
 *   node seeders/userSeeder.js
 *
 * Requires MONGO_URI in .env (or set as environment variable).
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const REGULAR_USER = {
    name: 'User',
    username: 'user',
    email: 'user@affy.com',
    password: 'user123',   // Change this in production!
    role: 'user',
};

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const existing = await User.findOne({ email: REGULAR_USER.email });
        if (existing) {
            console.log(`Regular user already exists (${REGULAR_USER.email}). Skipping.`);
        } else {
            const hashed = await bcrypt.hash(REGULAR_USER.password, 10);
            await User.create({ ...REGULAR_USER, password: hashed });
            console.log(`Regular user created: ${REGULAR_USER.email}`);
        }
    } catch (err) {
        console.error('Seeder error:', err.message);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

seed();

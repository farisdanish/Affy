/**
 * Developer User Seeder
 *
 * Creates a default developer user in the database.
 * Safe to run multiple times — skips if the developer email already exists.
 *
 * Usage:
 *   node seeders/developerSeeder.js
 *
 * Requires MONGO_URI in .env (or set as environment variable).
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const DEVELOPER_USER = {
    name: 'Developer',
    username: 'developer',
    email: 'developer@affy.com',
    password: 'developer123',   // Change this in production!
    role: 'developer',
};

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const existing = await User.findOne({ email: DEVELOPER_USER.email });
        if (existing) {
            console.log(`Developer user already exists (${DEVELOPER_USER.email}). Skipping.`);
        } else {
            const hashed = await bcrypt.hash(DEVELOPER_USER.password, 10);
            await User.create({ ...DEVELOPER_USER, password: hashed });
            console.log(`Developer user created: ${DEVELOPER_USER.email}`);
        }
    } catch (err) {
        console.error('Seeder error:', err.message);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

seed();

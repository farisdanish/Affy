/**
 * Merchant User Seeder
 *
 * Creates a default merchant user in the database.
 * Safe to run multiple times — skips if the merchant email already exists.
 *
 * Usage:
 *   node seeders/merchantSeeder.js
 *
 * Requires MONGO_URI in .env (or set as environment variable).
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const MERCHANT_USER = {
    name: 'Merchant',
    username: 'merchant',
    email: 'merchant@affy.com',
    password: 'merchant123',   // Change this in production!
    role: 'merchant',
};

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const existing = await User.findOne({ email: MERCHANT_USER.email });
        if (existing) {
            console.log(`Merchant user already exists (${MERCHANT_USER.email}). Skipping.`);
        } else {
            const hashed = await bcrypt.hash(MERCHANT_USER.password, 10);
            await User.create({ ...MERCHANT_USER, password: hashed });
            console.log(`Merchant user created: ${MERCHANT_USER.email}`);
        }
    } catch (err) {
        console.error('Seeder error:', err.message);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

seed();

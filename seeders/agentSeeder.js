/**
 * Agent User Seeder
 *
 * Creates a default agent user in the database.
 * Safe to run multiple times — skips if the agent email already exists.
 *
 * Usage:
 *   node seeders/agentSeeder.js
 *
 * Requires MONGO_URI in .env (or set as environment variable).
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const AGENT_USER = {
    name: 'Agent',
    username: 'agent',
    email: 'agent@affy.com',
    password: 'agent123',   // Change this in production!
    role: 'agent',
};

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const existing = await User.findOne({ email: AGENT_USER.email });
        if (existing) {
            console.log(`Agent user already exists (${AGENT_USER.email}). Skipping.`);
        } else {
            const hashed = await bcrypt.hash(AGENT_USER.password, 10);
            await User.create({ ...AGENT_USER, password: hashed });
            console.log(`Agent user created: ${AGENT_USER.email}`);
        }
    } catch (err) {
        console.error('Seeder error:', err.message);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

seed();

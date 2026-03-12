const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const HEALTHZ_TOKEN = process.env.HEALTHZ_TOKEN;

// H6: Trust first proxy so rate-limit and IP detection work behind Render.
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// H1: HTTP security headers
app.use(helmet());

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://affy.farisantoni.com'
  ],
  credentials: true, // H5: allow httpOnly cookies
}));

// H5: parse cookies for token auth
app.use(cookieParser());

// M3: cap request body size to prevent large-payload DoS
app.use(express.json({ limit: '1mb' }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Models
require('../models/User');
require('../models/Slot');
require('../models/Booking');
require('../models/ActivityLog');

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'Affy API' });
});

app.get('/healthz', async (req, res) => {
  try {
    if (HEALTHZ_TOKEN) {
      const tokenFromHeader = req.get('x-healthz-token');
      const tokenFromQuery = req.query.token;
      const token = tokenFromHeader || tokenFromQuery;

      if (token !== HEALTHZ_TOKEN) {
        return res.status(401).json({
          status: 'unauthorized',
          message: 'Invalid health check token'
        });
      }
    }

    const readyState = mongoose.connection.readyState;
    const isMongoConnected = readyState === 1;

    if (isMongoConnected) {
      await mongoose.connection.db.admin().ping();
    }

    if (!isMongoConnected) {
      return res.status(503).json({
        status: 'degraded',
        service: 'Affy API',
        mongo: 'disconnected'
      });
    }

    return res.status(200).json({
      status: 'ok',
      service: 'Affy API',
      mongo: 'connected'
    });
  } catch (err) {
    console.error('Health check failed:', err);
    return res.status(500).json({
      status: 'error',
      service: 'Affy API',
      mongo: 'unknown'
    });
  }
});

// L3: API versioning — all business routes under /api/v1
app.use('/api/v1/auth', require('../routes/auth'));
app.use('/api/v1/profile', require('../routes/profile'));
app.use('/api/v1/slots', require('../routes/slots'));
app.use('/api/v1/bookings', require('../routes/bookings'));
app.use('/api/v1/referrals', require('../routes/referrals'));
app.use('/api/v1/activity-logs', require('../routes/activityLogs'));
app.use('/api/v1/stats', require('../routes/stats'));
app.use('/api/v1/merchants', require('../routes/merchants'));


// L1: Global error handler — strip internal details in production
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err);
  const isProd = process.env.NODE_ENV === 'production';
  res.status(err.status || 500).json({
    message: isProd ? 'Internal server error' : (err.message || 'Internal server error'),
    code: 'INTERNAL_ERROR',
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

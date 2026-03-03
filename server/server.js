const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const HEALTHZ_TOKEN = process.env.HEALTHZ_TOKEN;

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://affy-three.vercel.app'
  ]
}));

app.use(express.json());

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

// Routes
app.use('/auth', require('../routes/auth'));
app.use('/slots', require('../routes/slots'));
app.use('/bookings', require('../routes/bookings'));
app.use('/referrals', require('../routes/referrals'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

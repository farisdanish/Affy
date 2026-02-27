const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/affy-app', { useNewUrlParser: true, useUnifiedTopology: true });

// Define routes and middleware
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const User = require('../models/User');
const Slot = require('../models/Slot');
const Booking = require('../models/Booking');

app.get('/slots', async (req, res) => {
  const slots = await Slot.find();
  res.json(slots);
});
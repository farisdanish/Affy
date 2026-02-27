const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Models
require('../models/User');
require('../models/Slot');
require('../models/Booking');

// Routes
app.use('/auth', require('../routes/auth'));
app.use('/slots', require('../routes/slots'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
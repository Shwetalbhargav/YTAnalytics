const express = require('express');
const cors = require('cors');
const quotaTracker = require('./middleware/quotaTracker');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const channelRoutes = require('./routes/channel.routes');
const analysisRoutes = require('./routes/analysis.routes');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// ✅ Handle preflight requests explicitly
app.options('*', cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(quotaTracker);

app.use('/api/auth', authRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/analysis', analysisRoutes);

module.exports = app;

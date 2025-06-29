const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const channelRoutes = require('./routes/channel.routes');
const analysisRoutes = require('./routes/analysis.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/analysis', analysisRoutes);

module.exports = app;

const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const analysisController = require('../controllers/analysis.controller');
const channelController = require('../controllers/channel.controller'); 
const auth = require('../middleware/auth');

// AUTH routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Protected routes
router.get('/channels', auth, authController.getUserChannels); 
router.get('/:channelId/dashboard', auth, analysisController.getDashboardOverview);

module.exports = router;

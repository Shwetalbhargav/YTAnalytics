const express = require('express');
const router = express.Router();
const channelController = require('../controllers/channel.controller');
const auth = require('../middleware/auth');

// All routes below require authentication
router.use(auth);

// GET /api/channels/
router.get('/', channelController.getChannels);

// POST /api/channels/
router.post('/', channelController.addChannel);

// DELETE /api/channels/:channelId
router.delete('/:channelId', channelController.deleteChannel);

module.exports = router;

const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysis.controller');
const auth = require('../middleware/auth');

router.use(auth);

// Dashboard — must be placed first
router.get('/dashboard/:channelId', analysisController.getDashboardOverview);

// Specific named routes BEFORE dynamic ones
router.post('/predict', analysisController.getGrowthPrediction);
router.get('/compare', analysisController.compareChannels);
router.get('/compare/:id1/:id2', analysisController.compareChannels);
router.get('/gap/:id1/:id2', analysisController.contentGapAnalysis);
router.get('/trending/match/:channelId', analysisController.matchTrendingTopics);
router.get('/channels', analysisController.listChannels);

// Channel-specific (parameterized) routes
router.get('/:channelId/recommend', analysisController.getRecommendations);
router.get('/:channelId/collab', analysisController.getCollaborationSuggestions);
router.get('/:channelId/upload-time', analysisController.getOptimalUploadTime);
router.get('/:channelId/sentiment', analysisController.getCommentSentiment);
router.get('/:channelId/revenue', analysisController.estimateRevenue);
router.get('/:channelId/thumbnail-ab-tests', analysisController.detectThumbnailABTests);
router.get('/:channelId/insights', analysisController.getConsolidatedInsights);
router.get('/:channelId', analysisController.getChannelAnalysis);

module.exports = router;

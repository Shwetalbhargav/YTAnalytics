const Channel = require("../models/channel.model");
const youtubeService = require('../services/youtube.service');
const db = require('../config/db');
const axios = require('axios');


// 1. GET all channels
exports.listChannels = async (req, res) => {
  try {
    const result = await db.query('SELECT id, channel_id, alias FROM channels');
    res.json(result.rows);
  } catch (err) {
    console.error('listChannels error:', err);
    res.status(500).json({ error: 'Failed to fetch channels' });
  }
};

// 2. Dashboard Overview
exports.getDashboardOverview = async (req, res) => {
  const { channelId } = req.params;
  const rapidHeaders = {
    'X-RapidAPI-Key': process.env.RAPID_API_KEY,
    'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com',
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const rateLimitedCalls = async (callFns, limit = 5, interval = 1000) => {
    const results = [];
    for (let i = 0; i < callFns.length; i += limit) {
      const batch = callFns.slice(i, i + limit);
      const batchResults = await Promise.all(batch.map(fn => fn()));
      results.push(...batchResults);
      if (i + limit < callFns.length) await delay(interval);
    }
    return results;
  };

  const safeFetch = async (url, params = {}) => {
    try {
      const response = await axios.get(url, {
        params,
        headers: rapidHeaders,
      });
      return response?.data || null;
    } catch (error) {
      console.error(`❌ Error fetching ${url}:`, error?.response?.data || error.message);
      return null;
    }
  };

  const callFns = [
    () => safeFetch('https://youtube-v31.p.rapidapi.com/channels', { part: 'statistics', id: channelId }),
    () => safeFetch('https://youtube-v31.p.rapidapi.com/search', { channelId, part: 'snippet', order: 'date', maxResults: 5 }),
    () => safeFetch(`http://localhost:3000/api/${channelId}/recommend`),
    () => safeFetch(`http://localhost:3000/api/${channelId}/collab`),
    () => safeFetch(`http://localhost:3000/api/${channelId}/upload-time`),
    () => safeFetch(`http://localhost:3000/api/${channelId}/thumbnail-ab-tests`),
    () => safeFetch(`http://localhost:3000/api/${channelId}/sentiment`),
    () => safeFetch(`http://localhost:3000/api/${channelId}/revenue`)
  ];

  const [
    stats,
    uploads,
    recommendations,
    collabSuggestions,
    optimalUploadTime,
    thumbnailTests,
    sentiment,
    revenue
  ] = await rateLimitedCalls(callFns, 5, 1000);

  const statData = stats?.items?.[0]?.statistics || {};
  const recentUploads = (uploads?.items || []).map(item => ({
    title: item.snippet?.title || 'Untitled',
    viewCount: Number(item.statistics?.viewCount || 0)
  }));

  const totalViews = parseInt(statData.viewCount || '0');
  const totalVideos = parseInt(statData.videoCount || '1');
  const avgViewsPerVideo = totalVideos ? totalViews / totalVideos : 0;

  res.json({
    subscriberCount: Number(statData.subscriberCount || 0),
    totalViews,
    totalVideos,
    avgViewsPerVideo,
    recentUploads,
    recommendations: recommendations?.suggestions || [],
    collaborations: collabSuggestions?.collaborators || [],
    optimalUploadTime: optimalUploadTime?.time || 'Unknown',
    thumbnailTests: thumbnailTests?.tests || [],
    sentiment: sentiment?.analysis || {},
    revenueEstimate: revenue?.estimated || 0,
  });
};





// 3. Get channel-level insights
exports.getConsolidatedInsights = async (req, res) => {
  try {
    const { channelId } = req.params;
    const channel = await Channel.findByPk(channelId);
    const insights = await youtubeService.getInsights(channel.youtube_id);
    res.json(insights);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch insights' });
  }
};

// 4. Compare Channels
exports.compareChannels = async (req, res) => {
  const { id1, id2 } = req.params;
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  const rateLimitedCalls = async (callFns, limit = 5, interval = 1000) => {
    const results = [];
    for (let i = 0; i < callFns.length; i += limit) {
      const batch = callFns.slice(i, i + limit);
      const batchResults = await Promise.all(batch.map(fn => fn()));
      results.push(...batchResults);
      if (i + limit < callFns.length) await delay(interval);
    }
    return results;
  };

  try {
    const [ch1, ch2] = await Promise.all([
      Channel.findByPk(id1),
      Channel.findByPk(id2),
    ]);

    const callFns = [
      () => youtubeService.fetchChannelVideos(ch1.youtube_id),
      () => youtubeService.fetchChannelVideos(ch2.youtube_id),
    ];

    const [v1, v2] = await rateLimitedCalls(callFns, 2, 1000); // only 2 calls here
    const [a1, a2] = [
      youtubeService.analyzeChannel(v1),
      youtubeService.analyzeChannel(v2),
    ];
    res.json({ [ch1.name]: a1, [ch2.name]: a2 });
  } catch (err) {
    res.status(500).json({ error: 'Comparison failed' });
  }
};


// 5. Content Gap
exports.contentGapAnalysis = async (req, res) => {
  const { id1, id2 } = req.params;
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  const rateLimitedCalls = async (callFns, limit = 5, interval = 1000) => {
    const results = [];
    for (let i = 0; i < callFns.length; i += limit) {
      const batch = callFns.slice(i, i + limit);
      const batchResults = await Promise.all(batch.map(fn => fn()));
      results.push(...batchResults);
      if (i + limit < callFns.length) await delay(interval);
    }
    return results;
  };

  try {
    const [c1, c2] = await Promise.all([
      Channel.findByPk(id1),
      Channel.findByPk(id2),
    ]);

    const callFns = [
      () => youtubeService.fetchChannelVideos(c1.youtube_id),
      () => youtubeService.fetchChannelVideos(c2.youtube_id),
    ];

    const [v1, v2] = await rateLimitedCalls(callFns, 2, 1000);
    const tags1 = v1.flatMap(v => v.video?.title?.split(/\W+/));
    const tags2 = v2.flatMap(v => v.video?.title?.split(/\W+/));
    const gap = tags2.filter(tag => !tags1.includes(tag));
    res.json({ contentGap: [...new Set(gap)] });
  } catch (e) {
    res.status(500).json({ error: 'Gap analysis failed' });
  }
};


// 6. Get Recommendations
exports.getRecommendations = async (req, res) => {
  const { channelId } = req.params;
  try {
    const channel = await Channel.findByPk(channelId);
    const videos = await youtubeService.fetchChannelVideos(channel.youtube_id);
    const suggestions = youtubeService.getRecommendations(videos);
    res.json(suggestions);
  } catch (e) {
    res.status(500).json({ error: 'Recommendation failed' });
  }
};

// 7. Predict Subscriber Growth
exports.getGrowthPrediction = async (req, res) => {
  try {
    const { history } = req.body;
    const prediction = youtubeService.predictGrowth(history);
    res.json(prediction);
  } catch (err) {
    res.status(500).json({ error: 'Prediction failed' });
  }
};

// 8. Upload Time
exports.getOptimalUploadTime = async (req, res) => {
  try {
    const { channelId } = req.params;
    const channel = await Channel.findByPk(channelId);
    const videos = await youtubeService.fetchChannelVideos(channel.youtube_id);
    const schedule = youtubeService.analyzeUploadTimes(videos);
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ error: 'Upload time analysis failed' });
  }
};

// 9. Comment Sentiment
exports.getCommentSentiment = async (req, res) => {
  try {
    const { channelId } = req.params;
    const channel = await Channel.findByPk(channelId);
    const sentiment = await youtubeService.analyzeSentiment(channel.youtube_id);
    res.json(sentiment);
  } catch (err) {
    res.status(500).json({ error: 'Sentiment analysis failed' });
  }
};

// 10. Revenue Estimation
exports.estimateRevenue = async (req, res) => {
  try {
    const { channelId } = req.params;
    const channel = await Channel.findByPk(channelId);
    const estimate = await youtubeService.estimateRevenue(channel.youtube_id);
    res.json(estimate);
  } catch (err) {
    res.status(500).json({ error: 'Revenue estimation failed' });
  }
};

// 11. Trending Topic Matcher
exports.matchTrendingTopics = async (req, res) => {
  try {
    const { channelId } = req.params;
    const channel = await Channel.findByPk(channelId);
    const videos = await youtubeService.fetchChannelVideos(channel.youtube_id);
    const tags = new Set(videos.flatMap(v => v.video?.title?.split(/\W+/)));
    const trending = await youtubeService.fetchTrendingVideos();
    const trendingTags = trending.flatMap(t => t.video.tags);
    const matches = trendingTags.filter(tag => tags.has(tag));
    res.json({ matchedTags: [...new Set(matches)] });
  } catch (err) {
    res.status(500).json({ error: 'Trending topic match failed' });
  }
};

// 12. Thumbnail A/B test detection
exports.detectThumbnailABTests = async (req, res) => {
  res.json({ detected: true, pattern: 'Thumbnail filenames differ while video IDs match.' });
};

// 13. Collaboration suggestions
exports.getCollaborationSuggestions = async (req, res) => {
  try {
    const { channelId } = req.params;
    const channel = await Channel.findByPk(channelId);
    const suggestions = await youtubeService.findCollaborators(channel.youtube_id);
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ error: 'Collaboration suggestions failed' });
  }
};

// 14. GET /:channelId
exports.getChannelAnalysis = async (req, res) => {
  const { channelId } = req.params;
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  const rateLimitedCalls = async (callFns, limit = 5, interval = 1000) => {
    const results = [];
    for (let i = 0; i < callFns.length; i += limit) {
      const batch = callFns.slice(i, i + limit);
      const batchResults = await Promise.all(batch.map(fn => fn()));
      results.push(...batchResults);
      if (i + limit < callFns.length) await delay(interval);
    }
    return results;
  };

  try {
    const channel = await Channel.findByPk(channelId);
    const callFns = [
      () => youtubeService.fetchChannelVideos(channel.youtube_id),
      () => youtubeService.fetchChannelDetails(channel.youtube_id),
    ];
    const [videos, details] = await rateLimitedCalls(callFns, 5, 1000);
    const analysis = youtubeService.analyzeChannel(videos);
    res.json({ details, analysis, videos });
  } catch (err) {
    res.status(500).json({ error: 'Analysis failed' });
  }
};



exports.getUserChannels = async (req, res) => {
  try {
    const userId = req.user.id;
    const channels = await Channel.findAll({ where: { userId } });
    res.json(channels);
  } catch (err) {
    console.error('Error fetching channels:', err);
    res.status(500).json({ error: 'Failed to load user channels' });
  }
};


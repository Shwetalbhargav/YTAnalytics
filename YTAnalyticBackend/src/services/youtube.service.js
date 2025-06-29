// youtube.service.js 
const axios = require('axios');

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST;

const getHeaders = (host = RAPIDAPI_HOST) => ({
  'X-RapidAPI-Key': RAPIDAPI_KEY,
  'X-RapidAPI-Host': host,
});

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const safeGet = async (url, config, retries = 2) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await axios.get(url, config);
    } catch (error) {
      const status = error?.response?.status;
      if (status === 429 && attempt < retries) {
        console.warn(`⚠️ Rate limit hit, retrying in 1s... (${attempt + 1})`);
        await delay(1000);
      } else {
        console.error(`❌ Axios error at ${url}:`, error?.message || error);
        throw error;
      }
    }
  }
};

const fetchChannelVideos = async (channelId) => {
  const res = await safeGet(`https://${RAPIDAPI_HOST}/channel/videos/`, {
    params: { id: channelId },
    headers: getHeaders(),
  });
  return res.data.contents || [];
};

const fetchChannelDetails = async (channelId) => {
  const res = await safeGet(`https://${RAPIDAPI_HOST}/channel/details/`, {
    params: { id: channelId },
    headers: getHeaders(),
  });

  const stats = res.data.stats;
  return {
    title: res.data.title,
    subscriberCount: parseInt(stats.subscribers),
    viewCount: parseInt(stats.views),
    videoCount: parseInt(stats.videos),
  };
};

const fetchTrendingVideos = async () => {
  const res = await safeGet('https://youtube-v31.p.rapidapi.com/search', {
    params: {
      part: 'snippet',
      chart: 'mostPopular',
      regionCode: 'US',
      maxResults: 10,
    },
    headers: getHeaders('youtube-v31.p.rapidapi.com'),
  });

  return res.data.items.map(item => ({
    videoId: item.id.videoId || item.id,
    video: {
      tags: item.snippet.title
        .toLowerCase()
        .split(/\W+/)
        .filter(w => w.length > 3),
    },
  }));
};

const fetchVideoComments = async (videoId) => {
  const res = await safeGet('https://youtube-v31.p.rapidapi.com/commentThreads', {
    params: { part: 'snippet', videoId, maxResults: 20 },
    headers: getHeaders('youtube-v31.p.rapidapi.com'),
  });

  return res.data.items.map(item => ({
    text: item.snippet.topLevelComment.snippet.textDisplay,
  }));
};

const calculateViewVelocity = (videos) => {
  const recent = videos.slice(0, 5);
  const totalViews = recent.reduce((sum, v) => sum + (v.stats?.views || 0), 0);
  return totalViews / (recent.length || 1);
};

const calculateEngagementRate = (videos) => {
  return videos.map(v => {
    const views = v.stats?.views || 0;
    const likes = v.stats?.likes || 0;
    const comments = v.stats?.comments || 0;
    const rate = (likes + comments) / (views || 1);
    return {
      videoId: v.videoId,
      engagementRate: rate.toFixed(4),
    };
  });
};

const analyzeUploadSchedule = (videos) => {
  const frequency = {};
  videos.forEach(v => {
    const day = new Date(v.publishedTimeText).getDay();
    frequency[day] = (frequency[day] || 0) + 1;
  });
  return frequency;
};

const estimateRevenue = (videos) => {
  const totalViews = videos.reduce((sum, v) => sum + (v.stats?.views || 0), 0);
  return (totalViews / 1000) * 2.5;
};

const getRecommendations = async (videos) => {
  const trending = await fetchTrendingVideos();
  const trendingTags = new Set(trending.flatMap(v => v.video.tags));
  return videos
    .filter(v => v.title?.split(/\W+/).some(w => trendingTags.has(w?.toLowerCase())))
    .map(v => v.title);
};

const findCollaborators = (channelName) => {
  return [
    `${channelName} Collab 1`,
    `${channelName} Collab 2`,
    `${channelName} Network`,
  ];
};

const analyzeSentiment = async (comments) => {
  return comments.map((c, i) => ({
    text: c.text,
    sentiment: i % 2 === 0 ? 'positive' : 'neutral',
  }));
};

const analyzeChannel = (videos) => ({
  averageViewVelocity: calculateViewVelocity(videos),
  engagementRates: calculateEngagementRate(videos),
  uploadScheduleFrequency: analyzeUploadSchedule(videos),
});

// Rate-limited controller logic (can be imported or used inside controllers)
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

module.exports = {
  fetchChannelVideos,
  fetchChannelDetails,
  calculateViewVelocity,
  calculateEngagementRate,
  analyzeUploadSchedule,
  estimateRevenue,
  fetchTrendingVideos,
  getRecommendations,
  findCollaborators,
  fetchVideoComments,
  analyzeSentiment,
  analyzeChannel,
  rateLimitedCalls,
};

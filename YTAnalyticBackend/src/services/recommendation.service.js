const youtubeService = require('./youtube.service');

// This is a simplified mock logic for AI-powered recommendations
const generate = async (channelId) => {
  const videos = await youtubeService.fetchChannelVideos(channelId);
  const { fetchChannelVideos } = require('./youtube.service');
  const optimalUploadDay = findMostCommonUploadDay(videos);
  const trendingTopics = extractTrendingTopics(videos);
  const titlePatterns = extractTitlePatterns(videos);

  return {
    optimalUploadDay,
    suggestedTopics: trendingTopics,
    titleTips: titlePatterns,
  };
};

const findMostCommonUploadDay = (videos) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const freq = Array(7).fill(0);

  videos.forEach(v => {
    const day = new Date(v.publishedTimeText).getDay();
    freq[day]++;
  });

  const maxIndex = freq.indexOf(Math.max(...freq));
  return days[maxIndex];
};

const extractTrendingTopics = (videos) => {
  const keywords = {};
  videos.forEach(v => {
    const words = v.title.split(' ');
    words.forEach(w => {
      const word = w.toLowerCase();
      if (word.length > 4) {
        keywords[word] = (keywords[word] || 0) + 1;
      }
    });
  });

  return Object.entries(keywords)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
};

const extractTitlePatterns = (videos) => {
  const starters = videos.map(v => v.title.split(' ')[0].toLowerCase());
  const freq = {};
  starters.forEach(start => {
    freq[start] = (freq[start] || 0) + 1;
  });

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([starter]) => `Try starting titles with "${starter}"`);
};

exports.findCollabOpportunities = async (channelId) => {
  const targetVideos = await fetchChannelVideos(channelId);
  const targetKeywords = extractTrendingTopics(targetVideos);

  // For demo: Hardcoded comparison with popular tech channels
  const competitorIds = [
    'UC_x5XG1OV2P6uZZ5FSM9Ttw', 
    'UCYO_jab_esuFRV4b17AJtAw', 
    'UCsBjURrPoezykLs9EqgamOA' 
  ];

  const matches = [];

  for (const id of competitorIds) {
    const videos = await fetchChannelVideos(id);
    const theirTopics = extractTrendingTopics(videos);
    const common = targetKeywords.filter(k => theirTopics.includes(k));

    if (common.length > 0) {
      matches.push({ id, commonTopics: common });
    }
  }

  return matches;
};

module.exports = { generate };


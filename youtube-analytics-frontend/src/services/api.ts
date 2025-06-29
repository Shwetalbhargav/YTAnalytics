import axios from 'axios';

// Create two separate API instances
const API = axios.create({
  baseURL: 'http://localhost:3000/api',
});

const AnalysisAPI = axios.create({
  baseURL: 'http://localhost:3000/api/analysis',
});

// ==============================
// 🔐 Token Handling Middleware
// ==============================
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Or sessionStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

AnalysisAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==============================
// AUTH
// ==============================
export const login = async (data: { email: string; password: string }) => {
  try {
    const response = await API.post('/auth/login', data);
    console.log('response.data:', response.data);

    const token = response?.data?.token;
    if (!token) throw new Error('No token returned from backend');

    localStorage.setItem('token', token);
    return response.data;
  } catch (error: any) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};


export const register = (data: { email: string; password: string }) =>
  API.post('/auth/register', data);

export const logout = () => {
  localStorage.removeItem('token');
  return API.get('/auth/logout');
};

// ==============================
// CHANNELS + DASHBOARD
// ==============================
export const getAllChannels = () => {
  const token = localStorage.getItem('token');
  return API.get('/auth/channels', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const getDashboardOverview = (channelId: string) =>
  AnalysisAPI.get(`/dashboard/${channelId}`);

export const getRecommendations = (channelId: string) =>
  AnalysisAPI.get(`/${channelId}/recommend`);

export const getOptimalUploadTime = (channelId: string) =>
  AnalysisAPI.get(`/${channelId}/upload-time`);

export const estimateRevenue = (channelId: string) =>
  AnalysisAPI.get(`/${channelId}/revenue`);

export const getSentimentAnalysis = (channelId: string) =>
  AnalysisAPI.get(`/${channelId}/sentiment`);

export const getCollaborationSuggestions = (channelId: string) =>
  AnalysisAPI.get(`/${channelId}/collab`);

export const getThumbnailTests = (channelId: string) =>
  AnalysisAPI.get(`/${channelId}/thumbnail-ab-tests`);

export const getChannelInsights = (channelId: string) =>
  AnalysisAPI.get(`/${channelId}/insights`);

export const getCompetitorComparison = (id1: string, id2: string) =>
  AnalysisAPI.get(`/compare/${id1}/${id2}`);

export const getVideoPrediction = (data: { channelId: string; videoId: string }) =>
  AnalysisAPI.post('/predict', data);

export const getTrendingMatch = (channelId: string) =>
  AnalysisAPI.get(`/trending/match/${channelId}`);

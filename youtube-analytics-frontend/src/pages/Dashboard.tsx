import { useEffect, useState } from 'react';
import {
  getDashboardOverview,
  getAllChannels,
  getRecommendations,
  getOptimalUploadTime,
  estimateRevenue,
  getSentimentAnalysis,
  getCollaborationSuggestions,
  getThumbnailTests
} from '../services/api';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

export interface Channel {
  id: number;
  channel_id: string;
  alias: string;
}

interface Video {
  title: string;
  viewCount: number;
}

interface DashboardData {
  title: string;
  subscriberCount: number;
  totalViews: number;
  avgViewsPerVideo: number;
  totalVideos: number;
  recentUploads: Video[];
  recommendations?: string[];
  optimalUploadTime?: string;
  estimatedRevenue?: string;
  sentiment?: Record<string, number>;
  collaborationSuggestions?: string[];
}

export default function Dashboard() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const fetchAllData = async (channelId: string) => {
    setLoading(true);

    try {
      const dashboardRes = await getDashboardOverview(channelId);
      setDashboard(dashboardRes.data);

      await delay(300);
      const recommendationsRes = await getRecommendations(channelId);
      setDashboard(prev => prev ? { ...prev, recommendations: recommendationsRes.data } : prev);

      await delay(300);
      const uploadTimeRes = await getOptimalUploadTime(channelId);
      setDashboard(prev => prev ? { ...prev, optimalUploadTime: uploadTimeRes.data } : prev);

      await delay(300);
      const revenueRes = await estimateRevenue(channelId);
      setDashboard(prev => prev ? { ...prev, estimatedRevenue: revenueRes.data } : prev);

      await delay(300);
      const sentimentRes = await getSentimentAnalysis(channelId);
      setDashboard(prev => prev ? { ...prev, sentiment: sentimentRes.data } : prev);

      await delay(300);
      const collabRes = await getCollaborationSuggestions(channelId);
      setDashboard(prev => prev ? { ...prev, collaborationSuggestions: collabRes.data } : prev);

      await delay(300);
      const thumbnailRes = await getThumbnailTests(channelId);
      // If needed, add thumbnail data to state
    } catch (err) {
      console.error('❌ Failed to load dashboard data:', err);
      setDashboard(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    getAllChannels()
      .then((res) => setChannels(res.data))
      .catch((err) => console.error('Failed to fetch channels', err));
  }, []);

   useEffect(() => {
    if (!selectedChannel) return;

    setLoading(true);
    getDashboardOverview(selectedChannel)
      .then((res) => setDashboard(res.data))
      .catch((err) => {
        console.error('Failed to fetch dashboard', err);
        setDashboard(null);
      })
      .finally(() => setLoading(false));
  }, [selectedChannel]);

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    yellow: 'bg-yellow-100',
    purple: 'bg-purple-100',
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">📊 Channel Dashboard</h1>

      <select
        className="border px-4 py-2 rounded-md mb-6"
        value={selectedChannel}
        onChange={(e) => setSelectedChannel(e.target.value)}
      >
        <option value="">-- Select a channel --</option>
        {channels.map((ch) => (
          <option key={ch.channel_id} value={ch.channel_id}>
            {ch.alias}
          </option>
        ))}
      </select>

      {loading ? (
        <p className="text-gray-600">Loading dashboard...</p>
      ) : dashboard ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="Subscribers" value={dashboard.subscriberCount.toLocaleString()} color="blue" />
            <StatCard title="Total Views" value={dashboard.totalViews.toLocaleString()} color="green" />
            <StatCard title="Videos" value={dashboard.totalVideos} color="yellow" />
            <StatCard title="Avg Views/Video" value={Math.round(dashboard.avgViewsPerVideo).toLocaleString()} color="purple" />
          </div>

          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">📈 Recent Uploads</h2>
            {dashboard.recentUploads.length ? (
              <Bar
                data={{
                  labels: dashboard.recentUploads.map((v) => v.title),
                  datasets: [
                    {
                      label: 'Views',
                      data: dashboard.recentUploads.map((v) => v.viewCount),
                      backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'Recent Upload Views' },
                  },
                }}
              />
            ) : (
              <p>No recent uploads available.</p>
            )}
          </section>

          <section className="grid md:grid-cols-2 gap-6">
            <InfoCard title="🎯 AI Recommendations" items={dashboard.recommendations} />
            <InfoCard title="📅 Optimal Upload Time" items={[dashboard.optimalUploadTime || 'No data']} />
            <InfoCard title="💰 Estimated Revenue" items={[dashboard.estimatedRevenue || 'Not available']} />
            <InfoCard title="🧠 Comment Sentiment" sentiment={dashboard.sentiment} />
            <InfoCard title="🤝 Collaboration Suggestions" items={dashboard.collaborationSuggestions} />
          </section>
        </div>
      ) : (
        <p className="text-red-500">No data to show.</p>
      )}
    </div>
  );

  function StatCard({ title, value, color }: { title: string; value: any; color: string }) {
    return (
      <div className={`${colorMap[color]} p-6 rounded-lg shadow text-center`}>
        <p className="text-lg font-medium text-gray-700">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    );
  }

  function InfoCard({
    title,
    items,
    sentiment,
  }: {
    title: string;
    items?: string[];
    sentiment?: Record<string, number>;
  }) {
    return (
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        {sentiment ? (
          <ul className="space-y-1">
            {Object.entries(sentiment).map(([key, value]) => (
              <li key={key} className="text-sm">
                {key}: <strong>{value}</strong>
              </li>
            ))}
          </ul>
        ) : items && items.length > 0 ? (
          <ul className="list-disc list-inside text-sm space-y-1">
            {items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No data available.</p>
        )}
      </div>
    );
  }
}

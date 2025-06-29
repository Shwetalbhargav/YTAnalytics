import { useEffect, useState } from 'react';
import { getChannelInsights } from '../services/api';

interface InsightsData {
  totalViews: number;
  totalSubscribers: number;
  topVideos: Array<{ title: string; views: number }>;
  engagementRate: number;
  // Add more fields as your API returns
}

export default function ChannelInsights() {
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const channelId = '123'; // Replace with dynamic ID as needed

  useEffect(() => {
    async function fetchInsights() {
      try {
        const response = await getChannelInsights(channelId);
        setInsights(response.data);
      } catch (err) {
        setError('Failed to fetch channel insights.');
      } finally {
        setLoading(false);
      }
    }

    fetchInsights();
  }, [channelId]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Channel Insights</h1>

      {insights && (
        <div className="space-y-4">
          <p><strong>Total Views:</strong> {insights.totalViews}</p>
          <p><strong>Total Subscribers:</strong> {insights.totalSubscribers}</p>
          <p><strong>Engagement Rate:</strong> {insights.engagementRate}%</p>

          <div>
            <h2 className="text-xl font-semibold mt-4 mb-2">Top Videos</h2>
            <ul className="list-disc pl-5">
              {insights.topVideos.map((video, index) => (
                <li key={index}>
                  {video.title} — {video.views.toLocaleString()} views
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

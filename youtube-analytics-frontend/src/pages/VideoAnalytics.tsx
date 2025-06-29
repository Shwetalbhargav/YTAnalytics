import { useEffect, useState } from 'react';
import { getThumbnailTests, getTrendingMatch, getVideoPrediction } from '../services/api';

export default function VideoAnalytics() {
  const [thumbnails, setThumbnails] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const channelId = '123'; // Replace with actual/dynamic channel ID
  const videoId = 'abc';   // Replace with actual/dynamic video ID

  useEffect(() => {
    async function fetchVideoData() {
      try {
        const [thumbRes, trendRes, predRes] = await Promise.all([
          getThumbnailTests(channelId),
          getTrendingMatch(channelId),
          getVideoPrediction({ channelId, videoId })
        ]);
        setThumbnails(thumbRes.data);
        setTrending(trendRes.data);
        setPrediction(predRes.data);
      } catch (err) {
        setError('Failed to load video analytics.');
      } finally {
        setLoading(false);
      }
    }

    fetchVideoData();
  }, [channelId, videoId]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Video Analytics</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Growth Prediction</h2>
        <pre>{JSON.stringify(prediction, null, 2)}</pre>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Thumbnail A/B Tests</h2>
        <ul className="list-disc pl-5">
          {thumbnails.map((item, idx) => (
            <li key={idx}>{item.description || 'Test'} — Click-through rate: {item.ctr}%</li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Trending Topic Matches</h2>
        <ul className="list-disc pl-5">
          {trending.map((topic, idx) => (
            <li key={idx}>{topic.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

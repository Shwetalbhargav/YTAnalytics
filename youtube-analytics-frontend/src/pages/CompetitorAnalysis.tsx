import { useEffect, useState } from 'react';
import { getCompetitorComparison } from '../services/api';

interface ComparisonData {
  channelA: string;
  channelB: string;
  subscribersA: number;
  subscribersB: number;
  avgViewsA: number;
  avgViewsB: number;
  // Add more fields as needed
}

export default function CompetitorAnalysis() {
  const [comparison, setComparison] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const id1 = '123'; // Replace with dynamic or selected value
  const id2 = '456'; // Replace with dynamic or selected value

  useEffect(() => {
    async function fetchComparison() {
      try {
        const response = await getCompetitorComparison(id1, id2);
        setComparison(response.data);
      } catch (err) {
        setError('Failed to fetch competitor analysis.');
      } finally {
        setLoading(false);
      }
    }

    fetchComparison();
  }, [id1, id2]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Competitor Analysis</h1>

      {comparison && (
        <div className="space-y-2">
          <p><strong>{comparison.channelA}</strong> vs <strong>{comparison.channelB}</strong></p>
          <p>Subscribers: {comparison.subscribersA} vs {comparison.subscribersB}</p>
          <p>Average Views: {comparison.avgViewsA} vs {comparison.avgViewsB}</p>
        </div>
      )}
    </div>
  );
}

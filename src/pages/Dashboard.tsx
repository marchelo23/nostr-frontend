import { useEffect, useState } from 'react';
import { apiClient, PlatformSummary } from '@/services/api';

const styles = {
  container: {
    padding: '24px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '24px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-secondary)',
    borderRadius: '8px',
    padding: '24px',
  },
  cardTitle: {
    color: 'var(--text-tertiary)',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '8px',
  },
  cardValue: {
    fontSize: '30px',
    fontWeight: 'bold',
    color: 'var(--text-primary)',
  },
  bitcoin: {
    color: 'var(--bitcoin-orange)',
  },
  lightning: {
    color: 'var(--lightning-purple)',
  },
  loading: {
    color: 'var(--text-tertiary)',
  },
  error: {
    color: 'var(--error)',
  },
};

export default function Dashboard() {
  const [summary, setSummary] = useState<PlatformSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSummary() {
      try {
        setLoading(true);
        const data = await apiClient.getPlatformSummary();
        setSummary(data);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Error fetching summary:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Dashboard</h2>
        <p style={styles.loading}>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Dashboard</h2>
        <p style={styles.error}>{error}</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Dashboard</h2>
      <div style={styles.grid}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Total Campaigns</h3>
          <p style={{...styles.cardValue, ...styles.bitcoin}}>{summary?.total_campaigns || 0}</p>
        </div>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Active Campaigns</h3>
          <p style={{...styles.cardValue, ...styles.lightning}}>{summary?.active_campaigns || 0}</p>
        </div>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Total Spent</h3>
          <p style={styles.cardValue}>{summary?.total_rewards_distributed_sats || 0} sats</p>
        </div>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Total Actions</h3>
          <p style={styles.cardValue}>{summary?.total_actions || 0}</p>
        </div>
      </div>
    </div>
  );
}

// Made with Bob

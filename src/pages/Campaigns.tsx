import { useEffect, useState } from 'react';
import { apiClient, Campaign } from '@/services/api';

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'var(--bitcoin-orange)',
    color: 'white',
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  card: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-secondary)',
    borderRadius: '8px',
    padding: '24px',
  },
  text: {
    color: 'var(--text-tertiary)',
    textAlign: 'center' as const,
    padding: '32px 0',
  },
  campaignList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  campaignCard: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-secondary)',
    borderRadius: '8px',
    padding: '20px',
  },
  campaignName: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '8px',
  },
  campaignStatus: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    marginBottom: '12px',
  },
  statusActive: {
    backgroundColor: 'rgba(123, 63, 242, 0.1)',
    color: 'var(--lightning-purple)',
  },
  statusPaused: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    color: 'var(--warning)',
  },
  statusCompleted: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    color: 'var(--success)',
  },
  campaignDescription: {
    color: 'var(--text-secondary)',
    fontSize: '14px',
    marginBottom: '12px',
  },
  campaignMeta: {
    display: 'flex',
    gap: '16px',
    fontSize: '13px',
    color: 'var(--text-tertiary)',
  },
  loading: {
    color: 'var(--text-tertiary)',
  },
  error: {
    color: 'var(--error)',
  },
};

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        setLoading(true);
        const data = await apiClient.getCampaigns();
        setCampaigns(data);
        setError(null);
      } catch (err) {
        setError('Failed to load campaigns');
        console.error('Error fetching campaigns:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCampaigns();
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return styles.statusActive;
      case 'paused':
        return styles.statusPaused;
      case 'completed':
        return styles.statusCompleted;
      default:
        return styles.statusPaused;
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '24px' }}>
        <div style={styles.header}>
          <h2 style={styles.title}>Campaigns</h2>
          <button style={styles.button}>
            Create Campaign
          </button>
        </div>
        <p style={styles.loading}>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <div style={styles.header}>
          <h2 style={styles.title}>Campaigns</h2>
          <button style={styles.button}>
            Create Campaign
          </button>
        </div>
        <p style={styles.error}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={styles.header}>
        <h2 style={styles.title}>Campaigns</h2>
        <button style={styles.button}>
          Create Campaign
        </button>
      </div>
      
      {campaigns.length === 0 ? (
        <div style={styles.card}>
          <p style={styles.text}>
            No campaigns yet. Create your first campaign to get started.
          </p>
        </div>
      ) : (
        <div style={styles.campaignList}>
          {campaigns.map((campaign) => (
            <div key={campaign.id} style={styles.campaignCard}>
              <h3 style={styles.campaignName}>{campaign.name}</h3>
              <span style={{...styles.campaignStatus, ...getStatusStyle(campaign.status)}}>
                {campaign.status}
              </span>
              {campaign.description && (
                <p style={styles.campaignDescription}>{campaign.description}</p>
              )}
              <div style={styles.campaignMeta}>
                <span>Type: {campaign.campaign_type}</span>
                {campaign.budget_sats && <span>Budget: {campaign.budget_sats} sats</span>}
                <span>Created: {new Date(campaign.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Made with Bob

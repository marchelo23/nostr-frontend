import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import type { Campaign } from '@/types';
import { Megaphone, PlayCircle, PauseCircle, CheckCircle, DollarSign, Zap } from 'lucide-react';

const s = {
  container: { padding: '24px' },
  title: { fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '32px' },
  card: {
    backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)',
    borderRadius: '8px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px',
  },
  cardIcon: { width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardInfo: { display: 'flex', flexDirection: 'column' as const, gap: '2px' },
  cardLabel: { fontSize: '13px', color: 'var(--text-tertiary)' },
  cardValue: { fontSize: '24px', fontWeight: 'bold' },
  sectionTitle: { fontSize: '18px', fontWeight: '600', marginBottom: '16px' },
  table: { width: '100%', borderCollapse: 'collapse' as const },
  th: { textAlign: 'left' as const, padding: '12px 16px', fontSize: '13px', color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border-secondary)', fontWeight: '500' },
  td: { padding: '12px 16px', fontSize: '14px', borderBottom: '1px solid var(--border-secondary)' },
  statusBadge: (status: string) => ({
    display: 'inline-block', padding: '2px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '500',
    backgroundColor: status === 'active' ? 'rgba(123, 63, 242, 0.1)' : status === 'paused' ? 'rgba(245, 158, 11, 0.1)' : status === 'completed' || status === 'cancelled' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(163, 163, 163, 0.1)',
    color: status === 'active' ? 'var(--lightning-purple)' : status === 'paused' ? 'var(--warning)' : status === 'completed' || status === 'cancelled' ? 'var(--success)' : 'var(--text-tertiary)',
  }),
  clickable: { cursor: 'pointer' },
  loading: { color: 'var(--text-tertiary)' },
  error: { color: 'var(--error)' },
  empty: { textAlign: 'center' as const, color: 'var(--text-tertiary)', padding: '48px 0' },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const data = await api.getCampaigns();
      setCampaigns(data);
      setError(null);
    } catch {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const active = campaigns.filter(c => c.status === 'active');
  const paused = campaigns.filter(c => c.status === 'paused');
  const completed = campaigns.filter(c => c.status === 'completed' || c.status === 'cancelled');
  const totalBudget = campaigns.reduce((sum, c) => sum + (c.budget_sat || 0), 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + (c.spent_sat || 0), 0);

  if (loading) {
    return <div style={s.container}><h2 style={s.title}>Dashboard</h2><p style={s.loading}>Loading...</p></div>;
  }

  if (error) {
    return <div style={s.container}><h2 style={s.title}>Dashboard</h2><p style={s.error}>{error}</p></div>;
  }

  return (
    <div style={s.container}>
      <h2 style={s.title}>Dashboard</h2>

      <div style={s.grid}>
        <div style={s.card}>
          <div style={{ ...s.cardIcon, backgroundColor: 'rgba(123, 63, 242, 0.1)' }}>
            <PlayCircle style={{ color: 'var(--lightning-purple)', width: '20px', height: '20px' }} />
          </div>
          <div style={s.cardInfo}>
            <span style={s.cardLabel}>Active Campaigns</span>
            <span style={s.cardValue}>{active.length}</span>
          </div>
        </div>
        <div style={s.card}>
          <div style={{ ...s.cardIcon, backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
            <PauseCircle style={{ color: 'var(--warning)', width: '20px', height: '20px' }} />
          </div>
          <div style={s.cardInfo}>
            <span style={s.cardLabel}>Paused</span>
            <span style={s.cardValue}>{paused.length}</span>
          </div>
        </div>
        <div style={s.card}>
          <div style={{ ...s.cardIcon, backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
            <CheckCircle style={{ color: 'var(--success)', width: '20px', height: '20px' }} />
          </div>
          <div style={s.cardInfo}>
            <span style={s.cardLabel}>Completed</span>
            <span style={s.cardValue}>{completed.length}</span>
          </div>
        </div>
        <div style={s.card}>
          <div style={{ ...s.cardIcon, backgroundColor: 'rgba(247, 147, 26, 0.1)' }}>
            <DollarSign style={{ color: 'var(--bitcoin-orange)', width: '20px', height: '20px' }} />
          </div>
          <div style={s.cardInfo}>
            <span style={s.cardLabel}>Budget Spent</span>
            <span style={s.cardValue}>{totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}%</span>
          </div>
        </div>
        <div style={s.card}>
          <div style={{ ...s.cardIcon, backgroundColor: 'rgba(247, 147, 26, 0.1)' }}>
            <Zap style={{ color: 'var(--bitcoin-orange)', width: '20px', height: '20px' }} />
          </div>
          <div style={s.cardInfo}>
            <span style={s.cardLabel}>Total Spent</span>
            <span style={s.cardValue}>{totalSpent.toLocaleString()} sats</span>
          </div>
        </div>
        <div style={s.card}>
          <div style={{ ...s.cardIcon, backgroundColor: 'rgba(123, 63, 242, 0.1)' }}>
            <Megaphone style={{ color: 'var(--lightning-purple)', width: '20px', height: '20px' }} />
          </div>
          <div style={s.cardInfo}>
            <span style={s.cardLabel}>Total Campaigns</span>
            <span style={s.cardValue}>{campaigns.length}</span>
          </div>
        </div>
      </div>

      <h3 style={s.sectionTitle}>Your Campaigns</h3>
      {campaigns.length === 0 ? (
        <div style={s.empty}>
          <Megaphone style={{ width: '48px', height: '48px', margin: '0 auto 12px', opacity: 0.3 }} />
          <p>No campaigns yet. Create your first campaign to get started.</p>
        </div>
      ) : (
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Name</th>
              <th style={s.th}>Status</th>
              <th style={s.th}>Budget</th>
              <th style={s.th}>Spent</th>
              <th style={s.th}>Remaining</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c.id} style={s.clickable} onClick={() => navigate(`/campaigns/${c.id}`)}>
                <td style={s.td}>{c.name}</td>
                <td style={s.td}><span style={s.statusBadge(c.status)}>{c.status}</span></td>
                <td style={s.td}>{c.budget_sat?.toLocaleString() || 0} sats</td>
                <td style={s.td}>{c.spent_sat?.toLocaleString() || 0} sats</td>
                <td style={s.td}>{((c.budget_sat || 0) - (c.spent_sat || 0)).toLocaleString()} sats</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

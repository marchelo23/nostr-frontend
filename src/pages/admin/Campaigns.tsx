import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import type { Campaign } from '@/types';
import { Megaphone } from 'lucide-react';

const s = {
  container: { padding: '24px' },
  title: { fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' },
  table: { width: '100%', borderCollapse: 'collapse' as const },
  th: { textAlign: 'left' as const, padding: '12px 16px', fontSize: '13px', color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border-secondary)', fontWeight: '500' },
  td: { padding: '12px 16px', fontSize: '14px', borderBottom: '1px solid var(--border-secondary)' },
  statusBadge: (status: string) => ({
    display: 'inline-block', padding: '2px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '500',
    backgroundColor: status === 'active' ? 'rgba(123, 63, 242, 0.1)' : status === 'paused' ? 'rgba(245, 158, 11, 0.1)' : status === 'completed' ? 'rgba(16, 185, 129, 0.1)' : status === 'cancelled' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(163, 163, 163, 0.1)',
    color: status === 'active' ? 'var(--lightning-purple)' : status === 'paused' ? 'var(--warning)' : status === 'completed' ? 'var(--success)' : status === 'cancelled' ? 'var(--error)' : 'var(--text-tertiary)',
  }),
  row: { cursor: 'pointer' },
  loading: { color: 'var(--text-tertiary)' },
  error: { color: 'var(--error)' },
  empty: { textAlign: 'center' as const, color: 'var(--text-tertiary)', padding: '48px 0' },
};

export default function AdminCampaigns() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      setLoading(true);
      const data = await api.getCampaigns();
      setCampaigns(data);
      setError(null);
    } catch {
      setError('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={s.container}><h2 style={s.title}>All Campaigns</h2><p style={s.loading}>Loading...</p></div>;
  if (error) return <div style={s.container}><h2 style={s.title}>All Campaigns</h2><p style={s.error}>{error}</p></div>;

  return (
    <div style={s.container}>
      <h2 style={s.title}>All Campaigns</h2>
      {campaigns.length === 0 ? (
        <div style={s.empty}>
          <Megaphone style={{ width: '48px', height: '48px', margin: '0 auto 12px', opacity: 0.3 }} />
          <p>No campaigns found.</p>
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
              <th style={s.th}>Type</th>
              <th style={s.th}>Created</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c.id} style={s.row} onClick={() => navigate(`/campaigns/${c.id}`)}>
                <td style={s.td}>{c.name}</td>
                <td style={s.td}><span style={s.statusBadge(c.status)}>{c.status}</span></td>
                <td style={s.td}>{c.budget_sat?.toLocaleString() || 0} sats</td>
                <td style={s.td}>{c.spent_sat?.toLocaleString() || 0} sats</td>
                <td style={s.td}>{((c.budget_sat || 0) - (c.spent_sat || 0)).toLocaleString()} sats</td>
                <td style={s.td}>{c.campaign_type}</td>
                <td style={s.td}>{new Date(c.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

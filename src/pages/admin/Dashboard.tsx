import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import type { Campaign, Company } from '@/types';
import { Building2, Megaphone, PlayCircle, DollarSign } from 'lucide-react';

const s = {
  container: { padding: '24px' },
  title: { fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' },
  card: {
    backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)',
    borderRadius: '8px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px',
  },
  cardIcon: { width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardInfo: { display: 'flex', flexDirection: 'column' as const, gap: '2px' },
  cardLabel: { fontSize: '13px', color: 'var(--text-tertiary)' },
  cardValue: { fontSize: '24px', fontWeight: 'bold' },
  loading: { color: 'var(--text-tertiary)' },
  error: { color: 'var(--error)' },
};

export default function AdminDashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [camps, comps] = await Promise.all([
        api.getCampaigns(),
        api.getCompanies(),
      ]);
      setCampaigns(camps);
      setCompanies(comps);
      setError(null);
    } catch {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={s.container}><h2 style={s.title}>Admin Dashboard</h2><p style={s.loading}>Loading...</p></div>;
  if (error) return <div style={s.container}><h2 style={s.title}>Admin Dashboard</h2><p style={s.error}>{error}</p></div>;

  const totalBudget = campaigns.reduce((s, c) => s + (c.budget_sat || 0), 0);
  const totalSpent = campaigns.reduce((s, c) => s + (c.spent_sat || 0), 0);

  return (
    <div style={s.container}>
      <h2 style={s.title}>Admin Dashboard</h2>
      <div style={s.grid}>
        <div style={s.card}>
          <div style={{ ...s.cardIcon, backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
            <Building2 style={{ color: 'var(--success)', width: '20px', height: '20px' }} />
          </div>
          <div style={s.cardInfo}>
            <span style={s.cardLabel}>Companies</span>
            <span style={s.cardValue}>{companies.length}</span>
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
        <div style={s.card}>
          <div style={{ ...s.cardIcon, backgroundColor: 'rgba(123, 63, 242, 0.1)' }}>
            <PlayCircle style={{ color: 'var(--lightning-purple)', width: '20px', height: '20px' }} />
          </div>
          <div style={s.cardInfo}>
            <span style={s.cardLabel}>Active Campaigns</span>
            <span style={s.cardValue}>{campaigns.filter(c => c.status === 'active').length}</span>
          </div>
        </div>
        <div style={s.card}>
          <div style={{ ...s.cardIcon, backgroundColor: 'rgba(247, 147, 26, 0.1)' }}>
            <DollarSign style={{ color: 'var(--bitcoin-orange)', width: '20px', height: '20px' }} />
          </div>
          <div style={s.cardInfo}>
            <span style={s.cardLabel}>Total Spent</span>
            <span style={s.cardValue}>{totalSpent.toLocaleString()} sats</span>
          </div>
        </div>
        <div style={s.card}>
          <div style={{ ...s.cardIcon, backgroundColor: 'rgba(247, 147, 26, 0.1)' }}>
            <DollarSign style={{ color: 'var(--bitcoin-orange)', width: '20px', height: '20px' }} />
          </div>
          <div style={s.cardInfo}>
            <span style={s.cardLabel}>Total Budget</span>
            <span style={s.cardValue}>{totalBudget.toLocaleString()} sats</span>
          </div>
        </div>
      </div>
    </div>
  );
}

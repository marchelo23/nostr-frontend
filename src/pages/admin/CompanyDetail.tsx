import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import type { Company, Campaign } from '@/types';
import { ArrowLeft, Building2 } from 'lucide-react';

const s = {
  container: { padding: '24px' },
  header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },
  backButton: {
    backgroundColor: 'transparent', border: '1px solid var(--border-secondary)', color: 'var(--text-secondary)',
    padding: '8px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center',
  },
  title: { fontSize: '24px', fontWeight: 'bold' },
  infoCard: {
    backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)',
    borderRadius: '8px', padding: '20px', marginBottom: '24px',
  },
  infoRow: { display: 'flex', gap: '8px', marginBottom: '8px', fontSize: '14px' },
  infoLabel: { color: 'var(--text-tertiary)', minWidth: '100px' },
  infoValue: { color: 'var(--text-primary)', fontWeight: '500' },
  statusBadge: (status: string) => ({
    display: 'inline-block', padding: '2px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '500',
    backgroundColor: status === 'active' ? 'rgba(123, 63, 242, 0.1)' : 'rgba(245, 158, 11, 0.1)',
    color: status === 'active' ? 'var(--lightning-purple)' : 'var(--warning)',
  }),
  sectionTitle: { fontSize: '18px', fontWeight: '600', marginBottom: '16px' },
  table: { width: '100%', borderCollapse: 'collapse' as const },
  th: { textAlign: 'left' as const, padding: '12px 16px', fontSize: '13px', color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border-secondary)', fontWeight: '500' },
  td: { padding: '12px 16px', fontSize: '14px', borderBottom: '1px solid var(--border-secondary)' },
  row: { cursor: 'pointer' },
  loading: { color: 'var(--text-tertiary)' },
  error: { color: 'var(--error)' },
  empty: { textAlign: 'center' as const, color: 'var(--text-tertiary)', padding: '48px 0' },
};

export default function AdminCompanyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) loadData(id);
  }, [id]);

  const loadData = async (companyId: string) => {
    try {
      setLoading(true);
      const [comp, camps] = await Promise.all([
        api.getCompany(companyId),
        api.getCampaigns(),
      ]);
      setCompany(comp);
      setCampaigns(camps.filter(c => c.company_id === companyId));
      setError(null);
    } catch {
      setError('Failed to load company details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={s.container}><p style={s.loading}>Loading...</p></div>;
  if (error || !company) return <div style={s.container}><p style={s.error}>{error || 'Company not found'}</p></div>;

  return (
    <div style={s.container}>
      <div style={s.header}>
        <button style={s.backButton} onClick={() => navigate('/admin/companies')}>
          <ArrowLeft style={{ width: '18px', height: '18px' }} />
        </button>
        <h2 style={s.title}>{company.name}</h2>
      </div>

      <div style={s.infoCard}>
        <div style={s.infoRow}>
          <span style={s.infoLabel}>Status</span>
          <span style={s.infoValue}>{company.status}</span>
        </div>
        <div style={s.infoRow}>
          <span style={s.infoLabel}>Email</span>
          <span style={s.infoValue}>{company.contact_email || '-'}</span>
        </div>
        <div style={s.infoRow}>
          <span style={s.infoLabel}>Created</span>
          <span style={s.infoValue}>{new Date(company.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      <h3 style={s.sectionTitle}>Campaigns ({campaigns.length})</h3>
      {campaigns.length === 0 ? (
        <div style={s.empty}>
          <Building2 style={{ width: '48px', height: '48px', margin: '0 auto 12px', opacity: 0.3 }} />
          <p>This company has no campaigns yet.</p>
        </div>
      ) : (
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Name</th>
              <th style={s.th}>Status</th>
              <th style={s.th}>Budget</th>
              <th style={s.th}>Spent</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c.id} style={s.row} onClick={() => navigate(`/campaigns/${c.id}`)}>
                <td style={s.td}>{c.name}</td>
                <td style={s.td}><span style={s.statusBadge(c.status)}>{c.status}</span></td>
                <td style={s.td}>{c.budget_sat?.toLocaleString() || 0} sats</td>
                <td style={s.td}>{c.spent_sat?.toLocaleString() || 0} sats</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

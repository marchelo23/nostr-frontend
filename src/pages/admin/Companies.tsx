import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import type { Company } from '@/types';
import { Building2 } from 'lucide-react';

const s = {
  container: { padding: '24px' },
  title: { fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' },
  table: { width: '100%', borderCollapse: 'collapse' as const },
  th: { textAlign: 'left' as const, padding: '12px 16px', fontSize: '13px', color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border-secondary)', fontWeight: '500' },
  td: { padding: '12px 16px', fontSize: '14px', borderBottom: '1px solid var(--border-secondary)' },
  statusBadge: (status: string) => ({
    display: 'inline-block', padding: '2px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '500',
    backgroundColor: status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
    color: status === 'active' ? 'var(--success)' : 'var(--error)',
  }),
  row: { cursor: 'pointer' },
  loading: { color: 'var(--text-tertiary)' },
  error: { color: 'var(--error)' },
  empty: { textAlign: 'center' as const, color: 'var(--text-tertiary)', padding: '48px 0' },
};

export default function AdminCompanies() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      setLoading(true);
      const data = await api.getCompanies();
      setCompanies(data);
      setError(null);
    } catch {
      setError('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={s.container}><h2 style={s.title}>Companies</h2><p style={s.loading}>Loading...</p></div>;
  if (error) return <div style={s.container}><h2 style={s.title}>Companies</h2><p style={s.error}>{error}</p></div>;

  return (
    <div style={s.container}>
      <h2 style={s.title}>Companies</h2>
      {companies.length === 0 ? (
        <div style={s.empty}>
          <Building2 style={{ width: '48px', height: '48px', margin: '0 auto 12px', opacity: 0.3 }} />
          <p>No companies registered yet.</p>
        </div>
      ) : (
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Name</th>
              <th style={s.th}>Email</th>
              <th style={s.th}>Status</th>
              <th style={s.th}>Created</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c) => (
              <tr key={c.id} style={s.row} onClick={() => navigate(`/admin/companies/${c.id}`)}>
                <td style={s.td}>{c.name}</td>
                <td style={s.td}>{c.contact_email || '-'}</td>
                <td style={s.td}><span style={s.statusBadge(c.status)}>{c.status}</span></td>
                <td style={s.td}>{new Date(c.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

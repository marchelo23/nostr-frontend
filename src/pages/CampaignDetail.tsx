import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import type { Campaign, CampaignAction } from '@/types';
import { ArrowLeft, PauseCircle, PlayCircle, XCircle } from 'lucide-react';

const s = {
  container: { padding: '24px' },
  header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },
  backButton: {
    backgroundColor: 'transparent', border: '1px solid var(--border-secondary)', color: 'var(--text-secondary)',
    padding: '8px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center',
  },
  titleRow: { display: 'flex', alignItems: 'center', gap: '12px', flex: 1 },
  title: { fontSize: '24px', fontWeight: 'bold' },
  statusBadge: (status: string) => ({
    display: 'inline-block', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '500',
    backgroundColor: status === 'active' ? 'rgba(123, 63, 242, 0.1)' : status === 'paused' ? 'rgba(245, 158, 11, 0.1)' : status === 'completed' ? 'rgba(16, 185, 129, 0.1)' : status === 'cancelled' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(163, 163, 163, 0.1)',
    color: status === 'active' ? 'var(--lightning-purple)' : status === 'paused' ? 'var(--warning)' : status === 'completed' ? 'var(--success)' : status === 'cancelled' ? 'var(--error)' : 'var(--text-tertiary)',
  }),
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' },
  statCard: {
    backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)',
    borderRadius: '8px', padding: '16px',
  },
  statLabel: { fontSize: '13px', color: 'var(--text-tertiary)', marginBottom: '4px' },
  statValue: { fontSize: '20px', fontWeight: 'bold' },
  actions: { display: 'flex', gap: '8px', marginBottom: '24px' },
  actionBtn: (color: string) => ({
    display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px',
    border: '1px solid var(--border-secondary)', backgroundColor: 'var(--bg-secondary)',
    color, cursor: 'pointer', fontSize: '14px', fontWeight: '500',
  }),
  description: {
    backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)',
    borderRadius: '8px', padding: '16px', marginBottom: '24px', color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6',
  },
  sectionTitle: { fontSize: '18px', fontWeight: '600', marginBottom: '16px' },
  table: { width: '100%', borderCollapse: 'collapse' as const },
  th: { textAlign: 'left' as const, padding: '12px 16px', fontSize: '13px', color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border-secondary)', fontWeight: '500' },
  td: { padding: '12px 16px', fontSize: '14px', borderBottom: '1px solid var(--border-secondary)' },
  contentCell: { maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const },
  keywordTag: {
    display: 'inline-block', padding: '2px 8px', borderRadius: '6px', fontSize: '12px',
    backgroundColor: 'rgba(123, 63, 242, 0.1)', color: 'var(--lightning-purple)', margin: '2px',
  },
  nwcInfo: { fontSize: '13px', color: 'var(--text-tertiary)', wordBreak: 'break-all' as const },
  loading: { color: 'var(--text-tertiary)' },
  error: { color: 'var(--error)' },
  empty: { textAlign: 'center' as const, color: 'var(--text-tertiary)', padding: '48px 0' },
  link: { color: 'var(--bitcoin-orange)', textDecoration: 'none' },
};

export default function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [actions, setActions] = useState<CampaignAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) loadData(id);
  }, [id]);

  const loadData = async (campaignId: string) => {
    try {
      setLoading(true);
      const [c, a] = await Promise.all([
        api.getCampaign(campaignId),
        api.getCampaignActions(campaignId),
      ]);
      setCampaign(c);
      setActions(a);
      setError(null);
    } catch {
      setError('Failed to load campaign details');
    } finally {
      setLoading(false);
    }
  };

  const handlePause = async () => {
    if (!id || !campaign) return;
    try {
      const updated = await api.pauseCampaign(id);
      setCampaign(updated);
    } catch {
      setError('Failed to pause campaign');
    }
  };

  const handleResume = async () => {
    if (!id || !campaign) return;
    try {
      const updated = await api.resumeCampaign(id);
      setCampaign(updated);
    } catch {
      setError('Failed to resume campaign');
    }
  };

  const handleCancel = async () => {
    if (!id || !campaign) return;
    try {
      const updated = await api.cancelCampaign(id);
      setCampaign(updated);
    } catch {
      setError('Failed to cancel campaign');
    }
  };

  if (loading) {
    return <div style={s.container}><p style={s.loading}>Loading...</p></div>;
  }

  if (error || !campaign) {
    return <div style={s.container}><p style={s.error}>{error || 'Campaign not found'}</p></div>;
  }

  const remaining = (campaign.budget_sat || 0) - (campaign.spent_sat || 0);
  const contentPreview = (text: string | null | undefined) => text || '-';

  return (
    <div style={s.container}>
      <div style={s.header}>
        <button style={s.backButton} onClick={() => navigate('/campaigns')}>
          <ArrowLeft style={{ width: '18px', height: '18px' }} />
        </button>
        <div style={s.titleRow}>
          <h2 style={s.title}>{campaign.name}</h2>
          <span style={s.statusBadge(campaign.status)}>{campaign.status}</span>
        </div>
      </div>

      <div style={s.grid}>
        <div style={s.statCard}>
          <div style={s.statLabel}>Total Budget</div>
          <div style={s.statValue}>{campaign.budget_sat?.toLocaleString() || 0} sats</div>
        </div>
        <div style={s.statCard}>
          <div style={s.statLabel}>Spent</div>
          <div style={s.statValue}>{campaign.spent_sat?.toLocaleString() || 0} sats</div>
        </div>
        <div style={s.statCard}>
          <div style={s.statLabel}>Remaining</div>
          <div style={s.statValue}>{remaining.toLocaleString()} sats</div>
        </div>
        <div style={s.statCard}>
          <div style={s.statLabel}>Sats per Match</div>
          <div style={s.statValue}>{campaign.reward_per_action_sat} sats</div>
        </div>
        <div style={s.statCard}>
          <div style={s.statLabel}>Total Matches</div>
          <div style={s.statValue}>{actions.length}</div>
        </div>
        <div style={s.statCard}>
          <div style={s.statLabel}>Max per User</div>
          <div style={s.statValue}>{campaign.max_actions_per_user > 0 ? `${campaign.max_actions_per_user} sats` : 'Unlimited'}</div>
        </div>
      </div>

      {(campaign.status === 'active' || campaign.status === 'paused') && (
        <div style={s.actions}>
          {campaign.status === 'active' && (
            <button style={s.actionBtn('var(--warning)')} onClick={handlePause}>
              <PauseCircle style={{ width: '16px', height: '16px' }} /> Pause
            </button>
          )}
          {campaign.status === 'paused' && (
            <button style={s.actionBtn('var(--success)')} onClick={handleResume}>
              <PlayCircle style={{ width: '16px', height: '16px' }} /> Reactivate
            </button>
          )}
          <button style={s.actionBtn('var(--error)')} onClick={handleCancel}>
            <XCircle style={{ width: '16px', height: '16px' }} /> Cancel
          </button>
        </div>
      )}

      {campaign.description && (
        <div style={s.description}>{campaign.description}</div>
      )}

      {campaign.target_keywords && campaign.target_keywords.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          {campaign.target_keywords.map((kw) => (
            <span key={kw} style={s.keywordTag}>{kw}</span>
          ))}
        </div>
      )}

      {campaign.comment_template && (
        <div style={{ ...s.description, marginBottom: '24px' }}>
          <strong style={{ display: 'block', marginBottom: '4px', color: 'var(--text-primary)' }}>Comment Template:</strong>
          {campaign.comment_template}
        </div>
      )}

      {campaign.nwc_wallet_pubkey && (
        <div style={{ ...s.description, marginBottom: '24px', fontSize: '13px' }}>
          <strong style={{ display: 'block', marginBottom: '4px', color: 'var(--text-primary)' }}>NWC Wallet Pubkey:</strong>
          <span style={s.nwcInfo}>{campaign.nwc_wallet_pubkey}</span>
        </div>
      )}

      <h3 style={s.sectionTitle}>Recent Matches</h3>
      {actions.length === 0 ? (
        <div style={s.empty}>No matches yet</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Event ID</th>
                <th style={s.th}>User (Pubkey)</th>
                <th style={s.th}>Content</th>
                <th style={s.th}>Sats Sent</th>
                <th style={s.th}>Status</th>
                <th style={s.th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {actions.slice(0, 50).map((a) => (
                <tr key={a.id}>
                  <td style={s.td}>
                    <span style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                      {a.nostr_event_id ? a.nostr_event_id.substring(0, 12) + '...' : '-'}
                    </span>
                  </td>
                  <td style={s.td}>
                    <span style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                      {a.nostr_pubkey.substring(0, 12)}...
                    </span>
                  </td>
                  <td style={{ ...s.td, ...s.contentCell }} title={a.metadata?.content || ''}>
                    {contentPreview(a.metadata?.content)}
                  </td>
                  <td style={s.td}>{a.reward_sat} sats</td>
                  <td style={s.td}>
                    <span style={s.statusBadge(a.verification_status)}>{a.verification_status}</span>
                  </td>
                  <td style={s.td}>{new Date(a.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

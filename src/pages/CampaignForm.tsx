import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '@/services/api';
import type { CampaignCreate } from '@/types';
import { ArrowLeft } from 'lucide-react';

const s = {
  container: { padding: '24px', maxWidth: '720px' },
  header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },
  backButton: {
    backgroundColor: 'transparent', border: '1px solid var(--border-secondary)', color: 'var(--text-secondary)',
    padding: '8px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center',
  },
  title: { fontSize: '24px', fontWeight: 'bold' },
  card: {
    backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)',
    borderRadius: '8px', padding: '24px',
  },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column' as const, gap: '6px', gridColumn: 'span 1' as const },
  fieldFull: { display: 'flex', flexDirection: 'column' as const, gap: '6px', gridColumn: 'span 2' as const },
  label: { fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' },
  hint: { fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px' },
  input: {
    padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-secondary)',
    backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none',
  },
  textarea: {
    padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-secondary)',
    backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '14px',
    outline: 'none', resize: 'vertical' as const, minHeight: '80px', fontFamily: 'inherit',
  },
  keywordInput: { display: 'flex', gap: '8px' },
  keywordTag: {
    display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px',
    borderRadius: '6px', backgroundColor: 'rgba(123, 63, 242, 0.15)', color: 'var(--lightning-purple)',
    fontSize: '13px', fontWeight: '500',
  },
  keywordRemove: {
    backgroundColor: 'transparent', border: 'none', color: 'var(--lightning-purple)',
    cursor: 'pointer', padding: '0', fontSize: '16px', lineHeight: '1',
  },
  keywordsWrap: { display: 'flex', flexWrap: 'wrap' as const, gap: '6px', marginTop: '8px' },
  actions: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' },
  buttonPrimary: {
    backgroundColor: 'var(--bitcoin-orange)', color: 'white', padding: '10px 24px',
    borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600',
  },
  buttonSecondary: {
    backgroundColor: 'transparent', color: 'var(--text-secondary)', padding: '10px 24px',
    borderRadius: '8px', border: '1px solid var(--border-secondary)', cursor: 'pointer', fontSize: '14px', fontWeight: '500',
  },
  error: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', padding: '12px',
    borderRadius: '8px', fontSize: '14px', textAlign: 'center' as const, marginBottom: '16px',
  },
};

export default function CampaignForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [budgetSat, setBudgetSat] = useState('');
  const [rewardPerActionSat, setRewardPerActionSat] = useState('');
  const [maxActionsPerUser, setMaxActionsPerUser] = useState('');
  const [commentTemplate, setCommentTemplate] = useState('');
  const [nwcUri, setNwcUri] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loadingCampaign, setLoadingCampaign] = useState(isEditing);

  useEffect(() => {
    if (isEditing && id) {
      loadCampaign(id);
    }
  }, [id, isEditing]);

  const loadCampaign = async (campaignId: string) => {
    try {
      const c = await api.getCampaign(campaignId);
      setName(c.name);
      setDescription(c.description || '');
      setBudgetSat(String(c.budget_sat || ''));
      setRewardPerActionSat(String(c.reward_per_action_sat || ''));
      setMaxActionsPerUser(String(c.max_actions_per_user || ''));
      setCommentTemplate(c.comment_template || '');
      setKeywords(c.target_keywords || []);
    } catch {
      setError('Failed to load campaign');
    } finally {
      setLoadingCampaign(false);
    }
  };

  const addKeyword = () => {
    const kw = keywordInput.trim();
    if (kw && !keywords.includes(kw)) {
      setKeywords([...keywords, kw]);
      setKeywordInput('');
    }
  };

  const removeKeyword = (kw: string) => {
    setKeywords(keywords.filter((k) => k !== kw));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) { setError('Campaign name is required'); return; }
    if (!budgetSat || Number(budgetSat) <= 0) { setError('Budget must be greater than 0'); return; }
    if (!rewardPerActionSat || Number(rewardPerActionSat) <= 0) { setError('Sats per match must be greater than 0'); return; }

    setSaving(true);
    try {
      const payload: CampaignCreate = {
        name: name.trim(),
        description: description.trim(),
        campaign_type: 'nostr_promotion',
        detection_mode: 'keyword',
        reward_mode: 'zap',
        funding_mode: 'external_treasury',
        requires_manual_review: false,
        budget_sat: Number(budgetSat),
        reward_per_action_sat: Number(rewardPerActionSat),
        max_actions_per_user: Number(maxActionsPerUser) || 0,
        target_keywords: keywords.length > 0 ? keywords : null,
        comment_template: commentTemplate.trim() || null,
        nwc_uri: nwcUri.trim() || null,
        start_at: new Date().toISOString(),
        end_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      };

      if (isEditing && id) {
        await api.updateCampaign(id, payload);
      } else {
        await api.createCampaign(payload);
      }
      navigate('/campaigns');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setError(e?.response?.data?.message || e?.message || 'Failed to save campaign');
    } finally {
      setSaving(false);
    }
  };

  if (loadingCampaign) {
    return <div style={s.container}><p style={{ color: 'var(--text-tertiary)' }}>Loading...</p></div>;
  }

  return (
    <div style={s.container}>
      <div style={s.header}>
        <button style={s.backButton} onClick={() => navigate('/campaigns')}>
          <ArrowLeft style={{ width: '18px', height: '18px' }} />
        </button>
        <h2 style={s.title}>{isEditing ? 'Edit Campaign' : 'New Campaign'}</h2>
      </div>

      {error && <div style={s.error}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={s.card}>
          <div style={s.grid}>
            <div style={s.fieldFull}>
              <label style={s.label}>Campaign Name</label>
              <input style={s.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Q4 Product Launch" required />
            </div>

            <div style={s.fieldFull}>
              <label style={s.label}>Description</label>
              <textarea style={s.textarea} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your product or service..." />
            </div>

            <div style={s.fieldFull}>
              <label style={s.label}>Keywords</label>
              <div style={s.keywordInput}>
                <input style={{ ...s.input, flex: 1 }} value={keywordInput} onChange={(e) => setKeywordInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())} placeholder="Type a keyword and press Enter" />
                <button type="button" style={s.buttonPrimary} onClick={addKeyword}>Add</button>
              </div>
              {keywords.length > 0 && (
                <div style={s.keywordsWrap}>
                  {keywords.map((kw) => (
                    <span key={kw} style={s.keywordTag}>
                      {kw}
                      <button type="button" style={s.keywordRemove} onClick={() => removeKeyword(kw)}>&times;</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div style={s.field}>
              <label style={s.label}>Total Budget (sats)</label>
              <input style={s.input} type="number" value={budgetSat} onChange={(e) => setBudgetSat(e.target.value)} placeholder="100000" min="1" required />
            </div>

            <div style={s.field}>
              <label style={s.label}>Sats per Match</label>
              <input style={s.input} type="number" value={rewardPerActionSat} onChange={(e) => setRewardPerActionSat(e.target.value)} placeholder="100" min="1" required />
            </div>

            <div style={s.field}>
              <label style={s.label}>Max Sats per User</label>
              <input style={s.input} type="number" value={maxActionsPerUser} onChange={(e) => setMaxActionsPerUser(e.target.value)} placeholder="1000" min="0" />
              <span style={s.hint}>0 = unlimited</span>
            </div>

            <div style={s.fieldFull}>
              <label style={s.label}>Promotional Comment (optional)</label>
              <textarea style={s.textarea} value={commentTemplate} onChange={(e) => setCommentTemplate(e.target.value)} placeholder="Thanks for your post! Here's a zap for spreading the word about..." />
            </div>

            <div style={s.fieldFull}>
              <label style={s.label}>NWC URL (required for funding)</label>
              <input style={s.input} value={nwcUri} onChange={(e) => setNwcUri(e.target.value)} placeholder="nostr+walletconnect://..." />
              <span style={s.hint}>Your Nostr Wallet Connect URL to fund this campaign</span>
            </div>
          </div>
        </div>

        <div style={s.actions}>
          <button type="button" style={s.buttonSecondary} onClick={() => navigate('/campaigns')}>Cancel</button>
          <button type="submit" style={{ ...s.buttonPrimary, opacity: saving ? 0.6 : 1 }} disabled={saving}>
            {saving ? 'Saving...' : isEditing ? 'Update Campaign' : 'Create Campaign'}
          </button>
        </div>
      </form>
    </div>
  );
}

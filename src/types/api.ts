// Campaign Types
export interface Campaign {
  id: string;
  company_id: string | null;
  created_by_admin_id: string | null;
  name: string;
  description: string;
  campaign_type: CampaignType;
  detection_mode: DetectionMode;
  reward_mode: RewardMode;
  funding_mode: FundingMode;
  requires_manual_review: boolean;
  budget_sat: number;
  spent_sat: number;
  start_at: string;
  end_at: string;
  status: CampaignStatus;
  target_nostr_relays: string[] | null;
  target_keywords: string[] | null;
  comment_template: string | null;
  reward_per_action_sat: number;
  max_actions_per_user: number;
  metadata: Record<string, any>;
  nwc_wallet_pubkey: string | null;
  nwc_methods: string[] | null;
  nwc_last_validated_at: string | null;
  nwc_status: NWCStatus | null;
  nwc_consecutive_failures: number;
  created_at: string;
}

export type CampaignType = 
  | 'nostr_promotion' 
  | 'referral_boost' 
  | 'airdrop' 
  | 'engagement' 
  | 'lightning_reward';

export type DetectionMode = 
  | 'keyword' 
  | 'hashtag' 
  | 'event_reference' 
  | 'profile_match';

export type RewardMode = 
  | 'simulate' 
  | 'ark_lightning' 
  | 'zap';

export type FundingMode = 
  | 'simulated' 
  | 'pre_boarded_treasury' 
  | 'external_treasury';

export type CampaignStatus = 
  | 'draft' 
  | 'active' 
  | 'paused' 
  | 'completed' 
  | 'cancelled';

export type NWCStatus = 
  | 'active' 
  | 'revoked' 
  | 'exhausted' 
  | 'unknown';

// Campaign Create
export interface CampaignCreate {
  company_id?: string | null;
  created_by_admin_id?: string | null;
  name: string;
  description: string;
  campaign_type: CampaignType;
  detection_mode: DetectionMode;
  reward_mode: RewardMode;
  funding_mode: FundingMode;
  treasury_ark_pubkey?: string | null;
  requires_manual_review: boolean;
  budget_sat: number;
  start_at: string;
  end_at: string;
  target_nostr_relays?: string[] | null;
  target_keywords?: string[] | null;
  comment_template?: string | null;
  reward_per_action_sat: number;
  max_actions_per_user: number;
  metadata?: Record<string, any>;
  nwc_uri?: string | null;
}

// Company Types
export interface Company {
  id: string;
  name: string;
  contact_email: string | null;
  status: CompanyStatus;
  metadata: Record<string, any>;
  created_at: string;
}

export type CompanyStatus = 'active' | 'inactive' | 'archived';

export interface CompanyCreate {
  name: string;
  contact_email?: string | null;
  status: CompanyStatus;
  metadata?: Record<string, any>;
}

// Campaign Action Types (Candidates)
export interface CampaignAction {
  id: string;
  campaign_id: string;
  action_type: ActionType;
  nostr_event_id: string | null;
  nostr_pubkey: string;
  relay_url: string | null;
  detected_at: string | null;
  verification_status: VerificationStatus;
  reward_status: RewardStatus;
  lightning_address: string | null;
  lightning_invoice: string | null;
  payment_hash: string | null;
  ark_recipient_pubkey: string | null;
  reward_sat: number;
  status: string;
  metadata: Record<string, any>;
  created_at: string;
}

export type ActionType = 
  | 'share_event' 
  | 'relay_post' 
  | 'refer_user' 
  | 'lightning_receive' 
  | 'engagement';

export type VerificationStatus = 
  | 'detected' 
  | 'verified' 
  | 'rejected';

export type RewardStatus = 
  | 'pending' 
  | 'simulated' 
  | 'paid' 
  | 'failed';

// Reward Attempt Types
export interface RewardAttempt {
  id: string;
  action_id: string;
  campaign_id: string;
  method: string;
  amount_sat: number;
  status: RewardAttemptStatus;
  payment_hash: string | null;
  provider_reference: string | null;
  error_message: string | null;
  metadata: Record<string, any>;
  created_at: string;
  completed_at: string | null;
}

export type RewardAttemptStatus = 
  | 'pending' 
  | 'succeeded' 
  | 'failed';

// Detection Rule Types
export interface DetectionRule {
  id: string;
  campaign_id: string;
  rule_type: RuleType;
  rule_value: string;
  is_required: boolean;
  created_at: string;
}

export type RuleType = 
  | 'keyword' 
  | 'hashtag' 
  | 'author' 
  | 'event_tag' 
  | 'relay';

// Relay Monitor Job Types
export interface RelayMonitorJob {
  id: string;
  campaign_id: string;
  status: MonitorJobStatus;
  last_cursor: string | null;
  last_seen_at: string | null;
  last_error: string | null;
  updated_at: string;
}

export type MonitorJobStatus = 
  | 'idle' 
  | 'running' 
  | 'paused' 
  | 'error';

// NWC Types
export interface NWCTestRequest {
  nwc_uri?: string | null;
}

export interface NWCTestResult {
  campaign_id: string;
  wallet_pubkey: string;
  methods: string[];
  nwc_status: string;
  last_validated_at: string;
}

// Summary Types
export interface CampaignSummary {
  campaign_id: string;
  name: string;
  campaign_type: string;
  budget_sat: number;
  spent_sat: number;
  remaining_sat: number;
  total_participants: number;
  total_actions: number;
  avg_reward_sat: number;
  status: string;
}

export interface PlatformCampaignsSummary {
  total_campaigns: number;
  active_campaigns: number;
  total_budget_sat: number;
  total_spent_sat: number;
  total_participants: number;
  total_rewards_distributed_sat: number;
  campaigns: CampaignSummary[];
}

// User Types
export interface User {
  id: string;
  email: string;
  role: UserRole;
  company_id: string | null;
  created_at: string;
}

export type UserRole = 'admin' | 'company';

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// API Response Wrappers
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// Made with Bob

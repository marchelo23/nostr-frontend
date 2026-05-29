// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8006';
export const ADMIN_API_BASE_URL = import.meta.env.VITE_ADMIN_API_BASE_URL || 'http://localhost:8010';

// App Information
export const APP_NAME = 'Nostr Marketing Platform';
export const APP_VERSION = '1.0.0';

// Polling Intervals (in milliseconds)
export const POLLING_INTERVAL_MONITORING = Number(import.meta.env.VITE_POLLING_INTERVAL_MONITORING) || 5000;
export const POLLING_INTERVAL_DASHBOARD = Number(import.meta.env.VITE_POLLING_INTERVAL_DASHBOARD) || 30000;
export const POLLING_INTERVAL_REVIEW = Number(import.meta.env.VITE_POLLING_INTERVAL_REVIEW) || 10000;

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'nostr_marketing_auth_token',
  USER: 'nostr_marketing_user',
  THEME: 'nostr_marketing_theme',
  SIDEBAR_COLLAPSED: 'nostr_marketing_sidebar_collapsed',
} as const;

// Campaign Types
export const CAMPAIGN_TYPES = {
  NOSTR_PROMOTION: 'nostr_promotion',
  REFERRAL_BOOST: 'referral_boost',
  AIRDROP: 'airdrop',
  ENGAGEMENT: 'engagement',
  LIGHTNING_REWARD: 'lightning_reward',
} as const;

// Campaign Status
export const CAMPAIGN_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

// Detection Modes
export const DETECTION_MODES = {
  KEYWORD: 'keyword',
  HASHTAG: 'hashtag',
  EVENT_REFERENCE: 'event_reference',
  PROFILE_MATCH: 'profile_match',
} as const;

// Reward Modes
export const REWARD_MODES = {
  SIMULATE: 'simulate',
  ARK_LIGHTNING: 'ark_lightning',
  ZAP: 'zap',
} as const;

// Funding Modes
export const FUNDING_MODES = {
  SIMULATED: 'simulated',
  PRE_BOARDED_TREASURY: 'pre_boarded_treasury',
  EXTERNAL_TREASURY: 'external_treasury',
} as const;

// Toast Duration
export const TOAST_DURATION = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 7000,
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  ISO: "yyyy-MM-dd'T'HH:mm:ss",
} as const;

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#F7931A',
  SECONDARY: '#7B3FF2',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#3B82F6',
} as const;

// Made with Bob

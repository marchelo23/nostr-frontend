// API Endpoint Constants

// Auth Endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  ME: '/auth/me',
} as const;

// Campaign Endpoints
export const CAMPAIGN_ENDPOINTS = {
  LIST: '/campaigns',
  CREATE: '/campaigns',
  GET: (id: string) => `/campaigns/${id}`,
  UPDATE: (id: string) => `/campaigns/${id}`,
  DELETE: (id: string) => `/campaigns/${id}`,
  SUMMARY: (id: string) => `/campaigns/${id}/summary`,
  START: (id: string) => `/campaigns/${id}/start`,
  PAUSE: (id: string) => `/campaigns/${id}/pause`,
  RESUME: (id: string) => `/campaigns/${id}/resume`,
  CANCEL: (id: string) => `/campaigns/${id}/cancel`,
  COMPLETE: (id: string) => `/campaigns/${id}/complete`,
} as const;

// Company Endpoints
export const COMPANY_ENDPOINTS = {
  LIST: '/companies',
  CREATE: '/companies',
  GET: (id: string) => `/companies/${id}`,
  UPDATE: (id: string) => `/companies/${id}`,
  DELETE: (id: string) => `/companies/${id}`,
} as const;

// Campaign Action Endpoints (Candidates)
export const ACTION_ENDPOINTS = {
  LIST: '/actions',
  GET: (id: string) => `/actions/${id}`,
  BY_CAMPAIGN: (campaignId: string) => `/campaigns/${campaignId}/actions`,
  APPROVE: (id: string) => `/actions/${id}/approve`,
  REJECT: (id: string) => `/actions/${id}/reject`,
} as const;

// Reward Attempt Endpoints
export const REWARD_ENDPOINTS = {
  LIST: '/reward-attempts',
  GET: (id: string) => `/reward-attempts/${id}`,
  BY_CAMPAIGN: (campaignId: string) => `/campaigns/${campaignId}/reward-attempts`,
  BY_ACTION: (actionId: string) => `/actions/${actionId}/reward-attempts`,
} as const;

// Detection Rule Endpoints
export const DETECTION_RULE_ENDPOINTS = {
  LIST: (campaignId: string) => `/campaigns/${campaignId}/detection-rules`,
  CREATE: (campaignId: string) => `/campaigns/${campaignId}/detection-rules`,
  GET: (campaignId: string, ruleId: string) => `/campaigns/${campaignId}/detection-rules/${ruleId}`,
  UPDATE: (campaignId: string, ruleId: string) => `/campaigns/${campaignId}/detection-rules/${ruleId}`,
  DELETE: (campaignId: string, ruleId: string) => `/campaigns/${campaignId}/detection-rules/${ruleId}`,
} as const;

// Monitor Job Endpoints
export const MONITOR_JOB_ENDPOINTS = {
  LIST: '/monitor-jobs',
  GET: (id: string) => `/monitor-jobs/${id}`,
  BY_CAMPAIGN: (campaignId: string) => `/campaigns/${campaignId}/monitor-jobs`,
  START: (id: string) => `/monitor-jobs/${id}/start`,
  STOP: (id: string) => `/monitor-jobs/${id}/stop`,
} as const;

// NWC Endpoints
export const NWC_ENDPOINTS = {
  TEST: (campaignId: string) => `/campaigns/${campaignId}/nwc/test`,
  VALIDATE: (campaignId: string) => `/campaigns/${campaignId}/nwc/validate`,
} as const;

// Dashboard Endpoints
export const DASHBOARD_ENDPOINTS = {
  SUMMARY: '/dashboard/summary',
  STATS: '/dashboard/stats',
  RECENT_ACTIVITY: '/dashboard/recent-activity',
} as const;

// User Endpoints
export const USER_ENDPOINTS = {
  LIST: '/users',
  CREATE: '/users',
  GET: (id: string) => `/users/${id}`,
  UPDATE: (id: string) => `/users/${id}`,
  DELETE: (id: string) => `/users/${id}`,
} as const;

// Analytics Endpoints
export const ANALYTICS_ENDPOINTS = {
  CAMPAIGN_PERFORMANCE: (campaignId: string) => `/analytics/campaigns/${campaignId}/performance`,
  PLATFORM_METRICS: '/analytics/platform/metrics',
  REWARD_DISTRIBUTION: '/analytics/rewards/distribution',
} as const;

// Made with Bob

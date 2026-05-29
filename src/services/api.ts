import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8006';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types based on backend schemas
export interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: string;
  campaign_type: string;
  budget_sats?: number;
  reward_per_action_sats?: number;
  created_at: string;
  updated_at: string;
}

export interface CampaignSummary {
  id: string;
  name: string;
  status: string;
  campaign_type: string;
  total_actions: number;
  verified_actions: number;
  total_rewards_distributed_sats: number;
  budget_sats?: number;
  created_at: string;
}

export interface PlatformSummary {
  total_campaigns: number;
  active_campaigns: number;
  total_actions: number;
  verified_actions: number;
  total_rewards_distributed_sats: number;
}

// API functions
export const apiClient = {
  // Health check
  async health() {
    const response = await api.get('/health');
    return response.data;
  },

  // Campaigns
  async getCampaigns(statusFilter?: string) {
    const params = statusFilter ? { status: statusFilter } : {};
    const response = await api.get('/campaigns', { params });
    return response.data as Campaign[];
  },

  async getCampaignSummary(campaignId: string) {
    const response = await api.get(`/campaigns/${campaignId}`);
    return response.data as CampaignSummary;
  },

  async createCampaign(data: Partial<Campaign>) {
    const response = await api.post('/campaigns', data);
    return response.data as Campaign;
  },

  async updateCampaign(campaignId: string, data: Partial<Campaign>) {
    const response = await api.put(`/campaigns/${campaignId}`, data);
    return response.data as Campaign;
  },

  async deleteCampaign(campaignId: string) {
    const response = await api.delete(`/campaigns/${campaignId}`);
    return response.data;
  },

  async activateCampaign(campaignId: string) {
    const response = await api.post(`/campaigns/${campaignId}/activate`);
    return response.data;
  },

  async pauseCampaign(campaignId: string) {
    const response = await api.post(`/campaigns/${campaignId}/pause`);
    return response.data;
  },

  async resumeCampaign(campaignId: string) {
    const response = await api.post(`/campaigns/${campaignId}/resume`);
    return response.data;
  },

  async completeCampaign(campaignId: string) {
    const response = await api.post(`/campaigns/${campaignId}/complete`);
    return response.data;
  },

  // Platform summary
  async getPlatformSummary() {
    const response = await api.get('/campaigns/summary');
    return response.data as PlatformSummary;
  },
};

export default api;

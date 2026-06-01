import apiClient from '@/api/client';
import { AUTH_ENDPOINTS, CAMPAIGN_ENDPOINTS, COMPANY_ENDPOINTS, ACTION_ENDPOINTS, DASHBOARD_ENDPOINTS } from '@/api/endpoints';
import type {
  User, LoginCredentials, AuthResponse, Campaign, CampaignCreate,
  Company, CampaignAction, CampaignSummary as CampaignSummaryType,
  PlatformCampaignsSummary,
} from '@/types';

export const api = {
  // Auth
  login: (credentials: LoginCredentials) =>
    apiClient.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, credentials).then(r => r.data),

  register: (data: { email: string; password: string; name: string }) =>
    apiClient.post<AuthResponse>('/auth/register', data).then(r => r.data),

  getMe: () =>
    apiClient.get<User>(AUTH_ENDPOINTS.ME).then(r => r.data),

  // Campaigns
  getCampaigns: () =>
    apiClient.get<Campaign[]>(CAMPAIGN_ENDPOINTS.LIST).then(r => r.data),

  getCampaign: (id: string) =>
    apiClient.get<Campaign>(CAMPAIGN_ENDPOINTS.GET(id)).then(r => r.data),

  createCampaign: (data: CampaignCreate) =>
    apiClient.post<Campaign>(CAMPAIGN_ENDPOINTS.CREATE, data).then(r => r.data),

  updateCampaign: (id: string, data: Partial<CampaignCreate>) =>
    apiClient.patch<Campaign>(CAMPAIGN_ENDPOINTS.UPDATE(id), data).then(r => r.data),

  pauseCampaign: (id: string) =>
    apiClient.post<Campaign>(CAMPAIGN_ENDPOINTS.PAUSE(id)).then(r => r.data),

  resumeCampaign: (id: string) =>
    apiClient.post<Campaign>(CAMPAIGN_ENDPOINTS.RESUME(id)).then(r => r.data),

  cancelCampaign: (id: string) =>
    apiClient.post<Campaign>(CAMPAIGN_ENDPOINTS.CANCEL(id)).then(r => r.data),

  getCampaignSummary: (id: string) =>
    apiClient.get<CampaignSummaryType>(CAMPAIGN_ENDPOINTS.SUMMARY(id)).then(r => r.data),

  // Campaign Actions (matches)
  getCampaignActions: (campaignId: string) =>
    apiClient.get<CampaignAction[]>(ACTION_ENDPOINTS.BY_CAMPAIGN(campaignId)).then(r => r.data),

  // Companies
  getCompanies: () =>
    apiClient.get<Company[]>(COMPANY_ENDPOINTS.LIST).then(r => r.data),

  getCompany: (id: string) =>
    apiClient.get<Company>(COMPANY_ENDPOINTS.GET(id)).then(r => r.data),

  // Dashboard
  getPlatformSummary: () =>
    apiClient.get<PlatformCampaignsSummary>(DASHBOARD_ENDPOINTS.SUMMARY).then(r => r.data),
};

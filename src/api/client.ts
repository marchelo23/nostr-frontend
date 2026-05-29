import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '@/config/constants';
import type { ApiError, ApiResponse } from '@/types';

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add authentication token if available
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
        params: config.params,
      });
    }

    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log('API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  (error: AxiosError<ApiError>) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      // Handle authentication errors
      if (status === 401) {
        // Clear auth data
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        
        // Redirect to login (will be handled by router)
        window.location.href = '/login';
      }

      // Handle forbidden errors
      if (status === 403) {
        console.error('Access forbidden:', data);
      }

      // Handle not found errors
      if (status === 404) {
        console.error('Resource not found:', data);
      }

      // Handle server errors
      if (status >= 500) {
        console.error('Server error:', data);
      }

      // Log error in development
      if (import.meta.env.DEV) {
        console.error('API Error Response:', {
          status,
          url: error.config?.url,
          data,
        });
      }

      return Promise.reject({
        message: data?.message || 'An error occurred',
        code: data?.code,
        details: data?.details,
        status,
      });
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.message);
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR',
      });
    } else {
      // Something else happened
      console.error('Error:', error.message);
      return Promise.reject({
        message: error.message || 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
      });
    }
  }
);

// API helper functions
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.get<ApiResponse<T>>(url, config).then((res) => res.data as T);
  },

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.post<ApiResponse<T>>(url, data, config).then((res) => res.data as T);
  },

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.put<ApiResponse<T>>(url, data, config).then((res) => res.data as T);
  },

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.patch<ApiResponse<T>>(url, data, config).then((res) => res.data as T);
  },

  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.delete<ApiResponse<T>>(url, config).then((res) => res.data as T);
  },
};

export default apiClient;

// Made with Bob

// lib/api/client.ts
import axios from 'axios';
import { getSession } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Auto-attach JWT token from backend to requests
apiClient.interceptors.request.use((config) => {
  // We'll handle token attachment in individual API calls
  return config;
});

// Handle API errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn('🚫 API request failed with 401 - authentication required');
    }
    return Promise.reject(error);
  }
);

// Helper function to get authenticated headers
export const getAuthHeaders = async () => {
  try {
    const session = await getSession();
    console.log('🔍 Session debug:', {
      hasSession: !!session,
      hasJwtToken: !!session?.jwtAccessToken,
      tokenPreview: session?.jwtAccessToken ? session.jwtAccessToken.substring(0, 20) + '...' : 'none'
    });
    
    if (session?.jwtAccessToken) {
      console.log('🔑 Using JWT token for API call');
      return {
        'Authorization': `Bearer ${session.jwtAccessToken}`,
        'Content-Type': 'application/json',
      };
    } else {
      console.warn('⚠️ No JWT token available for API call - session:', session);
      return {
        'Content-Type': 'application/json',
      };
    }
  } catch (error) {
    console.error('❌ Failed to get session:', error);
    return {
      'Content-Type': 'application/json',
    };
  }
};

// Enhanced API client with automatic JWT token handling and TypeScript generics
const authenticatedApiClient = {
  async get<T = any>(url: string, config = {}) {
    const headers = await getAuthHeaders();
    return apiClient.get<T>(url, { ...config, headers });
  },
  
  async post<T = any>(url: string, data?: any, config = {}) {
    const headers = await getAuthHeaders();
    return apiClient.post<T>(url, data, { ...config, headers });
  },
  
  async put<T = any>(url: string, data?: any, config = {}) {
    const headers = await getAuthHeaders();
    return apiClient.put<T>(url, data, { ...config, headers });
  },
  
  async delete<T = any>(url: string, config = {}) {
    const headers = await getAuthHeaders();
    return apiClient.delete<T>(url, { ...config, headers });
  },
  
  async patch<T = any>(url: string, data?: any, config = {}) {
    const headers = await getAuthHeaders();
    return apiClient.patch<T>(url, data, { ...config, headers });
  }
};

export default authenticatedApiClient; 
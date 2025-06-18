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
      console.warn('🔍 Request details:', {
        url: error.config?.url,
        method: error.config?.method,
        hasAuthHeader: !!error.config?.headers?.Authorization
      });
      
      // Try to refresh token if available
      const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
      if (refreshToken) {
        try {
          console.log('🔄 Attempting token refresh...');
          const response = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refreshToken })
          });
          
          if (response.ok) {
            const data = await response.json();
            localStorage.setItem('access_token', data.access);
            console.log('✅ Token refreshed successfully');
            
            // Retry the original request with new token
            error.config.headers.Authorization = `Bearer ${data.access}`;
            return apiClient.request(error.config);
          } else {
            console.warn('❌ Token refresh failed, clearing tokens');
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
          }
        } catch (refreshError) {
          console.error('❌ Token refresh error:', refreshError);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
    }
    return Promise.reject(error);
  }
);

// Helper function to get authenticated headers
export const getAuthHeaders = async () => {
  try {
    // First, try to get JWT token from NextAuth session (for OAuth users)
    const session = await getSession();
    console.log('🔍 Session debug:', {
      hasSession: !!session,
      hasJwtToken: !!session?.jwtAccessToken,
      tokenPreview: session?.jwtAccessToken ? session.jwtAccessToken.substring(0, 20) + '...' : 'none'
    });
    
    if (session?.jwtAccessToken) {
      console.log('🔑 Using NextAuth JWT token for API call');
      return {
        'Authorization': `Bearer ${session.jwtAccessToken}`,
        'Content-Type': 'application/json',
      };
    }
    
    // Fallback to localStorage token (for traditional auth users)
    const localToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (localToken) {
      console.log('🔑 Using localStorage token for API call');
      return {
        'Authorization': `Bearer ${localToken}`,
        'Content-Type': 'application/json',
      };
    }
    
    console.warn('⚠️ No authentication token available - session:', session);
    return {
      'Content-Type': 'application/json',
    };
  } catch (error) {
    console.error('❌ Failed to get session:', error);
    
    // Even if session fails, try localStorage as fallback
    try {
      const localToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      if (localToken) {
        console.log('🔑 Using localStorage token as fallback');
        return {
          'Authorization': `Bearer ${localToken}`,
          'Content-Type': 'application/json',
        };
      }
    } catch (localError) {
      console.error('❌ Failed to get localStorage token:', localError);
    }
    
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

// Debug utility to check authentication status
export const debugAuthStatus = async () => {
  console.log('🔍 Authentication Debug Status:');
  
  let session = null;
  
  // Check NextAuth session
  try {
    session = await getSession();
    console.log('📱 NextAuth Session:', {
      hasSession: !!session,
      hasJwtToken: !!session?.jwtAccessToken,
      hasRefreshToken: !!session?.jwtRefreshToken,
      userEmail: session?.user?.email,
      userId: session?.user?.id
    });
  } catch (error) {
    console.log('❌ NextAuth Session Error:', error);
  }
  
  // Check localStorage tokens
  if (typeof window !== 'undefined') {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const tokenExpires = localStorage.getItem('token_expires');
    
    console.log('💾 localStorage Tokens:', {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      tokenExpires: tokenExpires,
      accessTokenPreview: accessToken ? accessToken.substring(0, 20) + '...' : 'none'
    });
  }
  
  return { 
    nextAuthAvailable: !!session?.jwtAccessToken, 
    localStorageAvailable: !!(typeof window !== 'undefined' && localStorage.getItem('access_token'))
  };
};

export default authenticatedApiClient; 
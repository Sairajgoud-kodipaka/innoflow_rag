import apiClient from './client';
import type { User } from './users';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  expires_in?: number;
  user: User;
}

// Add new interfaces for social login
interface SocialLoginResponse extends AuthResponse {
  provider: string;
  social_id: string;
}

interface SocialLoginError {
  code: string;
  message: string;
  provider?: string;
}

// Runtime validation for auth responses
const validateAuthResponse = (data: any): AuthResponse => {
  if (!data.access || !data.refresh || !data.user) {
    throw new Error('Invalid auth response format');
  }
  
  return {
    access: data.access,
    refresh: data.refresh,
    expires_in: data.expires_in,
    user: {
      ...data.user,
      id: String(data.user.id) // Ensure ID is string
    }
  };
};

// Update error handling
const handleAuthError = (error: any): never => {
  console.error('Auth error:', error);
  if (error.response?.data?.detail) {
    throw new Error(error.response.data.detail);
  }
  throw new Error('Authentication failed');
};

// Add token management utilities
const tokenManager = {
  setTokens: (access: string, refresh: string) => {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);
    localStorage.setItem('token_expires', expiresAt.toISOString());
  },

  clearTokens: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_expires');
  },

  getTokens: () => ({
    access: localStorage.getItem('access_token'),
    refresh: localStorage.getItem('refresh_token'),
    expires: localStorage.getItem('token_expires')
  })
};

export const authService = {
  signup: async (userData: SignupData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/users/register/', userData);
    return validateAuthResponse(response.data);
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login/', credentials);
      const data = validateAuthResponse(response.data);
      
      // Store tokens in localStorage
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      
      // Store expiration time (1 hour from now)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);
      localStorage.setItem('token_expires', expiresAt.toISOString());
      
      return data;
    } catch (error: any) {
      return handleAuthError(error);
    }
  },

  logout: async (): Promise<void> => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return;

    try {
      await apiClient.post('/auth/logout/', { refresh: refreshToken });
    } catch (error) {
      console.warn('Logout API call failed, clearing tokens locally');
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('token_expires');
    }
  },

  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await apiClient.get<{ data: User }>('/auth/user/');
      return {
        ...response.data.data,
        id: String(response.data.data.id) // Ensure ID is string
      };
    } catch (error) {
      return handleAuthError(error);
    }
  },

  updateCurrentUser: async (userData: Partial<User>): Promise<User> => {
    const response = await apiClient.patch<{ data: User }>('/api/users/me/', userData);
    return {
      ...response.data.data,
      id: String(response.data.data.id) // Ensure ID is string
    };
  },

  changePassword: async (passwordData: { old_password: string; new_password: string }): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/password/change/', passwordData);
      const data = validateAuthResponse(response.data);
      
      // Store new tokens in localStorage
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      
      // Store expiration time (1 hour from now)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);
      localStorage.setItem('token_expires', expiresAt.toISOString());
      
      return data;
    } catch (error: any) {
      if (error.response?.data?.detail === 'Passwords do not match') {
        throw new Error('Passwords do not match');
      }
      return handleAuthError(error);
    }
  },

  requestPasswordReset: async (email: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/users/password/reset/', { email });
    return response.data;
  },

  confirmPasswordReset: async (resetData: any): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/users/password/reset/confirm/', resetData);
    return response.data;
  },

  // JWT Token management
  getToken: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/token/', credentials);
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh || '');
    }
    return response.data;
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const refreshToken = localStorage.getItem('refresh_token');
    const response = await apiClient.post<AuthResponse>('/api/token/refresh/', {
      refresh: refreshToken
    });
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
    }
    return response.data;
  },

  // Updated social login methods
  googleLogin: async (token: string): Promise<SocialLoginResponse> => {
    try {
      const response = await apiClient.post<SocialLoginResponse>('/auth/social/google/', { 
        access_token: token 
      });
      const data = validateAuthResponse(response.data);
      tokenManager.setTokens(data.access, data.refresh);
      return {
        ...data,
        provider: 'google',
        social_id: response.data.social_id
      };
    } catch (error) {
      const socialError: SocialLoginError = {
        code: 'GOOGLE_LOGIN_FAILED',
        message: 'Google login failed',
        provider: 'google'
      };
      throw socialError;
    }
  },

  githubLogin: async (code: string): Promise<SocialLoginResponse> => {
    try {
      const response = await apiClient.post<SocialLoginResponse>('/auth/social/github/', {
        code: code
      });
      const data = validateAuthResponse(response.data);
      tokenManager.setTokens(data.access, data.refresh);
      return {
        ...data,
        provider: 'github',
        social_id: response.data.social_id
      };
    } catch (error) {
      const socialError: SocialLoginError = {
        code: 'GITHUB_LOGIN_FAILED',
        message: 'GitHub login failed',
        provider: 'github'
      };
      throw socialError;
    }
  },

  // Add social login status check
  checkSocialLoginStatus: async (): Promise<{ isLoggedIn: boolean; provider?: string }> => {
    const tokens = tokenManager.getTokens();
    if (!tokens.access) return { isLoggedIn: false };

    try {
      const user = await authService.getCurrentUser();
      return { 
        isLoggedIn: true,
        provider: user.social_provider
      };
    } catch (error) {
      tokenManager.clearTokens();
      return { isLoggedIn: false };
    }
  }
}; 
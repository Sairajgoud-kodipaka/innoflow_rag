import apiClient from './client';

export interface UserProfile {
  id: string;
  user: string;
  bio?: string;
  avatar?: string;
  website?: string;
  location?: string;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_active: boolean;
  date_joined: string;
  social_provider?: string;
  social_id?: string;
  profile_picture?: string;
  profile?: UserProfile;
}

interface UserResponse<T> {
  data: T;
  [key: string]: any;
}

// Runtime validation for user data
const validateUser = (data: any): User => {
  if (!data.username || !data.email) {
    throw new Error('Invalid user data: missing required fields');
  }
  return {
    ...data,
    id: String(data.id) // Ensure ID is string
  };
};

export const userService = {
  // User Profile Management
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<UserResponse<User>>('/api/users/me/');
    return validateUser(response.data.data);
  },

  listProfiles: async (): Promise<UserProfile[]> => {
    const response = await apiClient.get<UserResponse<UserProfile[]>>('/api/users/profiles/');
    return response.data.data.map(profile => ({
      ...profile,
      id: String(profile.id)
    }));
  },

  createProfile: async (profile: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>): Promise<UserProfile> => {
    const response = await apiClient.post<UserResponse<UserProfile>>('/api/users/profiles/', profile);
    return {
      ...response.data.data,
      id: String(response.data.data.id)
    };
  },

  getMyProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get<UserResponse<UserProfile>>('/api/users/profiles/me/');
    return {
      ...response.data.data,
      id: String(response.data.data.id)
    };
  },

  getProfile: async (id: string): Promise<UserProfile> => {
    const response = await apiClient.get<UserResponse<UserProfile>>(`/api/users/profiles/${id}/`);
    return {
      ...response.data.data,
      id: String(response.data.data.id)
    };
  },

  updateProfile: async (id: string, profile: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await apiClient.patch<UserResponse<UserProfile>>(`/api/users/profiles/${id}/`, profile);
    return {
      ...response.data.data,
      id: String(response.data.data.id)
    };
  },

  deleteProfile: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/users/profiles/${id}/`);
  },

  // Email Verification
  requestEmailVerification: async (email: string): Promise<void> => {
    await apiClient.post('/api/users/email/verify/', { email });
  },

  confirmEmailVerification: async (token: string): Promise<void> => {
    await apiClient.post('/api/users/email/verify/confirm/', { token });
  },

  // Password Management
  requestPasswordReset: async (email: string): Promise<void> => {
    await apiClient.post('/api/users/password/reset/', { email });
  },

  confirmPasswordReset: async (data: {
    token: string;
    password: string;
  }): Promise<void> => {
    await apiClient.post('/api/users/password/reset/confirm/', data);
  }
}; 
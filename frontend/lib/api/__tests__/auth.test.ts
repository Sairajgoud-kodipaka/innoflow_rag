import '@testing-library/jest-dom';
import { authService } from '../auth';
import apiClient from '../client';

// Mock apiClient
jest.mock('../client', () => ({
  post: jest.fn(),
  get: jest.fn(),
  patch: jest.fn(),
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('login', () => {
    const mockCredentials = {
      username: 'testuser',
      password: 'testpass',
    };

    const mockResponse = {
      access: 'access-token',
      refresh: 'refresh-token',
      expires_in: 3600,
      user: {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      },
    };

    it('should successfully login and store tokens', async () => {
      (apiClient.post as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

      const result = await authService.login(mockCredentials);

      expect(result).toEqual({
        ...mockResponse,
        user: {
          ...mockResponse.user,
          id: '1', // ID should be string
        },
      });
      expect(localStorage.getItem('access_token')).toBe('access-token');
      expect(localStorage.getItem('refresh_token')).toBe('refresh-token');
      expect(localStorage.getItem('token_expires')).toBeTruthy();
    });

    it('should handle login errors', async () => {
      const error = new Error('Invalid credentials');
      (apiClient.post as jest.Mock).mockRejectedValueOnce(error);

      await expect(authService.login(mockCredentials)).rejects.toThrow('Authentication failed');
    });
  });

  describe('logout', () => {
    it('should clear tokens from localStorage', async () => {
      localStorage.setItem('access_token', 'test-token');
      localStorage.setItem('refresh_token', 'test-refresh');

      await authService.logout();

      expect(localStorage.getItem('access_token')).toBeNull();
      expect(localStorage.getItem('refresh_token')).toBeNull();
      expect(localStorage.getItem('token_expires')).toBeNull();
    });

    it('should handle API errors gracefully', async () => {
      (apiClient.post as jest.Mock).mockRejectedValueOnce(new Error('API Error'));
      localStorage.setItem('refresh_token', 'test-refresh');

      await authService.logout();

      expect(localStorage.getItem('access_token')).toBeNull();
      expect(localStorage.getItem('refresh_token')).toBeNull();
      expect(localStorage.getItem('token_expires')).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
    };

    it('should return current user with string ID', async () => {
      (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: { data: mockUser } });

      const result = await authService.getCurrentUser();

      expect(result).toEqual({
        ...mockUser,
        id: '1', // ID should be string
      });
    });

    it('should handle API errors', async () => {
      (apiClient.get as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

      await expect(authService.getCurrentUser()).rejects.toThrow('Authentication failed');
    });
  });

  describe('changePassword', () => {
    const mockPasswordData = {
      old_password: 'oldpass',
      new_password: 'newpass',
      new_password2: 'newpass',
    };

    it('should successfully change password', async () => {
      const mockResponse = {
        access: 'new-access-token',
        refresh: 'new-refresh-token',
        user: {
          id: 1,
          username: 'testuser',
        },
      };

      (apiClient.post as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

      const result = await authService.changePassword(mockPasswordData);

      expect(result).toEqual({
        ...mockResponse,
        user: {
          ...mockResponse.user,
          id: '1', // ID should be string
        },
      });
    });

    it('should handle validation errors', async () => {
      const error = {
        response: {
          data: {
            detail: 'Passwords do not match',
          },
        },
      };

      (apiClient.post as jest.Mock).mockRejectedValueOnce(error);

      await expect(authService.changePassword(mockPasswordData)).rejects.toThrow('Passwords do not match');
    });
  });

  describe('socialLogin', () => {
    it('should handle Google login', async () => {
      const mockResponse = {
        access: 'access-token',
        refresh: 'refresh-token',
        user: {
          id: 1,
          username: 'testuser',
        },
      };

      (apiClient.post as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

      const result = await authService.googleLogin('google-token');

      expect(result).toEqual({
        ...mockResponse,
        user: {
          ...mockResponse.user,
          id: '1', // ID should be string
        },
      });
      expect(localStorage.getItem('access_token')).toBe('access-token');
      expect(localStorage.getItem('refresh_token')).toBe('refresh-token');
    });

    it('should handle social login errors', async () => {
      (apiClient.post as jest.Mock).mockRejectedValueOnce(new Error('Invalid token'));

      await expect(authService.googleLogin('invalid-token')).rejects.toThrow('Authentication failed');
    });
  });
}); 
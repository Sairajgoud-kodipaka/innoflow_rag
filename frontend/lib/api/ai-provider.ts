import apiClient from './client';
import { ApiResponse } from '../types/api';
import { AIProvider, AIModel, AIConfig } from '../types/flow';

class AIProviderService {
  // Get all available AI providers
  async getProviders(): Promise<AIProvider[]> {
    try {
      const response = await apiClient.get<ApiResponse<AIProvider[]>>('/ai/providers/');
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch AI providers:', error);
      throw new Error('Failed to fetch AI providers');
    }
  }

  // Get models for a specific provider
  async getProviderModels(providerId: string): Promise<AIModel[]> {
    try {
      const response = await apiClient.get<ApiResponse<AIModel[]>>(`/ai/providers/${providerId}/models/`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch provider models:', error);
      throw new Error('Failed to fetch provider models');
    }
  }

  // Test a provider configuration
  async testProviderConfig(providerId: string, config: Record<string, any>): Promise<boolean> {
    try {
      const response = await apiClient.post<ApiResponse<{ success: boolean }>>(
        `/ai/providers/${providerId}/test/`,
        config
      );
      return response.data.data.success;
    } catch (error) {
      console.error('Failed to test provider config:', error);
      throw new Error('Failed to test provider config');
    }
  }
}

export const aiProviderService = new AIProviderService(); 
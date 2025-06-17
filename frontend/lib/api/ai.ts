import apiClient from './client';
import { ApiResponse } from '../types/api';
import { AIProvider, AIModel, AIConfig } from '../types/flow';

export interface AIModelConfig {
  id?: string;
  name: string;
  provider: string;
  model_name: string;
  api_key: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  base_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ModelComparison {
  id?: string;
  config1: string;  // ID of first model config
  config2: string;  // ID of second model config
  prompt: string;
  results?: {
    config1_response: string;
    config2_response: string;
    comparison: string;
  };
  created_at?: string;
  updated_at?: string;
}

interface AIResponse<T> {
  data: T;
  [key: string]: any;
}

class AIService {
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

  // Create a new AI configuration
  async createConfig(config: Partial<AIConfig>): Promise<AIConfig> {
    try {
      const response = await apiClient.post<ApiResponse<AIConfig>>('/ai/configs/', config);
      return response.data.data;
    } catch (error) {
      console.error('Failed to create AI config:', error);
      throw new Error('Failed to create AI config');
    }
  }

  // Update an existing AI configuration
  async updateConfig(configId: string, config: Partial<AIConfig>): Promise<AIConfig> {
    try {
      const response = await apiClient.put<ApiResponse<AIConfig>>(`/ai/configs/${configId}/`, config);
      return response.data.data;
    } catch (error) {
      console.error('Failed to update AI config:', error);
      throw new Error('Failed to update AI config');
    }
  }

  // Delete an AI configuration
  async deleteConfig(configId: string): Promise<void> {
    try {
      await apiClient.delete(`/ai/configs/${configId}/`);
    } catch (error) {
      console.error('Failed to delete AI config:', error);
      throw new Error('Failed to delete AI config');
    }
  }

  // List all AI configurations
  async listConfigs(): Promise<AIConfig[]> {
    try {
      const response = await apiClient.get<ApiResponse<AIConfig[]>>('/ai/configs/');
      return response.data.data;
    } catch (error) {
      console.error('Failed to list AI configs:', error);
      throw new Error('Failed to list AI configs');
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

  // AI Model Configuration
  async getConfig(id: string): Promise<AIModelConfig> {
    const response = await apiClient.get<AIResponse<AIModelConfig>>(`/ai/aimodelconfig/${id}/`);
    return response.data.data;
  }

  async updateConfig(id: string, config: Partial<AIModelConfig>): Promise<AIModelConfig> {
    const response = await apiClient.patch<AIResponse<AIModelConfig>>(`/ai/aimodelconfig/${id}/`, config);
    return response.data.data;
  }

  async deleteConfig(id: string): Promise<void> {
    await apiClient.delete(`/ai/aimodelconfig/${id}/`);
  }

  // Model Comparison
  async listComparisons(): Promise<ModelComparison[]> {
    const response = await apiClient.get<AIResponse<ModelComparison[]>>('/ai/modelcomparison/');
    return response.data.data;
  }

  async createComparison(comparison: Omit<ModelComparison, 'id' | 'results' | 'created_at' | 'updated_at'>): Promise<ModelComparison> {
    const response = await apiClient.post<AIResponse<ModelComparison>>('/ai/modelcomparison/', comparison);
    return response.data.data;
  }

  async getComparison(id: string): Promise<ModelComparison> {
    const response = await apiClient.get<AIResponse<ModelComparison>>(`/ai/modelcomparison/${id}/`);
    return response.data.data;
  }

  async updateComparison(id: string, comparison: Partial<ModelComparison>): Promise<ModelComparison> {
    const response = await apiClient.patch<AIResponse<ModelComparison>>(`/ai/modelcomparison/${id}/`, comparison);
    return response.data.data;
  }

  async deleteComparison(id: string): Promise<void> {
    await apiClient.delete(`/ai/modelcomparison/${id}/`);
  }

  async getComparisonResults(id: string): Promise<ModelComparison['results']> {
    const response = await apiClient.get<AIResponse<ModelComparison['results']>>(`/ai/modelcomparison/${id}/results/`);
    return response.data.data;
  }

  // Direct Model Comparison
  async compareModels(comparisonData: {
    config1: string;
    config2: string;
    prompt: string;
  }): Promise<ModelComparison> {
    const response = await apiClient.post<AIResponse<ModelComparison>>('/ai/modelcomparison/compare-models/', comparisonData);
    return response.data.data;
  }
}

export const aiService = new AIService(); 
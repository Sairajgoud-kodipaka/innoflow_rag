import apiClient from './client';

export interface AIProvider {
  id: string;
  name: string;
  models: AIModel[];
}

export interface AIModel {
  id: string;
  name: string;
  description?: string;
}

export interface AIModelConfig {
  id: number;
  name: string;
  provider: 'OPENAI' | 'ANTHROPIC' | 'DEEPSEEK' | 'OLLAMA' | 'HUGGINGFACE' | 'GEMINI';
  model_name: string;
  is_active: boolean;
  api_key?: string;
  base_url?: string;
  parameters: Record<string, any>;
  model_type: string;
  created_at: string;
  updated_at: string;
}

export interface AIModelsByProvider {
  [provider: string]: AIModelConfig[];
}

export interface ModelComparison {
  id: number;
  prompt: string;
  compared_models: number[];
  created_at: string;
}

export interface ComparisonResult {
  comparison_id: number;
  results: any;
}

export interface TaskStatus {
  task_id: string;
  status: string;
  result: any;
}

interface AIResponse<T> {
  data: T;
  [key: string]: any;
}

class AIService {
  /**
   * Get available AI providers
   */
  async getProviders(): Promise<AIProvider[]> {
    try {
      console.log('🔄 Loading AI providers...');
      // This would be implemented when backend has a providers endpoint
      // For now, return static list based on available configurations
      const configs = await this.listConfigs();
      const providerGroups = configs.reduce((acc, config) => {
        if (!acc[config.provider]) {
          acc[config.provider] = [];
        }
        acc[config.provider].push({
          id: config.id.toString(),
          name: config.model_name,
          description: config.name
        });
        return acc;
      }, {} as Record<string, AIModel[]>);

      const providers = Object.entries(providerGroups).map(([key, models]) => ({
        id: key,
        name: key,
        models
      }));
      
      console.log('✅ Loaded AI providers:', providers.length);
      return providers;
    } catch (error) {
      console.warn('⚠️ Error loading AI providers, will use fallback from listConfigs');
      // The error will be handled by listConfigs fallback, so this should still work
      throw error;
    }
  }

  /**
   * Get models for a specific provider
   */
  async getProviderModels(providerId: string): Promise<AIModel[]> {
    try {
      console.log(`🔄 Loading models for provider: ${providerId}`);
      const configs = await this.listConfigs();
      const models = configs
        .filter(config => config.provider === providerId && config.is_active)
        .map(config => ({
          id: config.id.toString(),
          name: config.model_name,
          description: config.name
        }));
      
      console.log(`✅ Loaded ${models.length} models for provider ${providerId}`);
      return models;
    } catch (error) {
      console.warn(`⚠️ Error loading models for provider ${providerId}, will use fallback from listConfigs`);
      // The error will be handled by listConfigs fallback, so this should still work
      throw error;
    }
  }

  /**
   * List all AI model configurations
   */
  async listConfigs(): Promise<AIModelConfig[]> {
    try {
      console.log('🔄 Fetching AI model configurations...');
      const response = await apiClient.get<{ results?: AIModelConfig[] } | AIModelConfig[]>('/api/ai/aimodelconfig/');
      
      // Handle Django REST framework pagination
      const configs = (response.data as any).results || response.data as AIModelConfig[];
      console.log('✅ Successfully fetched AI configs:', configs.length);
      return configs;
    } catch (error: any) {
      console.warn('⚠️ Failed to fetch AI configs from backend, using fallback data:', {
        message: error?.message || 'Unknown error',
        isNetworkError: !error?.response,
        status: error?.response?.status || 'No status'
      });
      
      // Return fallback AI configurations to prevent crashes
      const fallbackConfigs: AIModelConfig[] = [
        {
          id: 1,
          name: 'OpenAI GPT-3.5 Turbo (Demo)',
          provider: 'OPENAI',
          model_name: 'gpt-3.5-turbo',
          is_active: true,
          model_type: 'chat',
          parameters: { temperature: 0.7, max_tokens: 1000 },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Anthropic Claude (Demo)',
          provider: 'ANTHROPIC',
          model_name: 'claude-3-5-sonnet-20241022',
          is_active: true,
          model_type: 'chat',
          parameters: { temperature: 0.7, max_tokens: 1000 },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 3,
          name: 'Google Gemini (Demo)',
          provider: 'GEMINI',
          model_name: 'gemini-1.5-pro',
          is_active: true,
          model_type: 'chat',
          parameters: { temperature: 0.7, max_tokens: 1000 },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 4,
          name: 'DeepSeek Chat (Demo)',
          provider: 'DEEPSEEK',
          model_name: 'deepseek-chat',
          is_active: true,
          model_type: 'chat',
          parameters: { temperature: 0.7, max_tokens: 1000 },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 5,
          name: 'HuggingFace CodeLlama (Demo)',
          provider: 'HUGGINGFACE',
          model_name: 'codellama/CodeLlama-7b-Instruct-hf',
          is_active: true,
          model_type: 'chat',
          parameters: { temperature: 0.7, max_tokens: 1000 },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      console.log('🎭 Using fallback AI configurations:', fallbackConfigs.length);
      return fallbackConfigs;
    }
  }

  /**
   * Get a specific AI model configuration
   */
  async getConfig(id: string): Promise<AIModelConfig> {
    try {
      const response = await apiClient.get<AIModelConfig>(`/api/ai/aimodelconfig/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch AI config ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new AI model configuration
   */
  async createConfig(config: Partial<AIModelConfig>): Promise<AIModelConfig> {
    try {
      const response = await apiClient.post<AIModelConfig>('/api/ai/aimodelconfig/', config);
      return response.data;
    } catch (error) {
      console.error('Failed to create AI config:', error);
      throw error;
    }
  }

  /**
   * Update an AI model configuration
   */
  async updateConfig(id: string, config: Partial<AIModelConfig>): Promise<AIModelConfig> {
    try {
      const response = await apiClient.put<AIModelConfig>(`/api/ai/aimodelconfig/${id}/`, config);
      return response.data;
    } catch (error) {
      console.error(`Failed to update AI config ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete an AI model configuration
   */
  async deleteConfig(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/ai/aimodelconfig/${id}/`);
    } catch (error) {
      console.error(`Failed to delete AI config ${id}:`, error);
      throw error;
    }
  }

  /**
   * Test an AI model configuration
   */
  async testConfig(id: string): Promise<{ status: string; message: string }> {
    try {
      const response = await apiClient.post<{ status: string; message: string }>(`/api/ai/aimodelconfig/${id}/test-config/`);
      return response.data;
    } catch (error) {
      console.error(`Failed to test AI config ${id}:`, error);
      throw error;
    }
  }

  /**
   * Compare multiple models with a prompt
   */
  async compareModels(prompt: string, modelIds: number[]): Promise<{ comparison_id: number; status: string }> {
    try {
      const response = await apiClient.post<{ comparison_id: number; status: string }>('/api/ai/modelcomparison/compare-models/', {
        prompt,
        models: modelIds
      });
      return response.data;
    } catch (error) {
      console.error('Failed to compare models:', error);
      throw error;
    }
  }

  /**
   * Get comparison results
   */
  async getComparisonResults(comparisonId: string): Promise<ComparisonResult> {
    try {
      const response = await apiClient.get<ComparisonResult>(`/api/ai/modelcomparison/${comparisonId}/results/`);
      return response.data;
    } catch (error) {
      console.error(`Failed to get comparison results for ${comparisonId}:`, error);
      throw error;
    }
  }

  /**
   * Get task status
   */
  async getTaskStatus(taskId: string): Promise<TaskStatus> {
    try {
      const response = await apiClient.get<TaskStatus>(`/api/ai/taskstatus/status/${taskId}/`);
      return response.data;
    } catch (error) {
      console.error(`Failed to get task status for ${taskId}:`, error);
      throw error;
    }
  }

  /**
   * Get task result
   */
  async getTaskResult(taskId: string): Promise<TaskStatus> {
    try {
      // Try to get the result from the Celery task status endpoint
      const response = await apiClient.get<TaskStatus>(`/api/ai/taskstatus/result/${taskId}/`);
      return response.data;
    } catch (error) {
      console.error(`Failed to get task result for ${taskId}:`, error);
      throw error;
    }
  }

  /**
   * Execute AI model with prompt (synchronous execution for playground)
   */
  async executeModel(configId: number, prompt: string, parameters?: Record<string, any>): Promise<any> {
    try {
      // Use the synchronous execute endpoint for immediate response
      const response = await apiClient.post(`/api/ai/aimodelconfig/${configId}/execute/`, {
        prompt,
        parameters: parameters || {}
      });
      return response.data; // Returns the complete result immediately
    } catch (error) {
      console.error('Failed to execute AI model:', error);
      throw error;
    }
  }
}

export const aiService = new AIService(); 
export { AIService };

// Helper function to get models grouped by provider
export const getAIModelsByProvider = async (): Promise<AIModelsByProvider> => {
  try {
    const configs = await aiService.listConfigs();
    const activeConfigs = configs.filter(config => config.is_active);
    
    return activeConfigs.reduce((acc, config) => {
      if (!acc[config.provider]) {
        acc[config.provider] = [];
      }
      acc[config.provider].push(config);
      return acc;
    }, {} as AIModelsByProvider);
  } catch (error) {
    console.error('Error fetching AI models by provider:', error);
    throw error;
  }
}; 
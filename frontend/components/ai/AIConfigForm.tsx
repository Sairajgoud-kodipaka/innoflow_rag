'use client';

import { useState } from 'react';
import { aiService, AIModelConfig } from '@/lib/api/ai';

interface AIConfigFormProps {
  onSuccess?: () => void;
}

type AIProvider = 'OPENAI' | 'ANTHROPIC' | 'DEEPSEEK' | 'OLLAMA' | 'HUGGINGFACE' | 'GEMINI';

interface ConfigFormData {
  name: string;
  provider: AIProvider;
  model_name: string;
  api_key: string;
  base_url: string;
  parameters: Record<string, any>;
}

export default function AIConfigForm({ onSuccess }: AIConfigFormProps) {
  const [config, setConfig] = useState<ConfigFormData>({
    name: '',
    provider: 'OPENAI',
    model_name: '',
    api_key: '',
    base_url: '',
    parameters: {}
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create the config with proper typing
      const configData: Partial<AIModelConfig> = {
        name: config.name,
        provider: config.provider,
        model_name: config.model_name,
        api_key: config.api_key,
        base_url: config.base_url || undefined,
        parameters: config.parameters,
        is_active: true,
        model_type: 'chat'
      };
      
      await aiService.createConfig(configData);
      setConfig({
        name: '',
        provider: 'OPENAI',
        model_name: '',
        api_key: '',
        base_url: '',
        parameters: {}
      });
      onSuccess?.();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create AI configuration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Configuration Name</label>
        <input
          type="text"
          value={config.name}
          onChange={(e) => setConfig({ ...config, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">AI Provider</label>
        <select
          value={config.provider}
          onChange={(e) => setConfig({ ...config, provider: e.target.value as AIProvider })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="OPENAI">OpenAI</option>
          <option value="ANTHROPIC">Anthropic (Claude)</option>
          <option value="DEEPSEEK">DeepSeek</option>
          <option value="OLLAMA">Ollama</option>
          <option value="HUGGINGFACE">Hugging Face</option>
          <option value="GEMINI">Gemini</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Model Name</label>
        <input
          type="text"
          value={config.model_name}
          onChange={(e) => setConfig({ ...config, model_name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
          placeholder={config.provider === 'OPENAI' ? 'e.g., gpt-3.5-turbo' : 
                      config.provider === 'GEMINI' ? 'e.g., gemini-1.5-pro' : 'Enter model name'}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">API Key</label>
        <input
          type="password"
          value={config.api_key}
          onChange={(e) => setConfig({ ...config, api_key: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required={['OPENAI', 'ANTHROPIC', 'DEEPSEEK', 'GEMINI'].includes(config.provider)}
        />
        <p className="mt-1 text-sm text-gray-500">
          {config.provider === 'OPENAI' && 'Get your API key from '}
          {config.provider === 'ANTHROPIC' && 'Get your API key from '}
          {config.provider === 'DEEPSEEK' && 'Get your API key from '}
          {config.provider === 'GEMINI' && 'Get your API key from '}
          {['OPENAI', 'ANTHROPIC', 'DEEPSEEK', 'GEMINI'].includes(config.provider) && (
            <a
              href={config.provider === 'GEMINI' ? 'https://makersuite.google.com/app/apikey' : `https://${config.provider.toLowerCase()}.com`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              {config.provider === 'GEMINI' ? 'Google AI Studio' : `${config.provider.toLowerCase()}.com`}
            </a>
          )}
        </p>
      </div>

      {config.provider === 'OLLAMA' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Base URL</label>
          <input
            type="text"
            value={config.base_url}
            onChange={(e) => setConfig({ ...config, base_url: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g., http://localhost:11434"
          />
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>
    </form>
  );
} 
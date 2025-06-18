'use client';

import { useState, useEffect } from 'react';
import { aiService } from '@/lib/api/ai';
import AIConfigForm from '@/components/ai/AIConfigForm';
import { ProtectedRoute } from '@/components/ProtectedRoute';

interface AIModelConfig {
  id: number;
  name: string;
  provider: string;
  model_name: string;
  is_active: boolean;
  parameters: Record<string, any>;
}

export default function AIConfigPage() {
  const [configs, setConfigs] = useState<AIModelConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadConfigs = async () => {
    try {
      const data = await aiService.listConfigs();
      setConfigs(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load AI configurations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfigs();
  }, []);

  const handleConfigSuccess = () => {
    loadConfigs();
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">AI Model Configuration</h1>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Configuration Form */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Configuration</h2>
                <AIConfigForm onSuccess={handleConfigSuccess} />
              </div>

              {/* Existing Configurations */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Existing Configurations</h2>
                {configs.length === 0 ? (
                  <p className="text-gray-500">No AI configurations created yet.</p>
                ) : (
                  <div className="space-y-4">
                    {configs.map((config) => (
                      <div key={config.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{config.name}</h3>
                            <p className="text-sm text-gray-600">Provider: {config.provider}</p>
                            <p className="text-sm text-gray-600">Model: {config.model_name}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              config.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {config.is_active ? 'Active' : 'Inactive'}
                            </span>
                            <button
                              onClick={async () => {
                                try {
                                  await aiService.deleteConfig(config.id.toString());
                                  loadConfigs();
                                } catch (err: any) {
                                  setError(err.response?.data?.detail || 'Failed to delete configuration');
                                }
                              }}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 
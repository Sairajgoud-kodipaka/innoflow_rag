// API Response Types
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// API Node Types
export interface ApiNodeData {
  workflow: number;
  node_type: string;
  name: string;
  config: Record<string, any>;
  position_x?: number;
  position_y?: number;
}

export interface ApiWorkflowNode {
  id: string;
  workflow_id: string;
  type: string;
  position: { x: number; y: number };
  data: ApiNodeData;
}

// API AI Types
export interface ApiAIModelConfig {
  id: string;
  name: string;
  provider: string;
  model_name: string;
  temperature?: number;
  max_tokens?: number;
  config?: Record<string, any>;
}

export interface ApiAIProvider {
  id: string;
  name: string;
  description?: string;
  models: ApiAIModel[];
}

export interface ApiAIModel {
  id: string;
  name: string;
  description?: string;
  provider: string;
  config_schema: Record<string, any>;
}

// API Task Types
export interface ApiWorkflowTask {
  id: string;
  workflow_id: string;
  node_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
  error?: string;
  created_at: string;
  updated_at: string;
}

// Type Guards
export function isApiResponse<T>(response: any): response is ApiResponse<T> {
  return response && 
    typeof response === 'object' && 
    'data' in response && 
    'status' in response &&
    typeof response.status === 'number';
}

export function isPaginatedResponse<T>(response: any): response is PaginatedResponse<T> {
  return response && 
    typeof response === 'object' && 
    'data' in response && 
    'total' in response && 
    'page' in response && 
    'page_size' in response && 
    'total_pages' in response &&
    Array.isArray(response.data);
}

export function isApiNodeData(data: any): data is ApiNodeData {
  return data && 
    typeof data === 'object' && 
    'workflow' in data && 
    'node_type' in data && 
    'name' in data && 
    'config' in data;
}

export function isApiWorkflowNode(node: any): node is ApiWorkflowNode {
  return node && 
    typeof node === 'object' && 
    'id' in node && 
    'workflow_id' in node && 
    'type' in node && 
    'position' in node && 
    'data' in node &&
    isApiNodeData(node.data);
}

export function isApiAIModelConfig(config: any): config is ApiAIModelConfig {
  return config && 
    typeof config === 'object' && 
    'id' in config && 
    'name' in config && 
    'provider' in config && 
    'model_name' in config;
}

// Type Assertions
export function assertApiResponse<T>(response: any): asserts response is ApiResponse<T> {
  if (!isApiResponse(response)) {
    throw new Error('Invalid API response format');
  }
}

export function assertApiNodeData(data: any): asserts data is ApiNodeData {
  if (!isApiNodeData(data)) {
    throw new Error('Invalid node data format');
  }
}

export function assertApiWorkflowNode(node: any): asserts node is ApiWorkflowNode {
  if (!isApiWorkflowNode(node)) {
    throw new Error('Invalid workflow node format');
  }
}

export function assertApiAIModelConfig(config: any): asserts config is ApiAIModelConfig {
  if (!isApiAIModelConfig(config)) {
    throw new Error('Invalid AI model config format');
  }
}

// Type Conversion Helpers
export function convertApiNodeToFlowNode(apiNode: ApiWorkflowNode) {
  assertApiWorkflowNode(apiNode);
  return {
    id: apiNode.id,
    type: apiNode.type,
    position: apiNode.position,
    data: {
      label: apiNode.data.name,
      name: apiNode.data.name,
      workflow: apiNode.data.workflow,
      node_type: apiNode.data.node_type,
      config: apiNode.data.config,
      position_x: apiNode.data.position_x,
      position_y: apiNode.data.position_y
    }
  };
}

export function convertApiAIConfigToFlowConfig(apiConfig: ApiAIModelConfig) {
  assertApiAIModelConfig(apiConfig);
  return {
    id: apiConfig.id,
    name: apiConfig.name,
    provider: apiConfig.provider,
    model: apiConfig.model_name,
    config: {
      temperature: apiConfig.temperature,
      max_tokens: apiConfig.max_tokens,
      ...(apiConfig.config || {})
    }
  };
} 
import { NodeProps, Node as ReactFlowNode, XYPosition } from 'reactflow';
import { ComponentType } from 'react';
import { ApiNodeData, ApiWorkflowNode, ApiAIModelConfig } from './api';

// Base interfaces for API data
export interface BaseNodeData {
  workflow: number;
  node_type: string;
  name: string;
  config: Record<string, any>;
}

// ReactFlow specific node data
export interface FlowNodeData extends BaseNodeData {
  label: string;
  description?: string;
  config_schema?: Record<string, any>;
  aiConfigs?: AIConfig[];
  inputs?: { text: string };
  template?: string;
  instructions?: string;
  apiUrl?: string;
  method?: string;
  headers?: string;
  body?: string;
  autoFetch?: boolean;
  pollingInterval?: number;
  acceptedTypes?: string;
  output?: string;
  fileName?: string;
  examples?: any[];
  functionName?: string;
  agents?: any[];
  windowSize?: number;
  bufferSize?: number;
  chains?: any[];
  routes?: any[];
  vectorDB?: string;
  dimension?: number;
  loaderType?: string;
  chunkSize?: number;
  chunkOverlap?: number;
}

// AI specific node data
export interface AINodeData extends FlowNodeData {
  model: string;
  temperature: number;
  systemMessage: string;
  provider: string;
}

// Union type for all possible node data
export type NodeData = FlowNodeData | AINodeData;

// Node type definition from API
export interface NodeTypeDefinition {
  id: string;
  name: string;
  description: string;
  config_schema: Record<string, any>;
}

// Node type with ReactFlow component
export interface NodeType extends NodeTypeDefinition {
  component: ComponentType<NodeProps>;
  type: string;
  draggable: boolean;
  selectable: boolean;
  connectable: boolean;
  deletable: boolean;
}

// API Node structure
export interface ApiNode {
  id: string;
  type: string;
  position: XYPosition;
  data: NodeData;
}

// AI Configuration types
export interface AIConfig {
  id: string;
  name: string;
  provider: string;
  model: string;
  temperature: number;
  systemMessage: string;
  config: Record<string, any>;
}

// API Model Config
export interface AIModelConfig {
  id: string;
  name: string;
  provider: string;
  model: string;
  temperature: number;
  systemMessage: string;
  config: Record<string, any>;
}

export interface AIProvider {
  id: string;
  name: string;
  description: string;
  models: AIModel[];
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
  config_schema: Record<string, any>;
}

// Type registry
export type NodeRegistry = Record<string, NodeType>;
export type CustomNodeTypes = Record<string, ComponentType<NodeProps>>;

// Type guards
export function isNodeData(data: any): data is NodeData {
  return (
    data &&
    typeof data === 'object' &&
    'workflow' in data &&
    'node_type' in data &&
    'name' in data &&
    'config' in data
  );
}

export function isAIConfig(config: any): config is AIConfig {
  return (
    config &&
    typeof config === 'object' &&
    'id' in config &&
    'name' in config &&
    'provider' in config &&
    'model' in config &&
    'temperature' in config &&
    'systemMessage' in config &&
    'config' in config
  );
}

export function isAINodeData(data: any): data is AINodeData {
  return (
    isNodeData(data) &&
    'model' in data &&
    'temperature' in data &&
    'systemMessage' in data &&
    'provider' in data
  );
}

// Conversion functions
export function convertApiNodeToFlowNode(apiNode: ApiNode): ReactFlowNode<NodeData> {
  if (!isNodeData(apiNode.data)) {
    throw new Error('Invalid node data format');
  }

  return {
    id: apiNode.id,
    type: apiNode.type,
    position: apiNode.position,
    data: apiNode.data
  };
}

export function convertFlowNodeToApiNode(node: ReactFlowNode<NodeData>): ApiNode {
  if (!isNodeData(node.data)) {
    throw new Error('Invalid node data format');
  }

  return {
    id: node.id,
    type: node.type,
    position: node.position,
    data: node.data
  };
}

export function createNewNode(
  type: string,
  position: XYPosition,
  nodeType: NodeTypeDefinition,
  workflowId: string
): ReactFlowNode<NodeData> {
  const nodeData: FlowNodeData = {
    workflow: workflowId,
    node_type: type,
    name: nodeType.name,
    label: nodeType.name,
    config: {},
    config_schema: nodeType.config_schema,
    description: nodeType.description,
    aiConfigs: []
  };

  return {
    id: `${type}-${Date.now()}`,
    type,
    position,
    data: nodeData
  };
}

export function convertApiAIConfigToFlowConfig(apiConfig: any): AIConfig {
  if (!isAIConfig(apiConfig)) {
    throw new Error('Invalid AI config format');
  }

  return {
    id: apiConfig.id,
    name: apiConfig.name,
    provider: apiConfig.provider,
    model: apiConfig.model,
    temperature: apiConfig.temperature,
    systemMessage: apiConfig.systemMessage,
    config: apiConfig.config
  };
}

// Workflow Node
export interface WorkflowNode {
  id: string;
  workflow_id: string;
  type: string;
  position: { x: number; y: number };
  data: NodeData;
}

// Workflow Task
export interface WorkflowTask {
  id: string;
  workflow_id: string;
  node_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
  error?: string;
  created_at: string;
  updated_at: string;
}

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
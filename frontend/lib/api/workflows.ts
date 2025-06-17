import apiClient from './client';

export interface WorkflowNode {
  id?: string;
  name: string;
  node_type: string;
  config: {
    [key: string]: any;
  };
  position_x: number;
  position_y: number;
  workflow?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Workflow {
  id?: string;
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  created_at?: string;
  updated_at?: string;
}

export interface WorkflowExecution {
  id?: string;
  workflow: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: {
    [key: string]: any;
  };
  error?: string;
  started_at?: string;
  completed_at?: string;
  created_at?: string;
  updated_at?: string;
}

interface WorkflowResponse<T> {
  data: T;
  [key: string]: any;
}

export interface WorkflowData {
  name: string;
  description?: string;
  definition: any;
  is_active?: boolean;
}

export interface NodeData {
  workflow: number;
  node_type: string;
  name: string;
  config: any;
  position_x?: number;
  position_y?: number;
}

export const workflowService = {
  // Workflow Management
  listWorkflows: async (): Promise<Workflow[]> => {
    const response = await apiClient.get<WorkflowResponse<Workflow[]>>('/workflows/workflows/');
    return response.data.data;
  },

  createWorkflow: async (workflow: WorkflowData): Promise<Workflow> => {
    const response = await apiClient.post<WorkflowResponse<Workflow>>('/workflows/workflows/', workflow);
    return response.data.data;
  },

  getWorkflow: async (id: string): Promise<Workflow> => {
    const response = await apiClient.get<WorkflowResponse<Workflow>>(`/workflows/workflows/${id}/`);
    return response.data.data;
  },

  updateWorkflow: async (id: string, workflow: Partial<WorkflowData>): Promise<Workflow> => {
    const response = await apiClient.patch<WorkflowResponse<Workflow>>(`/workflows/workflows/${id}/`, workflow);
    return response.data.data;
  },

  deleteWorkflow: async (id: string): Promise<void> => {
    await apiClient.delete(`/workflows/workflows/${id}/`);
  },

  executeWorkflow: async (id: string, inputData?: any): Promise<WorkflowExecution> => {
    const response = await apiClient.post<WorkflowResponse<WorkflowExecution>>(`/workflows/workflows/${id}/execute/`, inputData || {});
    return response.data.data;
  },

  // Workflow Execution Management
  listExecutions: async (): Promise<WorkflowExecution[]> => {
    const response = await apiClient.get<WorkflowResponse<WorkflowExecution[]>>('/workflows/workflow_executions/');
    return response.data.data;
  },

  getExecution: async (id: string): Promise<WorkflowExecution> => {
    const response = await apiClient.get<WorkflowResponse<WorkflowExecution>>(`/workflows/workflow_executions/${id}/`);
    return response.data.data;
  },

  // Node Management
  listNodes: async (): Promise<WorkflowNode[]> => {
    const response = await apiClient.get<WorkflowResponse<WorkflowNode[]>>('/workflows/nodes/');
    return response.data.data;
  },

  createNode: async (node: NodeData): Promise<WorkflowNode> => {
    const response = await apiClient.post<WorkflowResponse<WorkflowNode>>('/workflows/nodes/', node);
    return response.data.data;
  },

  getNode: async (id: string): Promise<WorkflowNode> => {
    const response = await apiClient.get<WorkflowResponse<WorkflowNode>>(`/workflows/nodes/${id}/`);
    return response.data.data;
  },

  updateNode: async (id: string, node: Partial<NodeData>): Promise<WorkflowNode> => {
    const response = await apiClient.patch<WorkflowResponse<WorkflowNode>>(`/workflows/nodes/${id}/`, node);
    return response.data.data;
  },

  deleteNode: async (id: string): Promise<void> => {
    await apiClient.delete(`/workflows/nodes/${id}/`);
  }
}; 
import authenticatedApiClient from './client';

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
    const response = await authenticatedApiClient.get<WorkflowResponse<Workflow[]>>('/api/workflows/workflows/');
    return response.data.data;
  },

  createWorkflow: async (workflow: WorkflowData): Promise<Workflow> => {
    const response = await authenticatedApiClient.post<WorkflowResponse<Workflow>>('/api/workflows/workflows/', workflow);
    return response.data.data;
  },

  getWorkflow: async (id: string): Promise<Workflow> => {
    const response = await authenticatedApiClient.get<WorkflowResponse<Workflow>>(`/api/workflows/workflows/${id}/`);
    return response.data.data;
  },

  updateWorkflow: async (id: string, workflow: Partial<WorkflowData>): Promise<Workflow> => {
    const response = await authenticatedApiClient.patch<WorkflowResponse<Workflow>>(`/api/workflows/workflows/${id}/`, workflow);
    return response.data.data;
  },

  deleteWorkflow: async (id: string): Promise<void> => {
    await authenticatedApiClient.delete(`/api/workflows/workflows/${id}/`);
  },

  executeWorkflow: async (id: string, inputData?: any): Promise<WorkflowExecution> => {
    const response = await authenticatedApiClient.post<WorkflowResponse<WorkflowExecution>>(`/api/workflows/workflows/${id}/execute/`, inputData || {});
    return response.data.data;
  },

  // Workflow Execution Management
  listExecutions: async (): Promise<WorkflowExecution[]> => {
    const response = await authenticatedApiClient.get<WorkflowResponse<WorkflowExecution[]>>('/api/workflows/workflow_executions/');
    return response.data.data;
  },

  getExecution: async (id: string): Promise<WorkflowExecution> => {
    const response = await authenticatedApiClient.get<WorkflowResponse<WorkflowExecution>>(`/api/workflows/workflow_executions/${id}/`);
    return response.data.data;
  },

  // Node Management
  listNodes: async (): Promise<WorkflowNode[]> => {
    const response = await authenticatedApiClient.get<WorkflowResponse<WorkflowNode[]>>('/api/workflows/nodes/');
    return response.data.data;
  },

  createNode: async (node: NodeData): Promise<WorkflowNode> => {
    const response = await authenticatedApiClient.post<WorkflowResponse<WorkflowNode>>('/api/workflows/nodes/', node);
    return response.data.data;
  },

  getNode: async (id: string): Promise<WorkflowNode> => {
    const response = await authenticatedApiClient.get<WorkflowResponse<WorkflowNode>>(`/api/workflows/nodes/${id}/`);
    return response.data.data;
  },

  updateNode: async (id: string, node: Partial<NodeData>): Promise<WorkflowNode> => {
    const response = await authenticatedApiClient.patch<WorkflowResponse<WorkflowNode>>(`/api/workflows/nodes/${id}/`, node);
    return response.data.data;
  },

  deleteNode: async (id: string): Promise<void> => {
    await authenticatedApiClient.delete(`/api/workflows/nodes/${id}/`);
  },

  // Dashboard-specific method
  listWorkflowsForDashboard: async (): Promise<any[]> => {
    try {
      const workflows = await workflowService.listWorkflows();
      
      // Transform backend data to frontend format
      return workflows.map((workflow: Workflow) => ({
        id: workflow.id,
        name: workflow.name,
        description: workflow.description || 'No description provided',
        updatedAt: new Date(workflow.updated_at || workflow.created_at || Date.now()).toLocaleDateString(),
        color: 'from-purple-500/20 to-blue-500/20', // Default gradient
        type: 'flow' as const,
        folder: 'My Workflows'
      }));
    } catch (error) {
      console.error('Failed to fetch workflows for dashboard:', error);
      // Return empty array on error to prevent crashes
      return [];
    }
  }
}; 
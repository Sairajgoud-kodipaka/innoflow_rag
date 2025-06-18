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
    const response = await authenticatedApiClient.get('/api/workflows/workflows/');
    
    // Handle different possible response structures
    let workflows: Workflow[] = [];
    
    if (response.data) {
      // If response.data.data exists (nested structure)
      if (response.data.data && Array.isArray(response.data.data)) {
        workflows = response.data.data;
      }
      // If response.data is directly an array
      else if (Array.isArray(response.data)) {
        workflows = response.data;
      }
      // If response.data.results exists (paginated structure)
      else if (response.data.results && Array.isArray(response.data.results)) {
        workflows = response.data.results;
      }
      // If response.data.workflows exists
      else if (response.data.workflows && Array.isArray(response.data.workflows)) {
        workflows = response.data.workflows;
      }
    }
    
    console.log('🔍 Raw API response structure:', {
      hasData: !!response.data,
      dataKeys: response.data ? Object.keys(response.data) : [],
      isDataArray: Array.isArray(response.data),
      dataType: typeof response.data,
      workflowsFound: workflows.length
    });
    
    return workflows;
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
      console.log('🔄 Fetching workflows for dashboard...');
      const workflows = await workflowService.listWorkflows();
      
      // Validate that workflows is an array
      if (!Array.isArray(workflows)) {
        console.warn('⚠️ Workflows is not an array:', typeof workflows, workflows);
        throw new Error(`Expected workflows array, got ${typeof workflows}`);
      }
      
      console.log('✅ Successfully fetched workflows:', workflows.length);
      console.log('📋 Workflow data sample:', workflows.slice(0, 2));
      
      // Transform backend data to frontend format with safe property access
      return workflows.map((workflow: any, index: number) => {
        console.log(`🔍 Processing workflow ${index}:`, workflow);
        
        return {
          id: workflow?.id || `workflow-${index}`,
          name: workflow?.name || `Workflow ${index + 1}`,
          description: workflow?.description || 'No description provided',
          updatedAt: workflow?.updated_at || workflow?.created_at 
            ? new Date(workflow.updated_at || workflow.created_at).toLocaleDateString()
            : new Date().toLocaleDateString(),
          color: 'from-purple-500/20 to-blue-500/20', // Default gradient
          type: 'flow' as const,
          folder: 'My Workflows'
        };
      });
    } catch (error: any) {
      // Enhanced error logging to capture all possible error details
      const errorDetails = {
        message: error?.message || 'Unknown error',
        name: error?.name || 'Error',
        status: error?.response?.status || 'No status',
        statusText: error?.response?.statusText || 'No status text',
        responseData: error?.response?.data || 'No response data',
        requestUrl: error?.config?.url || 'Unknown URL',
        requestMethod: error?.config?.method || 'Unknown method',
        isAuthError: error?.response?.status === 401,
        isNetworkError: !error?.response,
        isTimeoutError: error?.code === 'ECONNABORTED',
        fullErrorString: error?.toString ? error.toString() : String(error)
      };
      
      console.error('❌ Failed to fetch workflows for dashboard:', errorDetails);
      
      // Also log the raw error for maximum debugging info
      console.error('📋 Raw error object:', error);
      
      // If it's an auth error, provide more specific guidance
      if (error?.response?.status === 401) {
        console.warn('🔐 Authentication required - user may need to log in again');
        
        // Check what tokens are available for debugging
        if (typeof window !== 'undefined') {
          const hasLocalToken = !!localStorage.getItem('access_token');
          const hasRefreshToken = !!localStorage.getItem('refresh_token');
          console.warn('🔍 Token status:', { hasLocalToken, hasRefreshToken });
        }
      }
      
      // For network errors
      if (!error?.response) {
        console.error('🌐 Network error - backend may be unreachable');
        console.error('🔍 Check if backend server is running on expected port');
      }
      
      // For server errors
      if (error?.response?.status >= 500) {
        console.error('🚨 Server error - backend may be down');
      }
      
      // Always provide fallback data instead of throwing to prevent crashes
      console.warn('⚠️ Using fallback data due to API error');
      
      // Return enhanced mock data as fallback
      return [
        {
          id: 'demo-1',
          name: 'Demo: Simple Chatbot',
          description: 'A sample chatbot workflow with input, AI model, and output',
          updatedAt: new Date().toLocaleDateString(),
          color: 'from-purple-500/20 to-blue-500/20',
          type: 'flow' as const,
          folder: 'My Workflows'
        },
        {
          id: 'demo-2',
          name: 'Demo: Document Q&A',
          description: 'A sample RAG workflow for document question answering',
          updatedAt: new Date().toLocaleDateString(),
          color: 'from-blue-500/20 to-cyan-500/20',
          type: 'flow' as const,
          folder: 'My Workflows'
        },
        {
          id: 'demo-3',
          name: 'Demo: Text Analysis',
          description: 'Analyze text sentiment and extract insights',
          updatedAt: new Date().toLocaleDateString(),
          color: 'from-green-500/20 to-emerald-500/20',
          type: 'flow' as const,
          folder: 'My Workflows'
        }
      ];
    }
  }
}; 
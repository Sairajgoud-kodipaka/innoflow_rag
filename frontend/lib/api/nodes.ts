import apiClient from './client';
import { ApiResponse, ApiWorkflowNode } from '../types/api';
import { NodeType } from '../types/flow';

class NodeService {
  // Get all available node types
  async getNodeTypes(): Promise<NodeType[]> {
    try {
      const response = await apiClient.get<ApiResponse<NodeType[]>>('/workflows/node-types/');
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch node types:', error);
      throw new Error('Failed to fetch node types');
    }
  }

  // Get nodes for a specific workflow
  async getWorkflowNodes(workflowId: string): Promise<ApiWorkflowNode[]> {
    try {
      const response = await apiClient.get<ApiResponse<ApiWorkflowNode[]>>(`/workflows/${workflowId}/nodes/`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch workflow nodes:', error);
      throw new Error('Failed to fetch workflow nodes');
    }
  }

  // Create a new node in a workflow
  async createNode(workflowId: string, nodeData: Partial<ApiWorkflowNode>): Promise<ApiWorkflowNode> {
    try {
      const response = await apiClient.post<ApiResponse<ApiWorkflowNode>>(`/workflows/${workflowId}/nodes/`, nodeData);
      return response.data.data;
    } catch (error) {
      console.error('Failed to create node:', error);
      throw new Error('Failed to create node');
    }
  }

  // Update an existing node
  async updateNode(workflowId: string, nodeId: string, nodeData: Partial<ApiWorkflowNode>): Promise<ApiWorkflowNode> {
    try {
      const response = await apiClient.put<ApiResponse<ApiWorkflowNode>>(
        `/workflows/${workflowId}/nodes/${nodeId}/`,
        nodeData
      );
      return response.data.data;
    } catch (error) {
      console.error('Failed to update node:', error);
      throw new Error('Failed to update node');
    }
  }

  // Delete a node
  async deleteNode(workflowId: string, nodeId: string): Promise<void> {
    try {
      await apiClient.delete(`/workflows/${workflowId}/nodes/${nodeId}/`);
    } catch (error) {
      console.error('Failed to delete node:', error);
      throw new Error('Failed to delete node');
    }
  }
}

export const nodeService = new NodeService(); 
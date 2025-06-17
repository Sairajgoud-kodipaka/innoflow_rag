import apiClient from './client';

export interface TaskStatus {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  result?: any;
  error?: string;
}

export const taskStatusService = {
  getTaskStatus: async (taskId: string): Promise<TaskStatus> => {
    const response = await apiClient.get(`/api/tasks/${taskId}/status`);
    return response.data as TaskStatus;
  },

  getTaskResult: async (taskId: string): Promise<any> => {
    const response = await apiClient.get(`/api/tasks/${taskId}/result`);
    return response.data;
  },

  cancelTask: async (taskId: string): Promise<void> => {
    await apiClient.post(`/api/tasks/${taskId}/cancel`);
  },
}; 
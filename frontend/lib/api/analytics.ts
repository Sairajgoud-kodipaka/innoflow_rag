import apiClient from './client';

export interface AnalyticsData {
  total_workflows: number;
  active_workflows: number;
  completed_workflows: number;
  failed_workflows: number;
  total_executions: number;
  avg_execution_time: string;
}

export interface UsageStatistics {
  total_users: number;
  active_users: number;
  total_api_calls: number;
  average_response_time: string;
}

export const analyticsService = {
  getAnalytics: async (): Promise<AnalyticsData> => {
    const response = await apiClient.get<AnalyticsData>('/analytics/');
    return response.data;
  },

  getMonthlyReport: async () => {
    const response = await apiClient.get('/analytics/monthly_report/');
    return response.data;
  },

  getNodePerformanceStats: async () => {
    const response = await apiClient.get('/analytics/node_performance_stats/');
    return response.data;
  },

  getSystemPerformance: async () => {
    const response = await apiClient.get('/analytics/system_performance/');
    return response.data;
  },

  getSystemPerformanceReport: async () => {
    const response = await apiClient.get('/analytics/system_performance_report/');
    return response.data;
  },

  getUsageStatistics: async (): Promise<UsageStatistics> => {
    const response = await apiClient.get<UsageStatistics>('/analytics/usage_statistics/');
    return response.data;
  },

  getUserActivityReport: async () => {
    const response = await apiClient.get('/analytics/user_activity_report/');
    return response.data;
  },

  getWorkflowExecutionStats: async () => {
    const response = await apiClient.get('/analytics/workflow_execution_stats/');
    return response.data;
  },

  getWorkflowPerformance: async () => {
    const response = await apiClient.get('/analytics/workflow_performance/');
    return response.data;
  },

  getWorkflowPerformanceChart: async () => {
    const response = await apiClient.get('/analytics/workflow_performance_chart/');
    return response.data;
  }
}; 
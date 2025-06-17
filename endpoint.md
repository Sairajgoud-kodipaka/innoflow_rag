# 🚀 InnoFlow Frontend-Backend Endpoint Implementation Guide

## 📋 **Overview**
This document maps frontend requirements to actual backend endpoints and provides implementation guidance for the 1-day emergency integration.

---

## 🎯 **Implementation Strategy**

**✅ PRIMARY**: Frontend adapts to existing backend API structure  
**🆕 SECONDARY**: Add minimal new backend endpoints only when absolutely necessary

---

## 🔐 **1. Authentication Implementation**

### **Frontend Service: `lib/api/auth.ts`**
```typescript
export const authService = {
  // ✅ CHANGE: Use backend URLs instead of /api/
  signup: (userData) => apiClient.post('/users/register/', userData),
  login: (credentials) => apiClient.post('/auth/login/', credentials),
  logout: () => apiClient.post('/auth/logout/'),
  getCurrentUser: () => apiClient.get('/auth/user/'),
  updateProfile: (data) => apiClient.patch('/auth/user/', data),
  
  // ✅ NEW: Add missing auth features
  changePassword: (data) => apiClient.post('/auth/password/change/', data),
  resetPassword: (email) => apiClient.post('/auth/password/reset/', { email }),
  googleLogin: (token) => apiClient.post('/auth/social/google/', { access_token: token }),
  githubLogin: (token) => apiClient.post('/auth/social/github/', { access_token: token }),
};
```

### **Required Changes:**
- ❌ Remove: `POST /api/signup`, `POST /api/login`, `POST /api/logout`
- ✅ Add: Use actual backend endpoints listed above
- ✅ Add: Social login methods for Google/GitHub

---

## ⚙️ **2. Workflow Management Implementation**

### **Frontend Service: `lib/api/workflows.ts`**
```typescript
export const workflowService = {
  // ✅ CHANGE: Use proper workflow endpoints
  getWorkflows: () => apiClient.get('/workflows/workflows/'),
  createWorkflow: (data) => apiClient.post('/workflows/workflows/', data),
  getWorkflow: (id) => apiClient.get(`/workflows/workflows/${id}/`),
  updateWorkflow: (id, data) => apiClient.patch(`/workflows/workflows/${id}/`, data),
  deleteWorkflow: (id) => apiClient.delete(`/workflows/workflows/${id}/`),
  
  // ✅ CHANGE: Replace simplified start-workflow with proper execution
  executeWorkflow: (id, input = {}) => apiClient.post(`/workflows/workflows/${id}/execute/`, input),
  
  // ✅ NEW: Add execution tracking
  getExecutions: () => apiClient.get('/workflows/workflow_executions/'),
  getExecution: (id) => apiClient.get(`/workflows/workflow_executions/${id}/`),
  
  // ✅ NEW: Add workflow persistence (replace save/load)
  saveWorkflow: (id, data) => workflowService.updateWorkflow(id, data),
  loadWorkflow: (id) => workflowService.getWorkflow(id),
};
```

### **Required Changes:**
- ❌ Remove: `POST /api/start-workflow`, `GET /api/get-output`, `POST /api/save-workflow`, `GET /api/load-workflow`
- ✅ Replace: With proper workflow CRUD and execution endpoints
- ✅ Add: Execution tracking and status monitoring

---

## 🧩 **3. Workflow Nodes Implementation**

### **🆕 NEW Frontend Service: `lib/api/nodes.ts`**
```typescript
export const nodeService = {
  // ✅ CHANGE: Replace simple create-node with full CRUD
  getNodes: () => apiClient.get('/workflows/nodes/'),
  createNode: (data) => apiClient.post('/workflows/nodes/', data),
  getNode: (id) => apiClient.get(`/workflows/nodes/${id}/`),
  updateNode: (id, data) => apiClient.patch(`/workflows/nodes/${id}/`, data),
  deleteNode: (id) => apiClient.delete(`/workflows/nodes/${id}/`),
  
  // 🆕 BACKEND: New endpoints needed (add to backend)
  getWorkflowNodes: (workflowId) => apiClient.get(`/workflows/workflows/${workflowId}/nodes/`),
  getNodeTypes: () => apiClient.get('/workflows/node-types/'),
  validateNodeConfig: (data) => apiClient.post('/workflows/nodes/validate/', data),
};
```

### **Required Backend Changes:**
```python
# workflows/urls.py - ADD THESE
urlpatterns = [
    # Existing patterns...
    path('workflows/<int:workflow_id>/nodes/', WorkflowNodesView.as_view(), name='workflow-nodes'),
    path('node-types/', NodeTypesView.as_view(), name='node-types'),
    path('nodes/validate/', ValidateNodeView.as_view(), name='validate-node'),
]
```

### **Required Changes:**
- ❌ Remove: `POST /api/create-node`, `PATCH /api/update-node`
- ✅ Replace: With full node CRUD system
- 🆕 Add: 3 new backend endpoints for frontend needs

---

## 🤖 **4. AI Integration Implementation**

### **🆕 NEW Frontend Service: `lib/api/ai.ts`**
```typescript
export const aiService = {
  // ✅ CHANGE: Replace simple set-params with full AI management
  getConfigs: () => apiClient.get('/ai/aimodelconfig/'),
  createConfig: (data) => apiClient.post('/ai/aimodelconfig/', data),
  updateConfig: (id, data) => apiClient.patch(`/ai/aimodelconfig/${id}/`, data),
  deleteConfig: (id) => apiClient.delete(`/ai/aimodelconfig/${id}/`),
  
  // ✅ NEW: Model comparison features
  getComparisons: () => apiClient.get('/ai/modelcomparison/'),
  createComparison: (data) => apiClient.post('/ai/modelcomparison/', data),
  compareModels: (data) => apiClient.post('/ai/modelcomparison/compare-models/', data),
  getComparisonResults: (id) => apiClient.get(`/ai/modelcomparison/${id}/results/`),
  
  // 🆕 BACKEND: New endpoints needed for frontend UX
  getProviders: () => apiClient.get('/ai/providers/'),
  getProviderModels: (provider) => apiClient.get(`/ai/providers/${provider}/models/`),
  testProvider: (data) => apiClient.post('/ai/providers/test/', data),
};
```

### **Required Backend Changes:**
```python
# ai_integration/urls.py - ADD THESE
urlpatterns = [
    # Existing patterns...
    path('providers/', ProvidersView.as_view(), name='ai-providers'),
    path('providers/<str:provider>/models/', ProviderModelsView.as_view(), name='provider-models'),
    path('providers/test/', TestProviderView.as_view(), name='test-provider'),
]
```

### **Required Changes:**
- ❌ Remove: `POST /api/set-params`
- ✅ Replace: With comprehensive AI configuration system
- 🆕 Add: 3 new backend endpoints for provider management

---

## 📊 **5. Analytics Implementation**

### **🆕 NEW Frontend Service: `lib/api/analytics.ts`**
```typescript
export const analyticsService = {
  // ✅ NEW: Complete analytics system (was missing entirely)
  getAnalytics: () => apiClient.get('/analytics/'),
  createAnalytics: (data) => apiClient.post('/analytics/', data),
  
  // Performance and reporting
  getWorkflowPerformance: () => apiClient.get('/analytics/workflow_performance/'),
  getUsageStats: () => apiClient.get('/analytics/usage_statistics/'),
  getSystemPerformance: () => apiClient.get('/analytics/system_performance/'),
  getMonthlyReport: () => apiClient.get('/analytics/monthly_report/'),
  getExecutionStats: () => apiClient.get('/analytics/workflow_execution_stats/'),
  getNodePerformance: () => apiClient.get('/analytics/node_performance_stats/'),
  getPerformanceChart: () => apiClient.get('/analytics/workflow_performance_chart/'),
  getUserActivity: () => apiClient.get('/analytics/user_activity_report/'),
  
  // Individual analytics
  getAnalytic: (id) => apiClient.get(`/analytics/${id}/`),
  updateAnalytic: (id, data) => apiClient.patch(`/analytics/${id}/`, data),
  deleteAnalytic: (id) => apiClient.delete(`/analytics/${id}/`),
};
```

### **Required Changes:**
- ✅ Add: Complete analytics service (was completely missing)
- ✅ Use: All existing backend analytics endpoints
- 🎯 Priority: Medium (implement after core workflow features)

---

## 📋 **6. Task Status Implementation**

### **🆕 NEW Frontend Service: `lib/api/taskStatus.ts`**
```typescript
export const taskStatusService = {
  // ✅ NEW: Task status tracking (was missing entirely)
  getStatuses: () => apiClient.get('/taskstatus/'),
  createStatus: (data) => apiClient.post('/taskstatus/', data),
  getStatus: (id) => apiClient.get(`/taskstatus/${id}/`),
  updateStatus: (id, data) => apiClient.patch(`/taskstatus/${id}/`, data),
  deleteStatus: (id) => apiClient.delete(`/taskstatus/${id}/`),
  
  // 🆕 BACKEND: New endpoint for workflow-specific statuses
  getWorkflowStatuses: (workflowId) => apiClient.get(`/taskstatus/workflow/${workflowId}/`),
};
```

### **Required Backend Changes:**
```python
# Add to appropriate app's urls.py
urlpatterns = [
    # Existing patterns...
    path('taskstatus/workflow/<int:workflow_id>/', WorkflowTaskStatusView.as_view(), name='workflow-task-status'),
]
```

### **Required Changes:**
- ✅ Add: Complete task status service (was completely missing)
- 🆕 Add: 1 new backend endpoint for workflow-specific task statuses

---

## 👥 **7. User Management Implementation**

### **🆕 NEW Frontend Service: `lib/api/users.ts`**
```typescript
export const userService = {
  // ✅ NEW: User profile management
  getMe: () => apiClient.get('/users/me/'),
  getProfiles: () => apiClient.get('/users/profiles/'),
  createProfile: (data) => apiClient.post('/users/profiles/', data),
  getMyProfile: () => apiClient.get('/users/profiles/me/'),
  getProfile: (id) => apiClient.get(`/users/profiles/${id}/`),
  updateProfile: (id, data) => apiClient.patch(`/users/profiles/${id}/`, data),
  deleteProfile: (id) => apiClient.delete(`/users/profiles/${id}/`),
  
  // Email verification
  verifyEmail: (data) => apiClient.post('/users/email/verify/', data),
  confirmEmail: (data) => apiClient.post('/users/email/verify/confirm/', data),
  
  // Token management
  createToken: (data) => apiClient.post('/users/token/', data),
};
```

### **Required Changes:**
- ✅ Add: Complete user management service (was missing)
- ✅ Use: All existing backend user endpoints

---

## 🔑 **8. Token Management Implementation**

### **Update Frontend Service: `lib/api/auth.ts` (Add to existing)**
```typescript
// Add to existing authService
export const authService = {
  // ... existing methods ...
  
  // ✅ NEW: JWT token management
  getTokenPair: (credentials) => apiClient.post('/token/', credentials),
  refreshToken: (refreshToken) => apiClient.post('/token/refresh/', { refresh: refreshToken }),
};
```

### **Required Changes:**
- ✅ Add: JWT token management to existing auth service

---

## 🔧 **Updated Base API Client**

### **Frontend: `lib/api/client.ts`**
```typescript
// ✅ CHANGE: Remove /api prefix, let services handle their own paths
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

class APIClient {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL, // No /api suffix
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  // ... rest of implementation
}
```

### **Required Changes:**
- ❌ Remove: `/api` base path assumption
- ✅ Change: Let each service specify its own path prefix

---

## 📁 **Final Frontend API Structure**

```
lib/api/
├── client.ts           # ✅ UPDATE: Remove /api prefix
├── auth.ts             # ✅ UPDATE: Use /auth/ and /users/register/
├── workflows.ts        # ✅ UPDATE: Use /workflows/workflows/
├── nodes.ts            # 🆕 NEW: Use /workflows/nodes/
├── ai.ts               # 🆕 NEW: Use /ai/aimodelconfig/ and /ai/modelcomparison/
├── analytics.ts        # 🆕 NEW: Use /analytics/
├── taskStatus.ts       # 🆕 NEW: Use /taskstatus/
├── users.ts            # 🆕 NEW: Use /users/
└── types.ts            # 🆕 NEW: TypeScript definitions
```

---

## 🆕 **Required Backend Changes (Minimal)**

### **High Priority (Add Today)**
```python
# workflows/urls.py
path('workflows/<int:workflow_id>/nodes/', WorkflowNodesView.as_view()),
path('node-types/', NodeTypesView.as_view()),

# ai_integration/urls.py  
path('providers/', ProvidersView.as_view()),
path('providers/<str:provider>/models/', ProviderModelsView.as_view()),
```

### **Medium Priority (Add Tomorrow)**
```python
# ai_integration/urls.py
path('providers/test/', TestProviderView.as_view()),

# workflows/urls.py
path('templates/', WorkflowTemplatesView.as_view()),
path('nodes/validate/', ValidateNodeView.as_view()),

# taskstatus/urls.py (or appropriate app)
path('taskstatus/workflow/<int:workflow_id>/', WorkflowTaskStatusView.as_view()),
```

---

## ⏰ **Implementation Timeline**

### **Today (Critical - 6 hours)**
1. **Hour 1**: Update `client.ts` and `auth.ts`
2. **Hour 2**: Update `workflows.ts` and create `nodes.ts`
3. **Hour 3**: Create `ai.ts` service
4. **Hour 4**: Add 4 high-priority backend endpoints
5. **Hour 5**: Test all critical API integrations
6. **Hour 6**: Create basic frontend components using new services

### **Tomorrow (Enhancement - 4 hours)**
1. **Hour 1**: Create `analytics.ts` and `taskStatus.ts`
2. **Hour 2**: Create `users.ts` service
3. **Hour 3**: Add medium-priority backend endpoints
4. **Hour 4**: Complete dashboard integration

---

## 📊 **Implementation Summary**

### **Frontend Changes:**
- ✅ **Update 2 existing services**: auth.ts, workflows.ts
- 🆕 **Create 5 new services**: nodes.ts, ai.ts, analytics.ts, taskStatus.ts, users.ts
- ✅ **Update base client**: Remove /api prefix assumption

### **Backend Changes:**
- 🆕 **Add 4 high-priority endpoints**: workflow nodes, node types, AI providers, provider models
- 🆕 **Add 4 medium-priority endpoints**: provider testing, workflow templates, node validation, workflow task status

### **Result:**
- **Frontend API Coverage**: 95%+
- **Backend Impact**: 8 new endpoints vs 70+ existing (11% increase)
- **Integration Success**: Complete workflow automation platform

**Strategy Success**: Frontend adapts to robust backend with minimal backend changes! 🎯




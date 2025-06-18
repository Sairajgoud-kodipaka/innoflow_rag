# 🔗 Frontend-Backend Endpoint Mapping

## 🎯 **Strategy: Frontend Adapts to Backend**

**Primary Approach**: Frontend will be updated to use existing backend API routes.  
**Secondary Approach**: Only add new backend endpoints for frontend-specific features that don't exist.

---

## 🔐 **Authentication Endpoints**

### **✅ Use Existing Backend Routes**
| Frontend Need | Backend Endpoint | Frontend API Service | Status |
|--------------|------------------|---------------------|--------|
| User Registration | `POST /users/register/` | `authService.signup()` | ✅ **Adapt Frontend** |
| User Login | `POST /auth/login/` | `authService.login()` | ✅ **Adapt Frontend** |
| User Logout | `POST /auth/logout/` | `authService.logout()` | ✅ **Adapt Frontend** |
| Get Current User | `GET /auth/user/` | `authService.getCurrentUser()` | ✅ **Adapt Frontend** |
| Update Profile | `PATCH /auth/user/` | `authService.updateProfile()` | ✅ **Adapt Frontend** |
| Change Password | `POST /auth/password/change/` | `authService.changePassword()` | ✅ **Adapt Frontend** |
| Password Reset | `POST /auth/password/reset/` | `authService.resetPassword()` | ✅ **Adapt Frontend** |
| Google Login | `POST /auth/social/google/` | `authService.googleLogin()` | ✅ **Adapt Frontend** |
| GitHub Login | `POST /auth/social/github/` | `authService.githubLogin()` | ✅ **Adapt Frontend** |

### **🆕 New Backend Endpoints Needed (Rare Cases)**
| Frontend Need | New Backend Endpoint | Reason | Priority |
|--------------|---------------------|--------|----------|
| Email Verification Status | `GET /users/email/verify/status/` | Frontend needs to check if email is verified | 🟡 Low |

---

## ⚙️ **Workflow Management Endpoints**

### **✅ Use Existing Backend Routes**
| Frontend Need | Backend Endpoint | Frontend API Service | Status |
|--------------|------------------|---------------------|--------|
| List Workflows | `GET /workflows/workflows/` | `workflowService.getWorkflows()` | ✅ **Adapt Frontend** |
| Create Workflow | `POST /workflows/workflows/` | `workflowService.createWorkflow()` | ✅ **Adapt Frontend** |
| Get Workflow | `GET /workflows/workflows/{id}/` | `workflowService.getWorkflow(id)` | ✅ **Adapt Frontend** |
| Update Workflow | `PATCH /workflows/workflows/{id}/` | `workflowService.updateWorkflow(id)` | ✅ **Adapt Frontend** |
| Delete Workflow | `DELETE /workflows/workflows/{id}/` | `workflowService.deleteWorkflow(id)` | ✅ **Adapt Frontend** |
| Execute Workflow | `POST /workflows/workflows/{id}/execute/` | `workflowService.executeWorkflow(id)` | ✅ **Adapt Frontend** |
| List Executions | `GET /workflows/workflow_executions/` | `workflowService.getExecutions()` | ✅ **Adapt Frontend** |
| Get Execution | `GET /workflows/workflow_executions/{id}/` | `workflowService.getExecution(id)` | ✅ **Adapt Frontend** |

### **🆕 New Backend Endpoints Needed (Rare Cases)**
| Frontend Need | New Backend Endpoint | Reason | Priority |
|--------------|---------------------|--------|----------|
| Workflow Templates | `GET /workflows/templates/` | Frontend needs pre-built workflow templates | 🟡 Medium |
| Duplicate Workflow | `POST /workflows/workflows/{id}/duplicate/` | Frontend UX feature for copying workflows | 🟡 Low |

---

## 🧩 **Workflow Node Endpoints**

### **✅ Use Existing Backend Routes**
| Frontend Need | Backend Endpoint | Frontend API Service | Status |
|--------------|------------------|---------------------|--------|
| List All Nodes | `GET /workflows/nodes/` | `nodeService.getNodes()` | ✅ **Adapt Frontend** |
| Create Node | `POST /workflows/nodes/` | `nodeService.createNode()` | ✅ **Adapt Frontend** |
| Get Node | `GET /workflows/nodes/{id}/` | `nodeService.getNode(id)` | ✅ **Adapt Frontend** |
| Update Node | `PATCH /workflows/nodes/{id}/` | `nodeService.updateNode(id)` | ✅ **Adapt Frontend** |
| Delete Node | `DELETE /workflows/nodes/{id}/` | `nodeService.deleteNode(id)` | ✅ **Adapt Frontend** |

### **🆕 New Backend Endpoints Needed (Rare Cases)**
| Frontend Need | New Backend Endpoint | Reason | Priority |
|--------------|---------------------|--------|----------|
| Get Nodes by Workflow | `GET /workflows/workflows/{id}/nodes/` | Frontend needs workflow-specific nodes | 🔴 **High** |
| Node Types/Categories | `GET /workflows/node-types/` | Frontend needs available node types for palette | 🔴 **High** |
| Validate Node Config | `POST /workflows/nodes/validate/` | Frontend needs to validate node configuration | 🟡 Medium |

---

## 🤖 **AI Integration Endpoints**

### **✅ Use Existing Backend Routes**
| Frontend Need | Backend Endpoint | Frontend API Service | Status |
|--------------|------------------|---------------------|--------|
| List AI Configs | `GET /ai/aimodelconfig/` | `aiService.getConfigs()` | ✅ **Adapt Frontend** |
| Create AI Config | `POST /ai/aimodelconfig/` | `aiService.createConfig()` | ✅ **Adapt Frontend** |
| Update AI Config | `PATCH /ai/aimodelconfig/{id}/` | `aiService.updateConfig(id)` | ✅ **Adapt Frontend** |
| Delete AI Config | `DELETE /ai/aimodelconfig/{id}/` | `aiService.deleteConfig(id)` | ✅ **Adapt Frontend** |
| List Comparisons | `GET /ai/modelcomparison/` | `aiService.getComparisons()` | ✅ **Adapt Frontend** |
| Create Comparison | `POST /ai/modelcomparison/` | `aiService.createComparison()` | ✅ **Adapt Frontend** |
| Compare Models | `POST /ai/modelcomparison/compare-models/` | `aiService.compareModels()` | ✅ **Adapt Frontend** |
| Get Results | `GET /ai/modelcomparison/{id}/results/` | `aiService.getResults(id)` | ✅ **Adapt Frontend** |

### **🆕 New Backend Endpoints Needed (Rare Cases)**
| Frontend Need | New Backend Endpoint | Reason | Priority |
|--------------|---------------------|--------|----------|
| Available Providers | `GET /ai/providers/` | Frontend needs list of supported AI providers | 🔴 **High** |
| Test Provider Config | `POST /ai/providers/test/` | Frontend needs to test API key validity | 🟠 Medium |
| Get Provider Models | `GET /ai/providers/{provider}/models/` | Frontend needs available models per provider | 🔴 **High** |

---

## 📊 **Analytics Endpoints**

### **✅ Use Existing Backend Routes**
| Frontend Need | Backend Endpoint | Frontend API Service | Status |
|--------------|------------------|---------------------|--------|
| General Analytics | `GET /analytics/` | `analyticsService.getAnalytics()` | ✅ **Adapt Frontend** |
| Workflow Performance | `GET /analytics/workflow_performance/` | `analyticsService.getWorkflowPerformance()` | ✅ **Adapt Frontend** |
| Usage Statistics | `GET /analytics/usage_statistics/` | `analyticsService.getUsageStats()` | ✅ **Adapt Frontend** |
| System Performance | `GET /analytics/system_performance/` | `analyticsService.getSystemPerformance()` | ✅ **Adapt Frontend** |
| Monthly Report | `GET /analytics/monthly_report/` | `analyticsService.getMonthlyReport()` | ✅ **Adapt Frontend** |
| Execution Stats | `GET /analytics/workflow_execution_stats/` | `analyticsService.getExecutionStats()` | ✅ **Adapt Frontend** |
| Node Performance | `GET /analytics/node_performance_stats/` | `analyticsService.getNodePerformance()` | ✅ **Adapt Frontend** |
| Performance Chart | `GET /analytics/workflow_performance_chart/` | `analyticsService.getPerformanceChart()` | ✅ **Adapt Frontend** |
| User Activity | `GET /analytics/user_activity_report/` | `analyticsService.getUserActivity()` | ✅ **Adapt Frontend** |

### **🆕 New Backend Endpoints Needed (Rare Cases)**
| Frontend Need | New Backend Endpoint | Reason | Priority |
|--------------|---------------------|--------|----------|
| Real-time Metrics | `GET /analytics/realtime/` | Frontend dashboard needs live data | 🟠 Medium |
| Custom Date Range | `GET /analytics/custom-range/` | Frontend needs flexible date filtering | 🟡 Low |

---

## 📋 **Task Status Endpoints**

### **✅ Use Existing Backend Routes**
| Frontend Need | Backend Endpoint | Frontend API Service | Status |
|--------------|------------------|---------------------|--------|
| List Task Status | `GET /taskstatus/` | `taskStatusService.getStatuses()` | ✅ **Adapt Frontend** |
| Create Task Status | `POST /taskstatus/` | `taskStatusService.createStatus()` | ✅ **Adapt Frontend** |
| Get Task Status | `GET /taskstatus/{id}/` | `taskStatusService.getStatus(id)` | ✅ **Adapt Frontend** |
| Update Task Status | `PATCH /taskstatus/{id}/` | `taskStatusService.updateStatus(id)` | ✅ **Adapt Frontend** |
| Delete Task Status | `DELETE /taskstatus/{id}/` | `taskStatusService.deleteStatus(id)` | ✅ **Adapt Frontend** |

### **🆕 New Backend Endpoints Needed (Rare Cases)**
| Frontend Need | New Backend Endpoint | Reason | Priority |
|--------------|---------------------|--------|----------|
| Task Status by Workflow | `GET /taskstatus/workflow/{id}/` | Frontend needs workflow-specific task statuses | 🟠 Medium |

---

## 🔑 **Token Management Endpoints**

### **✅ Use Existing Backend Routes**
| Frontend Need | Backend Endpoint | Frontend API Service | Status |
|--------------|------------------|---------------------|--------|
| Get JWT Token | `POST /token/` | `authService.getToken()` | ✅ **Adapt Frontend** |
| Refresh Token | `POST /token/refresh/` | `authService.refreshToken()` | ✅ **Adapt Frontend** |

---

## 👥 **User Management Endpoints**

### **✅ Use Existing Backend Routes**
| Frontend Need | Backend Endpoint | Frontend API Service | Status |
|--------------|------------------|---------------------|--------|
| Get User Profile | `GET /users/me/` | `userService.getProfile()` | ✅ **Adapt Frontend** |
| List User Profiles | `GET /users/profiles/` | `userService.getProfiles()` | ✅ **Adapt Frontend** |
| Create Profile | `POST /users/profiles/` | `userService.createProfile()` | ✅ **Adapt Frontend** |
| Update Profile | `PATCH /users/profiles/{id}/` | `userService.updateProfile(id)` | ✅ **Adapt Frontend** |
| Get My Profile | `GET /users/profiles/me/` | `userService.getMyProfile()` | ✅ **Adapt Frontend** |
| Email Verification | `POST /users/email/verify/` | `userService.verifyEmail()` | ✅ **Adapt Frontend** |
| Confirm Email | `POST /users/email/verify/confirm/` | `userService.confirmEmail()` | ✅ **Adapt Frontend** |

---

## 🆕 **Required New Backend Endpoints**

### **🔴 High Priority (Add to Backend)**
```python
# workflows/urls.py
urlpatterns = [
    # ... existing patterns ...
    path('workflows/<int:workflow_id>/nodes/', views.WorkflowNodesView.as_view(), name='workflow-nodes'),
    path('node-types/', views.NodeTypesView.as_view(), name='node-types'),
]

# ai_integration/urls.py  
urlpatterns = [
    # ... existing patterns ...
    path('providers/', views.ProvidersView.as_view(), name='ai-providers'),
    path('providers/<str:provider>/models/', views.ProviderModelsView.as_view(), name='provider-models'),
]
```

### **🟠 Medium Priority (Add Later)**
```python
# ai_integration/urls.py
urlpatterns = [
    # ... existing patterns ...
    path('providers/test/', views.TestProviderView.as_view(), name='test-provider'),
]

# workflows/urls.py
urlpatterns = [
    # ... existing patterns ...
    path('templates/', views.WorkflowTemplatesView.as_view(), name='workflow-templates'),
]
```

---

## 📁 **Updated Frontend API Service Structure**

```
lib/api/
├── client.ts              # Base API client with correct URL handling
├── auth.ts                # Authentication endpoints
├── workflows.ts           # Workflow management endpoints  
├── nodes.ts               # Workflow node endpoints
├── ai.ts                  # AI integration endpoints
├── analytics.ts           # Analytics endpoints
├── taskStatus.ts          # Task status endpoints
├── users.ts               # User management endpoints
└── types.ts               # TypeScript type definitions
```

---

## 🔧 **Frontend API Client Base Configuration**

```typescript
// lib/api/client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// Services will handle their own path prefixes:
// authService -> '/auth/'
// workflowService -> '/workflows/'  
// aiService -> '/ai/'
// analyticsService -> '/analytics/'
// userService -> '/users/'
// taskStatusService -> '/taskstatus/'
```

---

## 📊 **Implementation Summary**

### **Frontend Changes Required:**
- ✅ **Update 8 API service files** to use correct backend URLs
- ✅ **Add 3 new API service files** (nodes.ts, analytics.ts, taskStatus.ts)
- ✅ **Update base URL configuration** in client.ts
- ✅ **Add TypeScript types** for all API responses

### **Backend Changes Required:**
- 🆕 **Add 4 high-priority endpoints** for frontend-specific needs
- 🆕 **Add 3 medium-priority endpoints** for enhanced UX features
- ✅ **Keep all existing 70+ endpoints** unchanged

### **Result:**
- **Frontend Coverage**: 95%+ of needed functionality
- **Backend Impact**: Minimal (7 new endpoints vs 70+ existing)
- **Integration Effort**: 1 day for critical features, 2-3 days for complete implementation

**Strategy Success**: Frontend adapts to backend architecture with minimal backend changes! 🎯
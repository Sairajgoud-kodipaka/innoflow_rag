### **Updated File Structure to Create:**
```
frontend/lib/api/
├── client.ts         ✅ Base API client
├── auth.ts           ✅ Authentication service (comprehensive)
├── users.ts          ✅ User management service  
├── ai.ts             ✅ AI integration service (full CRUD)
├── workflows.ts      # 🚨 CRITICAL: Frontend Integration Plan for Cursor AI
## **OBJECTIVE: Make InnoFlow Application Fully Functional - NO BACKEND CHANGES**

---

### **STEP 19: Create Analytics Service (BONUS)**

```typescript
// lib/api/analytics.ts
import apiClient from './client';

export const analyticsService = {
  // General Analytics
  getAnalytics: async () => {
    const response = await apiClient.get('/analytics/');
    return response.data;
  },

  createAnalytics: async (data: any) => {
    const response = await apiClient.post('/analytics/', data);
    return response.data;
  },

  getAnalyticsById: async (id: string) => {
    const response = await apiClient.get(`/analytics/${id}/`);
    return response.data;
  },

  updateAnalytics: async (id: string, data: any) => {
    const response = await apiClient.put(`/analytics/${id}/`, data);
    return response.data;
  },

  partialUpdateAnalytics: async (id: string, data: any) => {
    const response = await apiClient.patch(`/analytics/${id}/`, data);
    return response.data;
  },

  deleteAnalytics: async (id: string) => {
    await apiClient.delete(`/analytics/${id}/`);
  },

  // Specialized Analytics Endpoints
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

  getUsageStatistics: async () => {
    const response = await apiClient.get('/analytics/usage_statistics/');
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
```

---

## 📋 **PROJECT CONTEXT FOR CURSOR AI**

### **Current Situation:**
- ✅ Backend Django API is COMPLETE and RUNNING on `http://localhost:8000`
- ✅ PostgreSQL database is CONNECTED with all tables created
- ✅ Frontend UI pages are BUILT but NOT CONNECTED to backend
- 🚨 **CRITICAL**: Need to connect frontend to backend APIs in ONE DAY

### **Strict Constraints:**
- **NO BACKEND MODIFICATIONS ALLOWED** - Backend is frozen and complete
- **FRONTEND ONLY CHANGES** - All integration must happen in frontend
- **USE EXISTING API ENDPOINTS** - Must adapt to current backend structure
- **COMPLETE TODAY** - This is time-critical for project completion

---

## 🎯 **EXACT API ENDPOINTS TO USE (From Working Backend)**

### **Base Configuration:**
```typescript
// CRITICAL: Use this exact base URL
const API_BASE_URL = 'http://localhost:8000';
```

### **Authentication Endpoints:**
```typescript
POST /auth/login/                    // Login user
GET  /auth/logout/                   // Logout user (GET method)
POST /auth/logout/                   // Logout user (POST method)
GET  /auth/user/                     // Get current user
PUT  /auth/user/                     // Update current user
PATCH /auth/user/                    // Partial update current user
POST /auth/password/change/          // Change password
POST /auth/password/reset/           // Password reset request
POST /auth/password/reset/confirm/   // Password reset confirm
POST /auth/social/github/            // GitHub social login
POST /auth/social/google/            // Google social login
```

### **User Management Endpoints:**
```typescript
POST /users/register/                // Register new user
POST /users/token/                   // Get JWT token
GET  /users/me/                      // Get current user profile
GET  /users/profiles/                // List user profiles
POST /users/profiles/                // Create user profile
GET  /users/profiles/me/             // Get my profile details
GET  /users/profiles/{id}/           // Get specific profile
PUT  /users/profiles/{id}/           // Update profile
PATCH /users/profiles/{id}/          // Partial update profile
DELETE /users/profiles/{id}/         // Delete profile
POST /users/email/verify/            // Request email verification
POST /users/email/verify/confirm/    // Confirm email verification
POST /users/password/reset/          // Password reset request
POST /users/password/reset/confirm/  // Password reset confirm
```

### **AI Integration Endpoints:**
```typescript
GET    /ai/aimodelconfig/            // List AI configs
POST   /ai/aimodelconfig/            // Create AI config
GET    /ai/aimodelconfig/{id}/       // Get AI config
PUT    /ai/aimodelconfig/{id}/       // Update AI config
PATCH  /ai/aimodelconfig/{id}/       // Partial update AI config
DELETE /ai/aimodelconfig/{id}/       // Delete AI config

GET    /ai/modelcomparison/          // List model comparisons
POST   /ai/modelcomparison/          // Create model comparison
POST   /ai/modelcomparison/compare-models/  // Compare models
GET    /ai/modelcomparison/{id}/     // Get comparison
PUT    /ai/modelcomparison/{id}/     // Update comparison
PATCH  /ai/modelcomparison/{id}/     // Partial update comparison
DELETE /ai/modelcomparison/{id}/     // Delete comparison
GET    /ai/modelcomparison/{id}/results/  // Get comparison results
```

### **Workflow Management Endpoints:**
```typescript
GET    /workflows/workflows/         // List workflows
POST   /workflows/workflows/         // Create workflow
GET    /workflows/workflows/{id}/    // Get workflow
PUT    /workflows/workflows/{id}/    // Update workflow
PATCH  /workflows/workflows/{id}/    // Partial update workflow
DELETE /workflows/workflows/{id}/    // Delete workflow
POST   /workflows/workflows/{id}/execute/  // Execute workflow

GET    /workflows/workflow_executions/     // List workflow executions
GET    /workflows/workflow_executions/{id}/ // Get execution details

GET    /workflows/nodes/             // List nodes
POST   /workflows/nodes/             // Create node
GET    /workflows/nodes/{id}/        // Get node
PUT    /workflows/nodes/{id}/        // Update node
PATCH  /workflows/nodes/{id}/        // Partial update node
DELETE /workflows/nodes/{id}/        // Delete node
```

### **Task Status Endpoints:**
```typescript
GET    /taskstatus/                  // List task statuses
POST   /taskstatus/                  // Create task status
GET    /taskstatus/{id}/             // Get task status
PUT    /taskstatus/{id}/             // Update task status
PATCH  /taskstatus/{id}/             // Partial update task status
DELETE /taskstatus/{id}/             // Delete task status
```

### **Analytics Endpoints:**
```typescript
GET    /analytics/                   // General analytics
POST   /analytics/                   // Create analytics entry
GET    /analytics/monthly_report/    // Monthly analytics report
GET    /analytics/node_performance_stats/     // Node performance stats
GET    /analytics/system_performance/         // System performance data
GET    /analytics/system_performance_report/  // System performance report
GET    /analytics/usage_statistics/           // Usage statistics
GET    /analytics/user_activity_report/       // User activity report
GET    /analytics/workflow_execution_stats/   // Workflow execution stats
GET    /analytics/workflow_performance/       // Workflow performance data
GET    /analytics/workflow_performance_chart/ // Workflow performance chart
GET    /analytics/{id}/              // Get specific analytics
PUT    /analytics/{id}/              // Update analytics
PATCH  /analytics/{id}/              // Partial update analytics
DELETE /analytics/{id}/              // Delete analytics
```

### **Token Management Endpoints:**
```typescript
POST /token/                         // Obtain JWT token pair
POST /token/refresh/                 // Refresh JWT token
```

---

## 🔧 **STEP-BY-STEP IMPLEMENTATION FOR CURSOR AI**

### **STEP 1: Create API Client Infrastructure**

#### 1.1 Install Dependencies
```bash
npm install axios
```

#### 1.2 Create Environment Configuration
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### 1.3 Create Base API Client
```typescript
// lib/api/client.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Auto-attach JWT token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors (token expired)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

### **STEP 2: Create Authentication Service**

```typescript
// lib/api/auth.ts
import apiClient from './client';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
}

export const authService = {
  signup: async (userData: SignupData) => {
    const response = await apiClient.post('/users/register/', userData);
    return response.data;
  },

  login: async (credentials: LoginCredentials) => {
    const response = await apiClient.post('/auth/login/', credentials);
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
    }
    return response.data;
  },

  logout: async () => {
    try {
      // Try POST method first, fallback to GET
      await apiClient.post('/auth/logout/');
    } catch (error) {
      try {
        await apiClient.get('/auth/logout/');
      } catch (fallbackError) {
        console.warn('Logout API call failed, clearing tokens locally');
      }
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/user/');
    return response.data;
  },

  updateCurrentUser: async (userData: any) => {
    const response = await apiClient.patch('/auth/user/', userData);
    return response.data;
  },

  changePassword: async (passwordData: any) => {
    const response = await apiClient.post('/auth/password/change/', passwordData);
    return response.data;
  },

  requestPasswordReset: async (email: string) => {
    const response = await apiClient.post('/auth/password/reset/', { email });
    return response.data;
  },

  confirmPasswordReset: async (resetData: any) => {
    const response = await apiClient.post('/auth/password/reset/confirm/', resetData);
    return response.data;
  },

  // JWT Token management
  getToken: async (credentials: LoginCredentials) => {
    const response = await apiClient.post('/token/', credentials);
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
    }
    return response.data;
  },

  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    const response = await apiClient.post('/token/refresh/', {
      refresh: refreshToken
    });
    localStorage.setItem('access_token', response.data.access);
    return response.data;
  },

  // Social Login
  googleLogin: async (accessToken: string) => {
    const response = await apiClient.post('/auth/social/google/', {
      access_token: accessToken
    });
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
    }
    return response.data;
  },

  githubLogin: async (code: string) => {
    const response = await apiClient.post('/auth/social/github/', {
      code: code
    });
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
    }
    return response.data;
  }
};
```

---

### **STEP 3: Create AI Integration Service**

```typescript
// lib/api/ai.ts
import apiClient from './client';

export interface AIModelConfig {
  name: string;
  provider: string;
  model_name: string;
  api_key: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  base_url?: string;
}

export const aiService = {
  listConfigs: async () => {
    const response = await apiClient.get('/ai/aimodelconfig/');
    return response.data;
  },

  createConfig: async (config: AIModelConfig) => {
    const response = await apiClient.post('/ai/aimodelconfig/', config);
    return response.data;
  },

  getConfig: async (id: string) => {
    const response = await apiClient.get(`/ai/aimodelconfig/${id}/`);
    return response.data;
  },

  updateConfig: async (id: string, config: Partial<AIModelConfig>) => {
    const response = await apiClient.patch(`/ai/aimodelconfig/${id}/`, config);
    return response.data;
  },

  deleteConfig: async (id: string) => {
    await apiClient.delete(`/ai/aimodelconfig/${id}/`);
  },

  compareModels: async (comparisonData: any) => {
    const response = await apiClient.post('/ai/modelcomparison/compare-models/', comparisonData);
    return response.data;
  }
};
```

---

### **STEP 4: Create Workflow Management Service**

```typescript
// lib/api/workflows.ts
import apiClient from './client';

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
  listWorkflows: async () => {
    const response = await apiClient.get('/workflows/workflows/');
    return response.data;
  },

  createWorkflow: async (workflow: WorkflowData) => {
    const response = await apiClient.post('/workflows/workflows/', workflow);
    return response.data;
  },

  getWorkflow: async (id: string) => {
    const response = await apiClient.get(`/workflows/workflows/${id}/`);
    return response.data;
  },

  updateWorkflow: async (id: string, workflow: Partial<WorkflowData>) => {
    const response = await apiClient.patch(`/workflows/workflows/${id}/`, workflow);
    return response.data;
  },

  deleteWorkflow: async (id: string) => {
    await apiClient.delete(`/workflows/workflows/${id}/`);
  },

  executeWorkflow: async (id: string, inputData?: any) => {
    const response = await apiClient.post(`/workflows/workflows/${id}/execute/`, inputData || {});
    return response.data;
  },

  // Node Management
  listNodes: async () => {
    const response = await apiClient.get('/workflows/nodes/');
    return response.data;
  },

  createNode: async (node: NodeData) => {
    const response = await apiClient.post('/workflows/nodes/', node);
    return response.data;
  },

  updateNode: async (id: string, node: Partial<NodeData>) => {
    const response = await apiClient.patch(`/workflows/nodes/${id}/`, node);
    return response.data;
  },

  deleteNode: async (id: string) => {
    await apiClient.delete(`/workflows/nodes/${id}/`);
  }
};
```

---

### **STEP 5: Create Task Status Service**

```typescript
// lib/api/taskStatus.ts
import apiClient from './client';

export interface TaskStatus {
  workflow_execution?: number;
  node?: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  started_at?: string;
  completed_at?: string;
  error_message?: string;
  output?: any;
}

export const taskStatusService = {
  listStatuses: async () => {
    const response = await apiClient.get('/taskstatus/');
    return response.data;
  },

  createStatus: async (status: TaskStatus) => {
    const response = await apiClient.post('/taskstatus/', status);
    return response.data;
  },

  getStatus: async (id: string) => {
    const response = await apiClient.get(`/taskstatus/${id}/`);
    return response.data;
  },

  updateStatus: async (id: string, status: Partial<TaskStatus>) => {
    const response = await apiClient.patch(`/taskstatus/${id}/`, status);
    return response.data;
  }
};
```

---

### **STEP 6: Update Authentication Components**

#### 6.1 Login Component Integration
```typescript
// components/auth/LoginForm.tsx (UPDATE EXISTING)
import { useState } from 'react';
import { authService } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.login(credentials);
      router.push('/dashboard'); // Redirect to dashboard after login
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <div>
        <input
          type="text"
          placeholder="Username"
          value={credentials.username}
          onChange={(e) => setCredentials({...credentials, username: e.target.value})}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div>
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) => setCredentials({...credentials, password: e.target.value})}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

#### 6.2 Signup Component Integration
```typescript
// components/auth/SignupForm.tsx (UPDATE EXISTING)
import { useState } from 'react';
import { authService } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';

export default function SignupForm() {
  const [userData, setUserData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.signup(userData);
      router.push('/auth/login'); // Redirect to login after signup
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <input
        type="text"
        placeholder="Username"
        value={userData.username}
        onChange={(e) => setUserData({...userData, username: e.target.value})}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        required
      />
      
      <input
        type="email"
        placeholder="Email"
        value={userData.email}
        onChange={(e) => setUserData({...userData, email: e.target.value})}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        required
      />
      
      <input
        type="password"
        placeholder="Password"
        value={userData.password}
        onChange={(e) => setUserData({...userData, password: e.target.value})}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        required
      />
      
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Creating Account...' : 'Sign Up'}
      </button>
    </form>
  );
}
```

---

### **STEP 7: Update AI Configuration Components**

```typescript
// components/ai/AIConfigForm.tsx (UPDATE EXISTING)
import { useState, useEffect } from 'react';
import { aiService } from '@/lib/api/ai';

export default function AIConfigForm() {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newConfig, setNewConfig] = useState({
    name: '',
    provider: 'openai',
    model_name: 'gpt-3.5-turbo',
    api_key: '',
    temperature: 0.7,
    max_tokens: 1000
  });

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    try {
      const data = await aiService.listConfigs();
      setConfigs(data);
    } catch (error) {
      console.error('Failed to load AI configs:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const savedConfig = await aiService.createConfig(newConfig);
      setConfigs([...configs, savedConfig]);
      setNewConfig({ 
        name: '', 
        provider: 'openai', 
        model_name: 'gpt-3.5-turbo', 
        api_key: '', 
        temperature: 0.7, 
        max_tokens: 1000 
      });
    } catch (error) {
      console.error('Failed to create AI config:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Config Name"
          value={newConfig.name}
          onChange={(e) => setNewConfig({...newConfig, name: e.target.value})}
          className="w-full p-3 border border-gray-300 rounded-lg"
          required
        />
        
        <select
          value={newConfig.provider}
          onChange={(e) => setNewConfig({...newConfig, provider: e.target.value})}
          className="w-full p-3 border border-gray-300 rounded-lg"
        >
          <option value="openai">OpenAI</option>
          <option value="anthropic">Anthropic</option>
          <option value="huggingface">HuggingFace</option>
        </select>
        
        <input
          placeholder="Model Name (e.g., gpt-3.5-turbo)"
          value={newConfig.model_name}
          onChange={(e) => setNewConfig({...newConfig, model_name: e.target.value})}
          className="w-full p-3 border border-gray-300 rounded-lg"
          required
        />
        
        <input
          type="password"
          placeholder="API Key"
          value={newConfig.api_key}
          onChange={(e) => setNewConfig({...newConfig, api_key: e.target.value})}
          className="w-full p-3 border border-gray-300 rounded-lg"
          required
        />
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Temperature</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="2"
              value={newConfig.temperature}
              onChange={(e) => setNewConfig({...newConfig, temperature: parseFloat(e.target.value)})}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Tokens</label>
            <input
              type="number"
              min="1"
              max="4000"
              value={newConfig.max_tokens}
              onChange={(e) => setNewConfig({...newConfig, max_tokens: parseInt(e.target.value)})}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Configuration'}
        </button>
      </form>

      {/* Display existing configs */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Existing Configurations</h3>
        {configs.map((config: any) => (
          <div key={config.id} className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium">{config.name}</h4>
            <p className="text-gray-600">Provider: {config.provider}</p>
            <p className="text-gray-600">Model: {config.model_name}</p>
            <p className="text-gray-600">Temperature: {config.temperature}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### **STEP 8: Update Workflow Builder Components**

```typescript
// components/workflow/WorkflowBuilder.tsx (UPDATE EXISTING)
import { useState, useEffect } from 'react';
import { workflowService } from '@/lib/api/workflows';

export default function WorkflowBuilder() {
  const [workflows, setWorkflows] = useState([]);
  const [currentWorkflow, setCurrentWorkflow] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      const data = await workflowService.listWorkflows();
      setWorkflows(data);
    } catch (error) {
      console.error('Failed to load workflows:', error);
    }
  };

  // Handle node drop (create node via API)
  const handleNodeDrop = async (nodeType: string, position: { x: number, y: number }) => {
    if (!currentWorkflow) {
      alert('Please create or select a workflow first');
      return;
    }

    try {
      const nodeData = {
        workflow: currentWorkflow.id,
        node_type: nodeType,
        name: `${nodeType}_node_${Date.now()}`,
        config: {},
        position_x: position.x,
        position_y: position.y
      };
      
      const newNode = await workflowService.createNode(nodeData);
      console.log('Node created:', newNode);
      
      // Update your UI with the new node
      // This depends on your existing drag-and-drop implementation
      
    } catch (error) {
      console.error('Failed to create node:', error);
    }
  };

  // Handle workflow save
  const handleSaveWorkflow = async () => {
    setLoading(true);
    try {
      const workflowData = {
        name: `Workflow_${Date.now()}`,
        description: 'Generated workflow',
        definition: {
          nodes: [], // Your current nodes
          connections: [] // Your current connections
        },
        is_active: true
      };
      
      const savedWorkflow = await workflowService.createWorkflow(workflowData);
      setCurrentWorkflow(savedWorkflow);
      setWorkflows([...workflows, savedWorkflow]);
      console.log('Workflow saved:', savedWorkflow);
      
    } catch (error) {
      console.error('Failed to save workflow:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle workflow execution
  const handleExecuteWorkflow = async () => {
    if (!currentWorkflow) {
      alert('No workflow selected');
      return;
    }

    try {
      const result = await workflowService.executeWorkflow(currentWorkflow.id.toString());
      console.log('Workflow execution result:', result);
      alert('Workflow executed successfully!');
    } catch (error) {
      console.error('Failed to execute workflow:', error);
      alert('Workflow execution failed');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          <select 
            value={currentWorkflow?.id || ''}
            onChange={(e) => {
              const selected = workflows.find(w => w.id === parseInt(e.target.value));
              setCurrentWorkflow(selected || null);
            }}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="">Select Workflow</option>
            {workflows.map((workflow: any) => (
              <option key={workflow.id} value={workflow.id}>
                {workflow.name}
              </option>
            ))}
          </select>

          <button 
            onClick={handleSaveWorkflow} 
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Workflow'}
          </button>

          <button 
            onClick={handleExecuteWorkflow}
            disabled={!currentWorkflow}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            Execute
          </button>
        </div>
      </div>

      {/* Your existing workflow canvas/builder UI */}
      <div className="flex-1">
        {/* Insert your existing drag-and-drop workflow builder here */}
        {/* Make sure to call handleNodeDrop when nodes are dropped */}
      </div>
    </div>
  );
}
```

---

### **STEP 9: Create Authentication Context Hook**

```typescript
// hooks/useAuth.ts
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/lib/api/auth';

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
  signup: (userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      }
    } catch (error) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: any) => {
    await authService.login(credentials);
    const userData = await authService.getCurrentUser();
    setUser(userData);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const signup = async (userData: any) => {
    await authService.signup(userData);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

---

### **STEP 10: Update Root Layout with Auth Provider**

```typescript
// app/layout.tsx (UPDATE EXISTING)
'use client';
import { AuthProvider } from '@/hooks/useAuth';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

---

## 🧪 **TESTING INSTRUCTIONS FOR CURSOR AI**

### **Test 1: Authentication Flow**
1. Start backend: `cd InnoFlow && python manage.py runserver`
2. Start frontend: `cd Innoflow-FrontEnd && npm run dev`
3. Navigate to login page
4. Try logging in with any credentials
5. Check browser console for API responses

### **Test 2: AI Configuration**
1. After login, navigate to AI configuration page
2. Try creating a new AI model configuration
3. Check if it appears in the list
4. Verify API calls in Network tab

### **Test 3: Workflow Creation**
1. Navigate to workflow builder
2. Try creating a new workflow
3. Add nodes via drag-and-drop
4. Save the workflow
5. Verify API calls to `/workflows/workflows/`

---

## 🚨 **CRITICAL SUCCESS CHECKLIST FOR CURSOR AI**

### **Updated File Structure to Create:**
```
lib/api/
├── client.ts         ✅ Base API client
├── auth.ts           ✅ Authentication service (comprehensive)
├── users.ts          ✅ User management service  
├── ai.ts             ✅ AI integration service (full CRUD)
├── workflows.ts      ✅ Workflow management service (full CRUD)
├── taskStatus.ts     ✅ Task status service (full CRUD)
├── analytics.ts      ✅ Analytics service (bonus feature)
└── types.ts          ✅ TypeScript type definitions

hooks/
└── useAuth.ts        ✅ Authentication context

.env.local            ✅ Environment configuration
```

### **Updated Components to Update:**
- [ ] Login/Signup forms - Connect to comprehensive auth API
- [ ] AI configuration forms - Connect to full CRUD AI API
- [ ] Workflow builder - Connect to complete workflow API with executions
- [ ] Dashboard - Show real analytics data from backend
- [ ] Navigation - Use auth context for user state
- [ ] User profile management - Full CRUD operations

### **Updated API Integration Checklist:**
- [ ] Authentication works (login/signup/logout/social auth)
- [ ] User profile management CRUD works
- [ ] AI model configuration full CRUD works
- [ ] Model comparison functionality works
- [ ] Workflow creation and management works (full CRUD)
- [ ] Workflow execution works
- [ ] Node creation via drag-and-drop works (full CRUD)
- [ ] Task status tracking works (full CRUD)
- [ ] Analytics dashboard works (bonus)
- [ ] JWT token handling works (obtain + refresh)
- [ ] Error handling displays properly
- [ ] Social login (Google/GitHub) works

---

## 🔄 **STEP 20: Update Dashboard with Complete Analytics**

```typescript
// app/dashboard/page.tsx (COMPLETE UPDATE WITH ANALYTICS)
'use client';
import { useState, useEffect } from 'react';
import { workflowService } from '@/lib/api/workflows';
import { aiService } from '@/lib/api/ai';
import { taskStatusService } from '@/lib/api/taskStatus';
import { analyticsService } from '@/lib/api/analytics';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    workflows: 0,
    aiConfigs: 0,
    runningTasks: 0,
    completedTasks: 0,
    totalExecutions: 0
  });
  const [recentWorkflows, setRecentWorkflows] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [
        workflows, 
        aiConfigs, 
        taskStatuses, 
        executions,
        analyticsData,
        usageStats
      ] = await Promise.all([
        workflowService.listWorkflows(),
        aiService.listConfigs(),
        taskStatusService.listStatuses(),
        workflowService.listExecutions(),
        analyticsService.getAnalytics(),
        analyticsService.getUsageStatistics()
      ]);

      setStats({
        workflows: workflows.length,
        aiConfigs: aiConfigs.length,
        runningTasks: taskStatuses.filter((task: any) => task.status === 'running').length,
        completedTasks: taskStatuses.filter((task: any) => task.status === 'completed').length,
        totalExecutions: executions.length
      });

      setRecentWorkflows(workflows.slice(0, 5));
      setAnalytics(usageStats);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">InnoFlow Dashboard</h1>
          
          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Workflows</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.workflows}</p>
              <p className="text-sm text-gray-500">Total created</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">AI Models</h3>
              <p className="text-3xl font-bold text-green-600">{stats.aiConfigs}</p>
              <p className="text-sm text-gray-500">Configured</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Running Tasks</h3>
              <p className="text-3xl font-bold text-orange-600">{stats.runningTasks}</p>
              <p className="text-sm text-gray-500">Currently active</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Completed</h3>
              <p className="text-3xl font-bold text-emerald-600">{stats.completedTasks}</p>
              <p className="text-sm text-gray-500">Tasks finished</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Executions</h3>
              <p className="text-3xl font-bold text-purple-600">{stats.totalExecutions}</p>
              <p className="text-sm text-gray-500">Total runs</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Workflows */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Recent Workflows</h2>
              </div>
              <div className="p-6">
                {recentWorkflows.length === 0 ? (
                  <p className="text-gray-500">No workflows created yet. <a href="/workflow-builder" className="text-blue-600 hover:underline">Create your first workflow</a></p>
                ) : (
                  <div className="space-y-4">
                    {recentWorkflows.map((workflow: any) => (
                      <div key={workflow.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900">{workflow.name}</h3>
                          <p className="text-sm text-gray-500">{workflow.description || 'No description'}</p>
                          <p className="text-xs text-gray-400">Created: {new Date(workflow.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${workflow.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {workflow.is_active ? 'Active' : 'Inactive'}
                          </span>
                          <button 
                            onClick={() => window.location.href = `/workflow-builder?id=${workflow.id}`}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={async () => {
                              try {
                                await workflowService.executeWorkflow(workflow.id.toString());
                                alert('Workflow executed successfully!');
                                loadDashboardData(); // Refresh data
                              } catch (error) {
                                alert('Workflow execution failed');
                              }
                            }}
                            className="text-green-600 hover:text-green-800 text-sm"
                          >
                            Execute
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-4">
                  <button
                    onClick={() => window.location.href = '/workflow-builder'}
                    className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                    </div>
                    <div className="ml-4 text-left">
                      <h3 className="text-sm font-medium text-gray-900">Create Workflow</h3>
                      <p className="text-sm text-gray-500">Build a new automation workflow</p>
                    </div>
                  </button>

                  <button
                    onClick={() => window.location.href = '/ai-config'}
                    className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                      </svg>
                    </div>
                    <div className="ml-4 text-left">
                      <h3 className="text-sm font-medium text-gray-900">Configure AI Model</h3>
                      <p className="text-sm text-gray-500">Set up AI model parameters</p>
                    </div>
                  </button>

                  <button
                    onClick={async () => {
                      try {
                        const report = await analyticsService.getMonthlyReport();
                        console.log('Monthly report:', report);
                        alert('Monthly report generated! Check console for details.');
                      } catch (error) {
                        console.error('Failed to generate report:', error);
                      }
                    }}
                    className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                      </svg>
                    </div>
                    <div className="ml-4 text-left">
                      <h3 className="text-sm font-medium text-gray-900">Generate Report</h3>
                      <p className="text-sm text-gray-500">Create monthly analytics report</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
```

---

## 🔄 **STEP 21: Enhanced Error Handling and User Feedback**

```typescript
// lib/api/client.ts (ENHANCED VERSION)
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout
});

// Enhanced request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Enhanced response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ API Error: ${error.response?.status} ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`, error.response?.data);
    }

    // Handle 401 errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: refreshToken
          });
          
          localStorage.setItem('access_token', response.data.access);
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
      }

      // If refresh fails, clear tokens and redirect to login
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/auth/login';
      return Promise.reject(error);
    }

    // Handle different error types with user-friendly messages
    let userMessage = 'An unexpected error occurred';
    
    if (error.response?.status === 400) {
      userMessage = 'Invalid request. Please check your input.';
    } else if (error.response?.status === 403) {
      userMessage = 'You do not have permission to perform this action.';
    } else if (error.response?.status === 404) {
      userMessage = 'The requested resource was not found.';
    } else if (error.response?.status === 500) {
      userMessage = 'Server error. Please try again later.';
    } else if (error.code === 'ECONNABORTED') {
      userMessage = 'Request timeout. Please check your connection.';
    } else if (!error.response) {
      userMessage = 'Network error. Please check your connection.';
    }

    // Attach user-friendly message to error
    error.userMessage = userMessage;
    
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

## 🔄 **STEP 22: Complete Testing Instructions**

### **Pre-Integration Testing:**
```bash
# 1. Verify Backend is Running
curl http://localhost:8000/ai/aimodelconfig/
# Should return: [] or list of configs

curl http://localhost:8000/auth/login/ -X POST -H "Content-Type: application/json" -d '{"username":"test","password":"test"}'
# Should return: 400 Bad Request (expected for invalid credentials)

curl http://localhost:8000/workflows/workflows/
# Should return: {"detail":"Authentication credentials were not provided."} or list if authenticated
```

### **Post-Integration Testing Checklist:**

#### ✅ **Authentication Flow Test:**
1. Navigate to `/auth/signup`
2. Create a new account
3. Navigate to `/auth/login`
4. Login with new credentials
5. Verify redirect to dashboard
6. Check browser localStorage for tokens
7. Logout and verify token removal

#### ✅ **AI Configuration Test:**
1. Navigate to `/ai-config`
2. Create a new AI model configuration
3. Fill out all fields (name, provider, model, API key)
4. Submit form and verify success message
5. Check if new config appears in list
6. Try editing an existing config
7. Try deleting a config

#### ✅ **Workflow Management Test:**
1. Navigate to `/workflow-builder`
2. Create a new workflow
3. Add nodes via drag-and-drop
4. Save the workflow
5. Execute the workflow
6. Check dashboard for workflow in recent list
7. Try loading an existing workflow

#### ✅ **Dashboard Integration Test:**
1. Navigate to `/dashboard`
2. Verify all stats cards show real data
3. Check recent workflows section
4. Test quick action buttons
5. Try generating analytics report

#### ✅ **Error Handling Test:**
1. Disconnect internet and try API calls
2. Use invalid credentials for login
3. Try accessing protected routes without login
4. Submit forms with invalid data
5. Verify user-friendly error messages appear

---

## 🎯 **FINAL SUCCESS CRITERIA UPDATE**

**✅ COMPLETE WHEN ALL OF THESE WORK:**

### **Core Authentication:**
1. ✅ User registration with email/username/password
2. ✅ User login with proper token handling
3. ✅ JWT token automatic refresh
4. ✅ User logout with token cleanup
5. ✅ Protected routes redirect to login
6. ✅ Social login (Google/GitHub) - bonus

### **AI Integration:**
7. ✅ List existing AI model configurations
8. ✅ Create new AI model configurations
9. ✅ Edit/update AI configurations
10. ✅ Delete AI configurations
11. ✅ AI model comparison functionality

### **Workflow Management:**
12. ✅ List existing workflows
13. ✅ Create new workflows with drag-and-drop
14. ✅ Save workflows to backend
15. ✅ Execute workflows and see results
16. ✅ Edit existing workflows
17. ✅ View workflow execution history

### **Node Management:**
18. ✅ Create nodes via drag-and-drop
19. ✅ Update node positions and properties
20. ✅ Delete nodes from workflows

### **Dashboard & Analytics:**
21. ✅ Dashboard shows real statistics
22. ✅ Recent workflows display correctly
23. ✅ Quick actions work properly
24. ✅ Analytics reports generate successfully

### **User Experience:**
25. ✅ Loading states during API calls
26. ✅ Error messages for failed requests
27. ✅ Success notifications for completed actions
28. ✅ Responsive design on mobile/tablet/desktop
29. ✅ No console errors in browser
30. ✅ Smooth navigation between pages

---

## 📞 **EMERGENCY TROUBLESHOOTING EXPANDED**

### **Backend Connection Issues:**
```bash
# Test if backend is responding
curl -v http://localhost:8000/

# Test specific endpoints
curl http://localhost:8000/ai/aimodelconfig/
curl http://localhost:8000/workflows/workflows/
curl http://localhost:8000/auth/user/

# Check CORS settings
curl -H "Origin: http://localhost:3000" -H "Access-Control-Request-Method: POST" -H "Access-Control-Request-Headers: X-Requested-With" -X OPTIONS http://localhost:8000/auth/login/
```

### **Frontend Build Issues:**
```bash
# Clear Next.js cache
rm -rf .next
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Verify environment variables
echo $NEXT_PUBLIC_API_URL
```

### **Authentication Issues:**
```bash
# Test login endpoint directly
curl -X POST http://localhost:8000/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"your_username","password":"your_password"}'

# Test token refresh
curl -X POST http://localhost:8000/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{"refresh":"your_refresh_token"}'
```

### **Common Error Solutions:**

| Error | Solution |
|-------|----------|
| `Network Error` | Check if backend is running on port 8000 |
| `CORS Error` | Verify CORS_ALLOWED_ORIGINS in Django settings |
| `401 Unauthorized` | Check JWT token in localStorage |
| `404 Not Found` | Verify API endpoint URLs match Swagger exactly |
| `400 Bad Request` | Check request payload format |
| `500 Internal Server Error` | Check Django server logs |

---

## 🚀 **FINAL LAUNCH COMMAND SEQUENCE**

### **Terminal 1: Backend**
```bash
cd InnoFlow
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
python manage.py runserver
# Should show: Starting development server at http://127.0.0.1:8000/
```

### **Terminal 2: Frontend**
```bash
cd Innoflow-FrontEnd
npm install axios  # Install dependencies
npm run dev
# Should show: ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### **Terminal 3: Testing**
```bash
# Test complete integration
curl http://localhost:8000/ai/aimodelconfig/
curl http://localhost:3000/
```

---

## 🎉 **PROJECT COMPLETION VALIDATION**

**✅ INTEGRATION IS COMPLETE WHEN:**

1. **Frontend loads** at `http://localhost:3000` without errors
2. **Backend responds** at `http://localhost:8000` with API data
3. **User can register** a new account successfully
4. **User can login** and see dashboard with real data
5. **AI configurations** can be created, edited, and deleted
6. **Workflows can be built** using drag-and-drop interface
7. **Workflows can be saved** and executed successfully
8. **All network requests** in browser DevTools show 200/201 responses
9. **No console errors** in browser developer tools
10. **Navigation between pages** works smoothly

**🎯 MISSION ACCOMPLISHED: InnoFlow is now a fully functional workflow automation platform!** 🚀

---

**CURSOR AI: Follow this plan step-by-step to achieve 100% frontend-backend integration success!**

---

## 🎯 **FINAL OBJECTIVE**

**MAKE THE APPLICATION FULLY FUNCTIONAL:**
1. ✅ Users can register and login
2. ✅ Users can configure AI models
3. ✅ Users can create workflows with drag-and-drop
4. ✅ Users can save and execute workflows
5. ✅ Real-time feedback and error handling
6. ✅ Complete frontend-backend integration

**TIMELINE: COMPLETE TODAY**

**SUCCESS METRIC: A working InnoFlow application where users can login, create AI workflows, and see real results from the backend.**

---

## 📞 **EMERGENCY TROUBLESHOOTING**

### Common Issues & Solutions:
1. **CORS Errors**: Backend CORS should be configured, but if issues persist, add proxy in next.config.js
2. **401 Errors**: Check JWT token handling in API client
3. **Network Errors**: Verify backend is running on localhost:8000
4. **Build Errors**: Ensure all imports are correct and TypeScript types match

### Quick Debug Commands:
```bash
# Test backend APIs
curl http://localhost:8000/ai/aimodelconfig/
curl http://localhost:8000/workflows/workflows/
curl http://localhost:8000/auth/login/ -X POST -H "Content-Type: application/json" -d '{"username":"test","password":"test"}'

# Check frontend build
npm run build
npm run dev

# Debug network requests
# Open browser DevTools → Network tab → Filter XHR/Fetch
```

---

## 🔄 **STEP 11: Create Protected Route Component**

```typescript
// components/ProtectedRoute.tsx
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
```

---

## 🔄 **STEP 12: Update Dashboard with Real Data**

```typescript
// app/dashboard/page.tsx (UPDATE EXISTING)
'use client';
import { useState, useEffect } from 'react';
import { workflowService } from '@/lib/api/workflows';
import { aiService } from '@/lib/api/ai';
import { taskStatusService } from '@/lib/api/taskStatus';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    workflows: 0,
    aiConfigs: 0,
    runningTasks: 0
  });
  const [recentWorkflows, setRecentWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [workflows, aiConfigs, taskStatuses] = await Promise.all([
        workflowService.listWorkflows(),
        aiService.listConfigs(),
        taskStatusService.listStatuses()
      ]);

      setStats({
        workflows: workflows.length,
        aiConfigs: aiConfigs.length,
        runningTasks: taskStatuses.filter((task: any) => task.status === 'running').length
      });

      setRecentWorkflows(workflows.slice(0, 5)); // Show recent 5 workflows
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">InnoFlow Dashboard</h1>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Workflows</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.workflows}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">AI Configurations</h3>
              <p className="text-3xl font-bold text-green-600">{stats.aiConfigs}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Running Tasks</h3>
              <p className="text-3xl font-bold text-orange-600">{stats.runningTasks}</p>
            </div>
          </div>

          {/* Recent Workflows */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recent Workflows</h2>
            </div>
            <div className="p-6">
              {recentWorkflows.length === 0 ? (
                <p className="text-gray-500">No workflows created yet. <a href="/workflow-builder" className="text-blue-600 hover:underline">Create your first workflow</a></p>
              ) : (
                <div className="space-y-4">
                  {recentWorkflows.map((workflow: any) => (
                    <div key={workflow.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">{workflow.name}</h3>
                        <p className="text-sm text-gray-500">{workflow.description || 'No description'}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${workflow.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {workflow.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <button 
                          onClick={() => window.location.href = `/workflow-builder?id=${workflow.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
```

---

## 🔄 **STEP 13: Create Navigation with Auth State**

```typescript
// components/Navigation.tsx
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function Navigation() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-xl font-bold text-blue-600">
              InnoFlow
            </Link>
            
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
              
              <Link
                href="/workflow-builder"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Workflow Builder
              </Link>
              
              <Link
                href="/ai-config"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                AI Configuration
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">Welcome, {user.username}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
```

---

## 🔄 **STEP 14: Create Error Boundary Component**

```typescript
// components/ErrorBoundary.tsx
'use client';
import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            
            <div className="mt-4 text-center">
              <h3 className="text-lg font-medium text-gray-900">Something went wrong</h3>
              <p className="mt-2 text-sm text-gray-500">
                An error occurred while loading the application. Please try refreshing the page.
              </p>
              
              <div className="mt-6">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

---

## 🔄 **STEP 15: Update Layout with Navigation and Error Boundary**

```typescript
// app/layout.tsx (COMPLETE UPDATE)
'use client';
import { AuthProvider } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import ErrorBoundary from '@/components/ErrorBoundary';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <AuthProvider>
            <div className="min-h-screen bg-gray-50">
              <Navigation />
              <main>{children}</main>
            </div>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

---

## 🔄 **STEP 16: Create Loading Component**

```typescript
// components/Loading.tsx
export default function Loading({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
}
```

---

## 🔄 **STEP 17: Create Notification System**

```typescript
// hooks/useNotifications.ts
import { useState, useCallback } from 'react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((type: Notification['type'], message: string) => {
    const id = Date.now().toString();
    const notification: Notification = { id, type, message };
    
    setNotifications(prev => [...prev, notification]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    success: (message: string) => addNotification('success', message),
    error: (message: string) => addNotification('error', message),
    warning: (message: string) => addNotification('warning', message),
    info: (message: string) => addNotification('info', message),
  };
};
```

```typescript
// components/NotificationContainer.tsx
import { useNotifications } from '@/hooks/useNotifications';

export default function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden ${
            notification.type === 'success' ? 'border-l-4 border-green-400' :
            notification.type === 'error' ? 'border-l-4 border-red-400' :
            notification.type === 'warning' ? 'border-l-4 border-yellow-400' :
            'border-l-4 border-blue-400'
          }`}
        >
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {notification.type === 'success' && (
                  <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {notification.type === 'error' && (
                  <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <div className="ml-3 w-0 flex-1 pt-0.5">
                <p className="text-sm font-medium text-gray-900">{notification.message}</p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500"
                  onClick={() => removeNotification(notification.id)}
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## 🔄 **STEP 18: Final Configuration Files**

### next.config.mjs (UPDATE EXISTING)
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
```

### package.json (ADD DEPENDENCIES)
```json
{
  "dependencies": {
    "axios": "^1.6.0",
    "next": "latest",
    "react": "latest",
    "react-dom": "latest"
  }
}
```

---

## 🎯 **FINAL DEPLOYMENT CHECKLIST**

### **Environment Setup:**
- [ ] `.env.local` file created with correct API URL
- [ ] `axios` dependency installed
- [ ] Backend running on `http://localhost:8000`
- [ ] Frontend running on `http://localhost:3000`

### **API Services Created:**
- [ ] `lib/api/client.ts` - Base API client with token handling
- [ ] `lib/api/auth.ts` - Authentication service
- [ ] `lib/api/ai.ts` - AI integration service
- [ ] `lib/api/workflows.ts` - Workflow management service
- [ ] `lib/api/taskStatus.ts` - Task status service

### **Components Updated:**
- [ ] Login/Signup forms connected to auth API
- [ ] AI configuration forms connected to AI API
- [ ] Workflow builder connected to workflow API
- [ ] Dashboard showing real data from APIs
- [ ] Navigation with auth state management

### **Features Working:**
- [ ] User registration and login
- [ ] JWT token management and refresh
- [ ] AI model configuration CRUD
- [ ] Workflow creation and management
- [ ] Node creation via drag-and-drop
- [ ] Real-time error handling and notifications
- [ ] Protected routes and authentication

---

## 🚀 **LAUNCH SEQUENCE**

### **Step 1: Start Backend**
```bash
cd InnoFlow
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
python manage.py runserver
```

### **Step 2: Install Frontend Dependencies**
```bash
cd Innoflow-FrontEnd
npm install axios
```

### **Step 3: Start Frontend**
```bash
npm run dev
```

### **Step 4: Test Complete Flow**
1. Open `http://localhost:3000`
2. Register a new user
3. Login with credentials
4. Navigate to AI configuration
5. Create an AI model configuration
6. Navigate to workflow builder
7. Create a workflow with drag-and-drop
8. Save and execute the workflow
9. Verify all API calls in browser DevTools

---

## 🎉 **SUCCESS CRITERIA**

**✅ COMPLETE WHEN:**
1. Users can register, login, and logout
2. AI model configurations can be created and managed
3. Workflows can be created using drag-and-drop interface
4. Workflows can be saved and executed
5. Real-time feedback shows API responses
6. No console errors in browser
7. All network requests to backend are successful

**🚨 CRITICAL: This plan must result in a fully functional InnoFlow application by end of day!**

---

## 📝 **NOTES FOR CURSOR AI**

- **PRIORITY**: Focus on core functionality first (auth, AI config, workflow management)
- **TESTING**: Test each API integration immediately after implementation
- **ERROR HANDLING**: Always include try-catch blocks and user feedback
- **PERFORMANCE**: Use loading states and optimize API calls
- **USER EXPERIENCE**: Ensure smooth navigation and clear error messages

**GOAL: Transform existing UI-only frontend into a fully integrated, functional application that communicates seamlessly with the Django backend.**
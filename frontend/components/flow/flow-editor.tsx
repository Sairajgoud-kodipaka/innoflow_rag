"use client";

import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Code, Play, Save, Trash, Bug, Loader2, AlertCircle } from "lucide-react";

// Import node components
import { ModelNode } from "./nodes/model-node";
import { InputNode } from "@/components/flow/nodes/input-node";
import { OutputNode } from "@/components/flow/nodes/output-node";
import { AgentNode } from "@/components/flow/nodes/agent-node";
import { PromptNode } from "@/components/flow/nodes/prompt-node";
import { NodePropertiesPanel } from "@/components/flow/node-properties-panel";
import { AnthropicNode } from "./nodes/anthropic-node";
import { HuggingFaceNode } from "./nodes/huggingface-node";
import { LocalModelNode } from "./nodes/local-model-node";
import { FileInputNode } from "@/components/flow/nodes/file-input-node";
import { StreamOutputNode } from "@/components/flow/nodes/stream-output-node";
import { FileOutputNode } from "@/components/flow/nodes/file-output-node";
import { FewShotNode } from "@/components/flow/nodes/few-shot-node";
import { ToolNode } from "@/components/flow/nodes/tool-node";
import { MultiAgentNode } from "@/components/flow/nodes/multi-agent-node";
import { ConversationMemoryNode } from "@/components/flow/nodes/conversation-memory-node";
import { BufferMemoryNode } from "@/components/flow/nodes/buffer-memory-node";
import { SequentialChainNode } from "@/components/flow/nodes/sequential-chain-node";
import { RouterChainNode } from "@/components/flow/nodes/router-chain-node";
import { VectorStoreNode } from "@/components/flow/nodes/vectorstore-node";
import { DocumentLoaderNode } from "@/components/flow/nodes/document-loader-node";
import { TextSplitterNode } from "@/components/flow/nodes/text-splitter-node";
import APIInputNode from "@/components/flow/nodes/API-input-node";
import { DeepSeekNode } from "./nodes/deepseek-node";
import { OllamaNode } from "./nodes/ollama-node";
import { GeminiNode } from "./nodes/gemini-node";

// ReactFlow imports
import type { Node, Edge, Connection, NodeTypes, NodeChange, EdgeChange } from "reactflow";
import { MarkerType, ConnectionLineType, BackgroundVariant, useNodesState, useEdgesState, addEdge } from "reactflow";
import "reactflow/dist/style.css";

// API imports
import { workflowService } from "@/lib/api/workflows";
import { aiService, AIModelConfig } from "@/lib/api/ai";
import { useAuth } from "../../hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import { useRouter } from "next/navigation";

// Dynamic imports for SSR compatibility
const ReactFlow = dynamic(() => import("reactflow").then((mod) => mod.ReactFlow), { ssr: false });
const Background = dynamic(() => import("reactflow").then((mod) => mod.Background), { ssr: false });
const Controls = dynamic(() => import("reactflow").then((mod) => mod.Controls), { ssr: false });
const MiniMap = dynamic(() => import("reactflow").then((mod) => mod.MiniMap), { ssr: false });
const Panel = dynamic(() => import("reactflow").then((mod) => mod.Panel), { ssr: false });

// 🔧 INTERFACES
interface FlowEditorProps {
  flowId: string;
  onOpenPlayground: () => void;
  onOpenApiCodespace: () => void;
  onAddNodeReady?: (addNodeFunction: (type: string, name: string) => void) => void;
}

interface NodeData {
  label: string;
  name?: string;
  [key: string]: any;
}

interface WorkflowData {
  id?: string;
  name: string;
  description?: string;
  definition?: {
    nodes: Node[];
    edges: Edge[];
    viewport?: any;
  };
  nodes?: any[];
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// 🎨 NODE TYPES REGISTRY
const nodeTypes: NodeTypes = {
  "model-node": ModelNode,
  openai: ModelNode,
  anthropic: AnthropicNode,
  deepseek: DeepSeekNode,
  ollama: OllamaNode,
  huggingface: HuggingFaceNode,
  gemini: GeminiNode,
  "local-model": LocalModelNode,
  "text-input": InputNode,
  "file-input": FileInputNode,
  "text-output": OutputNode,
  "stream-output": StreamOutputNode,
  "file-output": FileOutputNode,
  "prompt-template": PromptNode,
  "few-shot": FewShotNode,
  agent: AgentNode,
  tool: ToolNode,
  "multi-agent": MultiAgentNode,
  "conversation-memory": ConversationMemoryNode,
  "buffer-memory": BufferMemoryNode,
  "sequential-chain": SequentialChainNode,
  "router-chain": RouterChainNode,
  "vector-store": VectorStoreNode,
  "document-loader": DocumentLoaderNode,
  "text-splitter": TextSplitterNode,
  "api-input": APIInputNode,
};

// 📊 NODE DATA FACTORY
const getNodeData = (type: string, name: string): NodeData => {
  const baseData: NodeData = { 
    label: name, 
    name: name,
    type: type,
    description: `${name} component`
  };

  switch (type) {
    case 'model-node':
      return { 
        ...baseData, 
        model: '', 
        temperature: 0.7, 
        systemMessage: 'You are a helpful assistant.',
        provider: 'generic'
      };
    case 'openai':
      return { 
        ...baseData, 
        model: '', 
        temperature: 0.7, 
        systemMessage: 'You are a helpful assistant.',
        provider: 'openai'
      };
    case 'anthropic':
      return { 
        ...baseData, 
        model: '', 
        temperature: 0.7, 
        systemMessage: 'You are a helpful assistant.',
        provider: 'anthropic'
      };
    case 'deepseek':
      return { 
        ...baseData, 
        model: '', 
        temperature: 0.7, 
        systemMessage: 'You are a helpful assistant.',
        provider: 'deepseek'
      };
    case 'ollama':
      return { 
        ...baseData, 
        model: '', 
        temperature: 0.7, 
        systemMessage: 'You are a helpful assistant.',
        provider: 'ollama'
      };
    case 'huggingface':
      return { 
        ...baseData, 
        model: '', 
        temperature: 0.7,
        provider: 'huggingface'
      };
    case 'gemini':
      return { 
        ...baseData, 
        model: 'gemini-1.5-pro', 
        temperature: 0.7, 
        systemMessage: 'You are a helpful assistant.',
        provider: 'gemini'
      };
    case 'local-model':
      return { ...baseData, model: "llama2", temperature: 0.7 };
    case 'text-input':
      return { ...baseData, inputs: { text: "" } };
    case 'file-input':
      return { ...baseData, acceptedTypes: ".txt,.csv,.json,.pdf" };
    case 'prompt-template':
      return { ...baseData, template: "Write a response about {{topic}}" };
    case 'agent':
      return { ...baseData, instructions: "You are a helpful assistant." };
    case 'api-input':
      return { 
        ...baseData, 
        apiUrl: "", 
        method: "GET", 
        headers: "", 
        body: "", 
        autoFetch: false, 
        pollingInterval: 0 
      };
    case 'stream-output':
      return { ...baseData, output: "" };
    case 'file-output':
      return { ...baseData, fileName: "output.txt" };
    case 'few-shot':
      return { ...baseData, examples: [] };
    case 'tool':
      return { ...baseData, functionName: "" };
    case 'multi-agent':
      return { ...baseData, agents: [] };
    case 'conversation-memory':
      return { ...baseData, windowSize: 5 };
    case 'buffer-memory':
      return { ...baseData, bufferSize: 10 };
    case 'sequential-chain':
      return { ...baseData, chains: [] };
    case 'router-chain':
      return { ...baseData, routes: [] };
    case 'vector-store':
      return { ...baseData, vectorDB: "", dimension: 0 };
    case 'document-loader':
      return { ...baseData, loaderType: "" };
    case 'text-splitter':
      return { ...baseData, chunkSize: 1000, chunkOverlap: 200 };
    default:
      return baseData;
  }
};

// 🎨 DEFAULT WORKFLOW TEMPLATES
const getInitialNodes = (flowId: string): Node[] => {
  if (flowId === "flow-1") {
    return [
      {
        id: "1",
        type: "text-input",
        position: { x: 250, y: 100 },
        data: getNodeData("text-input", "Chat Input"),
      },
      {
        id: "2",
        type: "anthropic",
        position: { x: 250, y: 250 },
        data: getNodeData("anthropic", "Anthropic"),
      },
      {
        id: "3",
        type: "text-output",
        position: { x: 250, y: 400 },
        data: getNodeData("text-output", "Chat Output"),
      },
    ];
  }

  if (flowId === "flow-2") {
    return [
      {
        id: "1",
        type: "text-input",
        position: { x: 100, y: 100 },
        data: getNodeData("text-input", "User Query"),
      },
      {
        id: "2",
        type: "vector-store",
        position: { x: 300, y: 100 },
        data: getNodeData("vector-store", "Vector Store"),
      },
      {
        id: "3",
        type: "openai",
        position: { x: 500, y: 100 },
        data: getNodeData("openai", "OpenAI"),
      },
      {
        id: "4",
        type: "text-output",
        position: { x: 700, y: 100 },
        data: getNodeData("text-output", "Response"),
      },
    ];
  }

  return [];
};

const getInitialEdges = (flowId: string): Edge[] => {
  if (flowId === "flow-1") {
    return [
      { id: "e1-2", source: "1", target: "2", type: "smoothstep", animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
      { id: "e2-3", source: "2", target: "3", type: "smoothstep", animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
    ];
  }

  if (flowId === "flow-2") {
    return [
      { id: "e1-2", source: "1", target: "2", type: "smoothstep", animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
      { id: "e2-3", source: "2", target: "3", type: "smoothstep", animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
      { id: "e3-4", source: "3", target: "4", type: "smoothstep", animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
    ];
  }

  return [];
};

// 🚀 MAIN FLOW EDITOR COMPONENT
export function FlowEditor({ flowId, onOpenPlayground, onOpenApiCodespace, onAddNodeReady }: FlowEditorProps) {
  // 🔐 AUTHENTICATION & ROUTING
  const { user } = useAuth();
  const router = useRouter();
  const { addNotification } = useNotifications();

  // 📱 REACT FLOW STATE
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(getInitialNodes(flowId));
  const [edges, setEdges, onEdgesChange] = useEdgesState(getInitialEdges(flowId));
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isReactFlowLoaded, setIsReactFlowLoaded] = useState(false);

  // 🎯 BACKEND INTEGRATION STATE
  const [workflowData, setWorkflowData] = useState<WorkflowData | null>(null);
  const [aiConfigs, setAiConfigs] = useState<AIModelConfig[]>([]);

  // 📊 UI STATE
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // 🔧 TRACKING STATE
  const [newlyAddedNodes, setNewlyAddedNodes] = useState<Set<string>>(new Set());
  const defaultViewportRef = useRef<{ x: number; y: number; zoom: number } | null>(null);

  // 🚀 INITIALIZATION
  useEffect(() => {
        setIsReactFlowLoaded(true);
      loadInitialData();
  }, [flowId]);

  /**
   * 📊 Load workflow and AI configurations from backend
   */
  const loadInitialData = async () => {
    setLoading(true);
    console.log("🔄 Loading initial data for flowId:", flowId);

    try {
      // Load AI configs
      try {
        const aiConfigsResponse = await aiService.listConfigs();
        setAiConfigs(aiConfigsResponse);
        console.log("✅ AI configs loaded:", aiConfigsResponse.length);
      } catch (error) {
        console.error("❌ Failed to load AI configs:", error);
        setAiConfigs([]);
      }

      // Load workflow if not new
      if (flowId && flowId !== "new" && !flowId.startsWith("flow-")) {
        try {
          const workflow = await workflowService.getWorkflow(flowId);
          setWorkflowData(workflow);
          
          // Load workflow nodes if they exist
          if (workflow.nodes && workflow.nodes.length > 0) {
            // Convert backend nodes to ReactFlow nodes
            const reactFlowNodes = workflow.nodes.map((node: any) => ({
              id: node.id || `node-${Date.now()}`,
              type: node.node_type || 'text-input',
              position: { x: node.position_x || 0, y: node.position_y || 0 },
              data: getNodeData(node.node_type || 'text-input', node.name || 'Node')
            }));
            setNodes(reactFlowNodes);
          }
          
          console.log("✅ Workflow loaded:", workflow);
          addNotification({ type: "success", message: "Flow editor loaded successfully!" });
        } catch (error) {
          console.error("❌ Failed to load workflow:", error);
        }
      }

      addNotification({ type: "success", message: "Flow editor loaded successfully!" });
    } catch (error) {
      console.error("❌ Failed to load initial data:", error);
      addNotification({ type: "error", message: "Failed to load workflow data" });
    } finally {
      setLoading(false);
    }
  };

  // 🎯 CAPTURE DEFAULT VIEWPORT
  useEffect(() => {
    if (reactFlowInstance && !defaultViewportRef.current) {
      setTimeout(() => {
        const viewport = reactFlowInstance.getViewport();
        defaultViewportRef.current = viewport;
        console.log("📍 Default viewport captured:", viewport);
      }, 500);
    }
  }, [reactFlowInstance]);

  // 🔧 NODE CHANGE HANDLER
  const onNodesChangeHandler = useCallback(
    (changes: NodeChange[]) => {
      // Handle node selection
      const selectChange = changes.find(
        (change) => change.type === "select" && change.selected === true
      );
      if (selectChange && "id" in selectChange && selectChange.id) {
        const nodeId = selectChange.id as string;
        const node = nodes.find((n) => n.id === nodeId);
        if (node) {
          setSelectedNode(node);
        }
      }

      // Handle node position changes (dragging)
      for (const change of changes) {
        if (change.type === "position" && "dragging" in change && change.dragging && "id" in change) {
          const draggedNodeId = change.id;

          if (draggedNodeId && newlyAddedNodes.has(draggedNodeId)) {
            console.log("🎯 Node being dragged:", draggedNodeId);
            setNewlyAddedNodes((prev) => {
              const newSet = new Set(prev);
              newSet.delete(draggedNodeId);
              return newSet;
            });

            // Reset viewport to default
            if (reactFlowInstance && defaultViewportRef.current) {
              console.log("📍 Resetting to default viewport");
              reactFlowInstance.setViewport(defaultViewportRef.current, { duration: 700 });
            }
          }
        }
      }

      onNodesChange(changes);
    },
    [newlyAddedNodes, nodes, reactFlowInstance, onNodesChange]
  );

  // 🔗 CONNECTION HANDLER
  const onConnect = useCallback(
    (params: Connection) => {
      const edgeId = `e${params.source}-${params.target}`;

      // Check if connection already exists
      const edgeExists = edges.some((edge) => edge.id === edgeId);
      if (edgeExists) {
        addNotification({ type: "warning", message: "Connection already exists" });
        return;
      }

      const sourceNode = nodes.find((node) => node.id === params.source);
      const targetNode = nodes.find((node) => node.id === params.target);

      if (sourceNode && targetNode) {
        if (params.source === params.target) {
          addNotification({ type: "warning", message: "Cannot connect a node to itself" });
          return;
        }

        // Remove connected nodes from tracking
        if (params.source) {
          setNewlyAddedNodes((prev) => {
            const newSet = new Set(prev);
            newSet.delete(params.source!);
            return newSet;
          });
        }

        if (params.target) {
          setNewlyAddedNodes((prev) => {
            const newSet = new Set(prev);
            newSet.delete(params.target!);
            return newSet;
          });
        }

        // Reset viewport when nodes are connected
        if (reactFlowInstance && defaultViewportRef.current) {
          console.log("📍 Resetting viewport on connect");
          reactFlowInstance.setViewport(defaultViewportRef.current, { duration: 700 });
        }
      }

      setEdges((eds) =>
        addEdge(
          {
            ...params,
            id: edgeId,
            animated: true,
            style: { stroke: "rgba(149, 76, 233, 0.6)", strokeWidth: 2 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: "rgba(149, 76, 233, 0.6)",
            },
          },
          eds
        )
      );

      addNotification({ type: "success", message: "Connection created" });
    },
    [edges, nodes, reactFlowInstance, setEdges, addNotification]
  );

  // 🎯 DRAG AND DROP HANDLERS
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!reactFlowBounds || !reactFlowInstance) return;

      const dataStr = event.dataTransfer.getData("application/reactflow");
      if (!dataStr) return;

      try {
        const { type, name } = JSON.parse(dataStr);

        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const nodeId = `${Date.now()}`;
        const newNode = {
          id: nodeId,
          type,
          position,
          data: getNodeData(type, name),
        };

        setNodes((nds) => nds.concat(newNode));

        // Track newly added node
        setNewlyAddedNodes((prev) => new Set(prev).add(nodeId));

        addNotification({ type: "success", message: `Added ${name} to the flow` });
      } catch (error) {
        console.error("❌ Error adding node:", error);
        addNotification({ type: "error", message: "Failed to add component to the flow" });
      }
    },
    [reactFlowInstance, setNodes, addNotification]
  );

  // 🎯 PROGRAMMATIC NODE ADDITION
  const addNodeToFlow = useCallback(
    (type: string, name: string, position?: { x: number; y: number }) => {
      console.log("🎯 addNodeToFlow called with:", { type, name, position });

      try {
        const nodeId = `${Date.now()}`;

        // Calculate position in viewport center if not provided
        let newPosition = position;
        if (!position && reactFlowInstance) {
          const { x, y, zoom } = reactFlowInstance.getViewport();
          const centerX = (window.innerWidth / 2 - x) / zoom;
          const centerY = (window.innerHeight / 2 - y) / zoom;
          newPosition = { x: centerX, y: centerY };
        } else if (!position) {
          newPosition = {
            x: Math.random() * 500 + 100,
            y: Math.random() * 300 + 100,
          };
        }

        const newNode = {
          id: nodeId,
          type,
          position: newPosition!,
          data: getNodeData(type, name),
        };

        setNodes((nds) => nds.concat(newNode));
        setNewlyAddedNodes((prev) => new Set(prev).add(nodeId));

        addNotification({ type: "success", message: `Added ${name} to the flow` });
      } catch (error) {
        console.error("❌ Error in addNodeToFlow:", error);
        addNotification({ type: "error", message: "Failed to add component to the flow" });
    }
    },
    [reactFlowInstance, setNodes, addNotification]
  );

  /**
   * 💾 Save workflow to backend
   */
  const handleSaveFlow = async () => {
    setSaving(true);

    if (!reactFlowInstance) {
      addNotification({ type: "error", message: "ReactFlow instance not ready." });
      setSaving(false);
      return;
    }

    try {
      console.log('🔄 Starting workflow save process...');
      
      // Debug authentication status first
      const authStatus = await import('@/lib/api/client').then(module => module.debugAuthStatus());
      console.log('🔍 Authentication status:', authStatus);
      
      const flow = reactFlowInstance.toObject();
      console.log('📊 Flow data to save:', {
        nodeCount: flow.nodes.length,
        edgeCount: flow.edges.length,
        hasViewport: !!flow.viewport
      });

      const workflowDefinition = {
        nodes: flow.nodes,
        edges: flow.edges,
        viewport: flow.viewport,
      };

      console.log('📝 Workflow definition prepared:', {
        size: JSON.stringify(workflowDefinition).length,
        nodeTypes: flow.nodes.map(n => n.type),
        definitionKeys: Object.keys(workflowDefinition)
      });

      let savedWorkflow;
      if (workflowData && workflowData.id) {
        console.log('🔄 Updating existing workflow:', workflowData.id);
        // Update existing workflow
        savedWorkflow = await workflowService.updateWorkflow(
          workflowData.id.toString(),
          { definition: workflowDefinition }
        );
        console.log("✅ Workflow updated:", savedWorkflow);
      } else {
        console.log('🆕 Creating new workflow...');
        // Create new workflow
        const workflowName = prompt("Enter workflow name:") || `Workflow ${new Date().toLocaleString()}`;
        
        const newWorkflowData = {
          name: workflowName,
          description: "Created with Flow Editor",
          definition: workflowDefinition,
          is_active: true,
        };
        
        console.log('📦 New workflow data:', newWorkflowData);
        
        savedWorkflow = await workflowService.createWorkflow(newWorkflowData);
        setWorkflowData(savedWorkflow);
        console.log("✅ New workflow created:", savedWorkflow);
        
        // Update URL to include workflow ID
        router.push(`/dashboard/flow/${savedWorkflow.id}`);
      }

      setLastSaved(new Date());
      addNotification({ type: "success", message: "Workflow saved successfully!" });
    } catch (error: any) {
      console.error("❌ Failed to save workflow - Full error details:", {
        message: error?.message || 'Unknown error',
        status: error?.response?.status || 'No status',
        statusText: error?.response?.statusText || 'No status text',
        responseData: error?.response?.data || 'No response data',
        requestUrl: error?.config?.url || 'Unknown URL',
        requestMethod: error?.config?.method || 'Unknown method',
        isAuthError: error?.response?.status === 401,
        isBadRequest: error?.response?.status === 400,
        isNetworkError: !error?.response,
        fullError: error
      });
      
      // Provide specific error messages based on error type
      let errorMessage = 'Failed to save workflow';
      
      if (error?.response?.status === 400) {
        errorMessage = 'Invalid workflow data - please check your flow configuration';
        console.error('🔍 400 Bad Request details:', error?.response?.data);
      } else if (error?.response?.status === 401) {
        errorMessage = 'Authentication required - please log in again';
      } else if (error?.response?.status === 403) {
        errorMessage = 'Permission denied - you may not have access to save workflows';
      } else if (error?.response?.status >= 500) {
        errorMessage = 'Server error - please try again later';
      } else if (!error?.response) {
        errorMessage = 'Network error - please check your connection and try again';
      } else {
        errorMessage = `Server error (${error?.response?.status}): ${error?.message || 'Unknown error'}`;
      }
      
      addNotification({ 
        type: "error", 
        message: errorMessage 
      });
      
      // If it's a network error, suggest checking backend status
      if (!error?.response) {
        console.error('🌐 Network error detected - backend may be unreachable');
        console.error('💡 Suggestion: Check if Django backend is running on http://localhost:8000');
        
        // Create local fallback save for demo purposes
        console.log('🎭 Creating local demo save as fallback...');
        try {
          const localWorkflow = {
            id: `demo-${Date.now()}`,
            name: `Demo Workflow ${new Date().toLocaleString()}`,
            description: "Created with Flow Editor (Demo Mode)",
            definition: {
              nodes: reactFlowInstance?.toObject()?.nodes || [],
              edges: reactFlowInstance?.toObject()?.edges || [],
              viewport: reactFlowInstance?.toObject()?.viewport || {}
            },
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          setWorkflowData(localWorkflow);
          setLastSaved(new Date());
          console.log("📱 Created local demo workflow:", localWorkflow);
          
          addNotification({ 
            type: "warning", 
            message: "Backend unavailable - workflow saved in demo mode" 
          });
          return;
        } catch (fallbackError) {
          console.error('❌ Even fallback save failed:', fallbackError);
        }
      }
    } finally {
      setSaving(false);
    }
  };

  /**
   * ▶️ Execute workflow with real AI processing
   */
  const handleExecuteFlow = async () => {
    try {
      setExecuting(true);
      
      console.log('🚀 Starting workflow execution...');
      console.log('📊 Nodes:', nodes.length, 'Edges:', edges.length);
      console.log('🔍 Node details:', nodes.map(n => ({ id: n.id, type: n.type, data: n.data })));
      
      // Check if we have the required nodes
      const hasInput = nodes.some(n => 
        n.type === 'input' || 
        n.type === 'chatInput' || 
        n.type === 'text-input'
      );
      const hasAI = nodes.some(n => 
        n.type === 'anthropic' || 
        n.type === 'openai' || 
        n.type === 'modelNode' || 
        n.type === 'model-node' || 
        n.type === 'deepseek' || 
        n.type === 'ollama' || 
        n.type === 'huggingface' || 
        n.type === 'gemini'
      );
      const hasOutput = nodes.some(n => 
        n.type === 'output' || 
        n.type === 'chatOutput' || 
        n.type === 'text-output'
      );
      
      console.log('🔍 Node validation:', { hasInput, hasAI, hasOutput });
      
      if (!hasInput) {
        throw new Error('No input node found. Please add a Chat Input node.');
      }
      
      if (!hasAI) {
        throw new Error('No AI node found. Please add an AI model node.');
    }
      
      if (!hasOutput) {
        throw new Error('No output node found. Please add a Chat Output node.');
      }
      
      // Import and use the real execution engine
      console.log('📦 Importing WorkflowExecutionEngine...');
      const { WorkflowExecutionEngine } = await import('@/lib/api/workflow-execution');
      console.log('✅ WorkflowExecutionEngine imported successfully');
      
      const engine = new WorkflowExecutionEngine(nodes, edges);
      console.log('🏗️ Execution engine created');

      // Execute the workflow
      console.log('▶️ Starting execution...');
      const result = await engine.execute();
      console.log('🎯 Execution result:', result);
      
      if (result.success) {
        addNotification({
          type: "success",
          message: `✅ Workflow executed successfully! Processed ${result.executionOrder.length} nodes.`,
        });
        
        console.log('🎉 Execution completed successfully:', result);
        
      } else {
        addNotification({
          type: "error",
          message: `❌ Execution failed: ${result.errors.join(', ')}`,
        });
        
        console.error('💥 Execution failed:', result.errors);
      }
      
    } catch (error) {
      console.error('🚨 Execution error:', error);
      addNotification({
        type: "error",
        message: `💥 Execution error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } finally {
      setExecuting(false);
    }
  };

  /**
   * 🗑️ Delete selected nodes/edges
   */
  const handleDeleteSelected = async () => {
    const selectedNodes = nodes.filter((node) => node.selected);
    const selectedEdges = edges.filter((edge) => edge.selected);

    if (selectedNodes.length === 0 && selectedEdges.length === 0) {
      addNotification({ type: "warning", message: "No items selected for deletion" });
      return;
    }

    // Remove from frontend
    setNodes((nodes) => nodes.filter((node) => !node.selected));
    setEdges((edges) => edges.filter((edge) => !edge.selected));

    setSelectedNode(null);

    addNotification({ type: "success", message: "Selected items have been removed" });
  };

  /**
   * 📝 Update node data
   */
  const handleNodeDataUpdate = (nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...newData,
            },
          };
        }
        return node;
      })
    );

    addNotification({ type: "info", message: "Node updated successfully" });
  };

  /**
   * 🐛 Debug flow
   */
  const debugFlow = useCallback(() => {
    console.log("🔍 FLOW DEBUG INFO:");
    console.log("Current Nodes:", nodes);
    console.log("Current Edges:", edges);
    console.log("Workflow Data:", workflowData);
    console.log("AI Configs:", aiConfigs);

    const debugInfo = `
🔍 Flow Debug Report:
📊 ${nodes.length} nodes, ${edges.length} edges
🤖 ${aiConfigs.length} AI configs loaded
💾 Last saved: ${lastSaved ? lastSaved.toLocaleTimeString() : "Never"}
    `.trim();

    addNotification({ type: "info", message: debugInfo });
  }, [nodes, edges, workflowData, aiConfigs, lastSaved, addNotification]);

  /**
   * 🧪 Simple test execution for debugging
   */
  const testExecution = async () => {
    console.log('🧪 Testing execution system...');
    
    // Test 1: Check if nodes have data
    console.log('📊 Current nodes:', nodes);
    
    // Test 2: Check if API is reachable
    try {
      console.log('🔗 Testing API connection...');
      const response = await fetch('http://localhost:8000/api/ai/aimodelconfig/');
      console.log('📡 API Response:', response.status, response.ok);
    } catch (error) {
      console.error('🚨 API Connection failed:', error);
    }
    
    // Test 3: Test execution engine import
    try {
      console.log('📦 Testing execution engine import...');
      const { WorkflowExecutionEngine } = await import('@/lib/api/workflow-execution');
      console.log('✅ Execution engine imported successfully');
      
      // Create a simple test
      const testNodes = [
        { id: '1', type: 'text-input', data: { text: 'What is Capital of India' } },
        { id: '2', type: 'anthropic', data: { model: 'claude-3-5-sonnet-20241022' } },
        { id: '3', type: 'text-output', data: {} }
      ];
      const testEdges = [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-3', source: '2', target: '3' }
      ];
      
      const engine = new WorkflowExecutionEngine(testNodes as any, testEdges as any);
      console.log('🏗️ Test engine created successfully');
      
      addNotification({
        type: "info",
        message: "🧪 Debug test completed - check console for details"
      });
      
    } catch (error) {
      console.error('💥 Test failed:', error);
      addNotification({
        type: "error",
        message: `🧪 Debug test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  };

  /**
   * 🔧 Debug authentication and connection status
   */
  const debugConnection = async () => {
    console.log('🔍 === CONNECTION DEBUG REPORT ===');
    
    try {
      // Check authentication status
      const { debugAuthStatus } = await import('@/lib/api/client');
      const authStatus = await debugAuthStatus();
      console.log('🔑 Authentication Status:', authStatus);
      
      // Check if backend is reachable
      console.log('🌐 Testing backend connectivity...');
      const testUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      try {
        const response = await fetch(`${testUrl}/api/workflows/workflows/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        console.log('📡 Backend Response:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          url: response.url
        });
        
        if (response.ok) {
          console.log('✅ Backend is reachable and responding');
        } else {
          console.log('⚠️ Backend responded with error status');
        }
      } catch (networkError) {
        console.log('❌ Backend connectivity test failed:', networkError);
        console.log('💡 This suggests the Django backend is not running');
      }
      
      // Check session state
      const session = await import('next-auth/react').then(module => module.getSession());
      console.log('👤 NextAuth Session:', {
        hasSession: !!session,
        userEmail: session?.user?.email,
        hasAccessToken: !!session?.jwtAccessToken
      });
      
      // Test Google OAuth backend sync if user is logged in via Google
      if (session?.user?.email) {
        console.log('🔍 Testing Google OAuth backend sync...');
        try {
          const googleSyncResponse = await fetch(`${testUrl}/api/users/google/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: session.user.email,
              name: session.user.name,
              image: session.user.image,
              google_id: 'test-id',
            }),
          });
          
          console.log('🔗 Google OAuth sync response:', {
            status: googleSyncResponse.status,
            statusText: googleSyncResponse.statusText,
            ok: googleSyncResponse.ok,
          });
          
          if (googleSyncResponse.ok) {
            const syncData = await googleSyncResponse.json();
            console.log('✅ Google OAuth sync data (RAW):', syncData);
            console.log('🔍 Token details:', {
              hasAccessToken: !!syncData.access_token,
              hasRefreshToken: !!syncData.refresh_token,
              accessTokenType: typeof syncData.access_token,
              refreshTokenType: typeof syncData.refresh_token,
              accessTokenPreview: syncData.access_token ? syncData.access_token.substring(0, 50) + '...' : 'NONE',
              refreshTokenPreview: syncData.refresh_token ? syncData.refresh_token.substring(0, 50) + '...' : 'NONE',
              userId: syncData.id,
              username: syncData.username
            });
          } else {
            const errorText = await googleSyncResponse.text();
            console.log('❌ Google OAuth sync failed:', errorText);
          }
        } catch (syncError) {
          console.log('💥 Google OAuth sync error:', syncError);
        }
      }
      
    } catch (error) {
      console.error('❌ Debug failed:', error);
    }
    
    console.log('🔍 === END DEBUG REPORT ===');
  };

  // 🎯 EXPOSE ADD NODE FUNCTION
  useEffect(() => {
    if (onAddNodeReady) {
      onAddNodeReady(addNodeToFlow);
    }
  }, [addNodeToFlow, onAddNodeReady]);

  // 🎨 LOADING STATE
  if (!isReactFlowLoaded || loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#050505]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
          <p className="text-white/70">
            {loading ? "Loading workflow data..." : "Loading flow editor..."}
          </p>
          {lastSaved && (
            <p className="text-white/50 text-sm">
              Last saved: {lastSaved.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>
    );
  }

  // 🎨 MAIN RENDER
  return (
    <div className="flex-1 relative" ref={reactFlowWrapper}>
      {/* 🚨 STATUS BAR */}
      <div className="absolute top-4 left-4 z-50 flex items-center space-x-2">
        {workflowData && (
          <div className="bg-black/70 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-1 text-sm text-white">
            <span className="text-white/70">Workflow:</span> {workflowData.name}
          </div>
        )}
        
        {lastSaved && (
          <div className="bg-black/70 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-1 text-sm text-green-400">
            ✅ Saved {lastSaved.toLocaleTimeString()}
          </div>
        )}

        {autoSaveEnabled && (
          <div className="bg-black/70 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-1 text-sm text-blue-400">
            🔄 Auto-save enabled
          </div>
        )}

        {aiConfigs.length > 0 && (
          <div className="bg-black/70 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-1 text-sm text-purple-400">
            🤖 {aiConfigs.length} AI models
          </div>
        )}
      </div>

      {/* 🎨 MAIN REACT FLOW */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChangeHandler}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        className="bg-[#050505]"
        defaultEdgeOptions={{
          style: { stroke: "rgba(149, 76, 233, 0.8)", strokeWidth: 3 },
          animated: true,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "rgba(149, 76, 233, 0.8)",
          },
        }}
        connectionLineType={ConnectionLineType.SmoothStep}
        connectionLineStyle={{
          stroke: "rgba(149, 76, 233, 0.8)",
          strokeWidth: 3,
          strokeDasharray: "5,5",
        }}
        deleteKeyCode={["Backspace", "Delete"]}
        selectionKeyCode={["Control", "Meta"]}
        multiSelectionKeyCode={["Shift"]}
      >
        <Background
          color="rgba(255, 255, 255, 0.1)"
          gap={20}
          size={1.5}
          variant={BackgroundVariant.Dots}
          style={{ backgroundColor: "#030303" }}
        />
        
        <Controls 
          className="bg-black/50 border border-white/10 rounded-md p-1 shadow-lg" 
          showInteractive={false} 
        />
        
        <MiniMap
          nodeColor={(node) => {
            switch (node.type) {
              case "text-input":
                return "rgba(59, 130, 246, 0.6)";
              case "openai":
                return "rgba(16, 185, 129, 0.6)";
              case "text-output":
                return "rgba(139, 92, 246, 0.6)";
              case "prompt-template":
                return "rgba(245, 158, 11, 0.6)";
              case "agent":
                return "rgba(239, 68, 68, 0.6)";
              default:
                return "rgba(255, 255, 255, 0.2)";
            }
          }}
          maskColor="rgba(0, 0, 0, 0.7)"
          className="rounded-md border border-white/10 bg-black/50 shadow-lg"
        />

        {/* 🎛️ CONTROL PANEL */}
        <Panel position="top-right" className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-black/50 border-white/10 text-white hover:bg-white/10 shadow-lg"
            onClick={onOpenPlayground}
            disabled={executing}
          >
            <Play className="mr-2 h-4 w-4" />
            Playground
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="bg-black/50 border-white/10 text-white hover:bg-white/10 shadow-lg"
            onClick={onOpenApiCodespace}
          >
            <Code className="mr-2 h-4 w-4" />
            API
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="bg-black/50 border-white/10 text-white hover:bg-white/10 shadow-lg"
            onClick={handleSaveFlow}
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {saving ? "Saving..." : "Save"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="bg-black/50 border-white/10 text-white hover:bg-white/10 shadow-lg"
            onClick={handleExecuteFlow}
            disabled={executing}
          >
            {executing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Play className="mr-2 h-4 w-4" />
            )}
            {executing ? "Executing..." : "Execute"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="bg-red-900/50 border-red-500/20 text-red-200 hover:bg-red-800/50 shadow-lg"
            onClick={debugConnection}
            title="Debug connection and authentication issues"
          >
            <Bug className="mr-2 h-4 w-4" />
            Debug
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="bg-black/50 border-white/10 text-white hover:bg-white/10 shadow-lg"
            onClick={handleDeleteSelected}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="bg-black/50 border-white/10 text-white hover:bg-white/10 shadow-lg"
            onClick={() => {
              debugFlow();
              testExecution();
            }}
          >
            <Bug className="mr-2 h-4 w-4" />
            Debug
          </Button>

          <Button
            variant="outline"
            size="sm"
            className={`bg-black/50 border-white/10 text-white hover:bg-white/10 shadow-lg ${
              autoSaveEnabled ? "bg-green-500/20 border-green-500/30" : ""
            }`}
            onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
          >
            <Save className="mr-2 h-4 w-4" />
            Auto-save: {autoSaveEnabled ? "ON" : "OFF"}
          </Button>
        </Panel>


      </ReactFlow>

      {/* 🎛️ NODE PROPERTIES PANEL */}
      {selectedNode && (
        <NodePropertiesPanel
          nodeId={selectedNode.id}
          nodeData={selectedNode.data}
          onClose={() => {
            setSelectedNode(null);
          }}
          onUpdate={handleNodeDataUpdate}
        />
      )}
    </div>
  );
}
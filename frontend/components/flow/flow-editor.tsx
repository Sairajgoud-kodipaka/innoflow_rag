"use client";

import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Code, Play, Save, Trash, Bug, Plus, Loader2, AlertCircle } from "lucide-react";
import { ModelNode } from "@/components/flow/nodes/model-node";
import { InputNode } from "@/components/flow/nodes/input-node";
import { OutputNode } from "@/components/flow/nodes/output-node";
import { AgentNode } from "@/components/flow/nodes/agent-node";
import { PromptNode } from "@/components/flow/nodes/prompt-node";
import { NodePropertiesPanel } from "@/components/flow/node-properties-panel";
import { AnthropicNode } from "@/components/flow/nodes/anthropic-node";
import { HuggingFaceNode } from "@/components/flow/nodes/huggingface-node";
import { LocalModelNode } from "@/components/flow/nodes/local-model-node";
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

import type { Node, Edge, Connection, NodeTypes, NodeChange, EdgeChange } from "reactflow";
import { MarkerType, ConnectionLineType, BackgroundVariant, useNodesState, useEdgesState } from "reactflow";
import { addEdge } from "reactflow";

import "reactflow/dist/style.css";

// 🎯 API INTEGRATION - Import backend services
import { workflowService } from "@/lib/api/workflows";
import { aiService, AIModelConfig } from "@/lib/api/ai";
import { taskStatusService } from "@/lib/api/taskStatus";
import { useAuth } from "../../hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api/client";
import { NodeProps, Node as ReactFlowNode } from 'reactflow';
import {
  NodeType,
  WorkflowNode,
  WorkflowTask,
  AIConfig,
  AIProvider,
  AIModel,
  ApiResponse,
  PaginatedResponse,
  NodeRegistry,
  CustomNodeTypes,
  NodeData,
  FlowNodeData,
  AINodeData,
  isNodeData,
  isAIConfig,
  convertApiNodeToFlowNode,
  convertApiAIConfigToFlowConfig
} from '@/lib/types/flow';
import {
  ApiResponse as ApiResponseType,
  ApiWorkflowNode,
  ApiAIModelConfig,
  isApiResponse,
  assertApiResponse,
  assertApiWorkflowNode,
  assertApiAIModelConfig
} from '@/lib/types/api';

// Import the new services
import { nodeService } from '@/lib/api/nodes';
import { aiProviderService } from '@/lib/api/ai-provider';

// Dynamic imports for SSR compatibility
const ReactFlow = dynamic(() => import("reactflow").then((mod) => mod.ReactFlow), { ssr: false });
const Background = dynamic(() => import("reactflow").then((mod) => mod.Background), { ssr: false });
const Controls = dynamic(() => import("reactflow").then((mod) => mod.Controls), { ssr: false });
const MiniMap = dynamic(() => import("reactflow").then((mod) => mod.MiniMap), { ssr: false });
const Panel = dynamic(() => import("reactflow").then((mod) => mod.Panel), { ssr: false });

// 🔧 INTERFACES AND TYPES
interface FlowEditorProps {
  flowId: string;
  onOpenPlayground: () => void;
  onOpenApiCodespace: () => void;
  onAddNodeReady?: (addNodeFunction: (type: string, name: string) => void) => void;
}

interface WorkflowData {
  id?: number;
  name: string;
  description?: string;
  definition: {
    nodes: Node[];
    edges: Edge[];
    viewport?: any;
  };
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// 🎨 NODE TYPES REGISTRY
const nodeTypes: Record<string, ComponentType<NodeProps>> = {
  openai: ModelNode,
  anthropic: AnthropicNode,
  huggingface: HuggingFaceNode,
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
const getNodeData = (type: string, name: string, aiConfigs: AIConfig[] = []): NodeData => {
  const nodeType = nodeTypes[type];
  const baseData: FlowNodeData = { 
    workflow: 0, // Will be set when creating node
    node_type: type,
    name: name,
    label: name, 
    aiConfigs,
    description: nodeType?.description || '',
    config_schema: nodeType?.config_schema || {},
    config: {}
  };

  switch (type) {
    case 'openai':
      return { 
        ...baseData, 
        model: 'gpt-4o-mini', 
        temperature: 0.7, 
        systemMessage: 'You are a helpful assistant.',
        provider: 'openai'
      } as AINodeData;
    case 'text-input':
      return { ...baseData, inputs: { text: "" } } as FlowNodeData;
    case 'prompt-template':
      return { ...baseData, template: "Write a response about {{topic}}" } as FlowNodeData;
    case 'agent':
      return { ...baseData, instructions: "You are a helpful assistant." } as FlowNodeData;
    case 'api-input':
      return { 
        ...baseData, 
        apiUrl: "", 
        method: "GET", 
        headers: "", 
        body: "", 
        autoFetch: false, 
        pollingInterval: 0 
      } as FlowNodeData;
    case 'anthropic':
      return { 
        ...baseData, 
        model: 'claude-3-sonnet-20240229', 
        temperature: 0.7, 
        systemMessage: 'You are a helpful assistant.',
        provider: 'anthropic'
      } as AINodeData;
    case 'huggingface':
      return { 
        ...baseData, 
        model: 'gpt2', 
        temperature: 0.7,
        provider: 'huggingface'
      } as AINodeData;
    case 'local-model':
      return { ...baseData, model: "llama2", temperature: 0.7 } as AINodeData;
    case 'file-input':
      return { ...baseData, acceptedTypes: ".txt,.csv,.json" } as FlowNodeData;
    case 'stream-output':
      return { ...baseData, output: "" } as FlowNodeData;
    case 'file-output':
      return { ...baseData, fileName: "output.txt" } as FlowNodeData;
    case 'few-shot':
      return { ...baseData, examples: [] } as FlowNodeData;
    case 'tool':
      return { ...baseData, functionName: "" } as FlowNodeData;
    case 'multi-agent':
      return { ...baseData, agents: [] } as FlowNodeData;
    case 'conversation-memory':
      return { ...baseData, windowSize: 5 } as FlowNodeData;
    case 'buffer-memory':
      return { ...baseData, bufferSize: 10 } as FlowNodeData;
    case 'sequential-chain':
      return { ...baseData, chains: [] } as FlowNodeData;
    case 'router-chain':
      return { ...baseData, routes: [] } as FlowNodeData;
    case 'vector-store':
      return { ...baseData, vectorDB: "", dimension: 0 } as FlowNodeData;
    case 'document-loader':
      return { ...baseData, loaderType: "" } as FlowNodeData;
    case 'text-splitter':
      return { ...baseData, chunkSize: 1000, chunkOverlap: 200 } as FlowNodeData;
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
        data: { label: "Chat Input", inputs: { text: "Hello" } },
      },
      {
        id: "2",
        type: "openai",
        position: { x: 250, y: 250 },
        data: {
          label: "OpenAI",
          model: "gpt-4o-mini",
          temperature: 0.7,
          systemMessage: "You are a helpful assistant.",
        },
      },
      {
        id: "3",
        type: "text-output",
        position: { x: 250, y: 400 },
        data: { label: "Chat Output" },
      },
    ];
  }

  if (flowId === "flow-2") {
    return [
      {
        id: "1",
        type: "text-input",
        position: { x: 100, y: 100 },
        data: { label: "User Query", inputs: { text: "" } },
      },
      {
        id: "2",
        type: "vector-store",
        position: { x: 300, y: 100 },
        data: { label: "Vector Store", vectorDB: "pinecone", dimension: 1536 },
      },
      {
        id: "3",
        type: "openai",
        position: { x: 500, y: 100 },
        data: { label: "OpenAI", model: "gpt-4o-mini", temperature: 0.7 },
      },
      {
        id: "4",
        type: "text-output",
        position: { x: 700, y: 100 },
        data: { label: "Response" },
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

// Add type conversion helper
const convertWorkflowToWorkflowData = (workflow: any): WorkflowData => ({
  id: workflow.id,
  name: workflow.name,
  description: workflow.description,
  definition: workflow.config || { nodes: [], edges: [] },
  is_active: workflow.is_active,
  created_at: workflow.created_at,
  updated_at: workflow.updated_at
});

// Add type conversion for AI configs
const convertAIModelConfig = (config: AIModelConfig): AIConfig => ({
  id: config.id,
  name: config.name,
  provider: config.provider,
  model: config.model,
  temperature: config.temperature,
  systemMessage: config.systemMessage,
  config: config.config
});

// 🚀 MAIN FLOW EDITOR COMPONENT
export function FlowEditor({ flowId, onOpenPlayground, onOpenApiCodespace, onAddNodeReady }: FlowEditorProps) {
  // 🔐 AUTHENTICATION & ROUTING
  const { user } = useAuth();
  const router = useRouter();
  const { addNotification } = useNotifications();

  // Add notification helper
  const notify = useCallback((type: 'success' | 'error' | 'info' | 'warning', message: string) => {
    addNotification({ type, message });
  }, [addNotification]);

  // 📱 REACT FLOW STATE
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<ReactFlowNode<NodeData>[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<ReactFlowNode<NodeData> | null>(null);
  const [selectedNodeData, setSelectedNodeData] = useState<any>(null);
  const [isReactFlowLoaded, setIsReactFlowLoaded] = useState(false);

  // 🎯 BACKEND INTEGRATION STATE
  const [workflowData, setWorkflowData] = useState<WorkflowData | null>(null);
  const [aiConfigs, setAiConfigs] = useState<AIConfig[]>([]);
  const [backendNodes, setBackendNodes] = useState<any[]>([]);

  // 📊 UI STATE
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // 🔧 TRACKING STATE
  const [newlyAddedNodes, setNewlyAddedNodes] = useState<Set<string>>(new Set());
  const defaultViewportRef = useRef<{ x: number; y: number; zoom: number } | null>(null);
  const [reactFlowUtils, setReactFlowUtils] = useState<{
    onNodesChange?: any;
    onEdgesChange?: any;
    addEdge?: any;
  }>({});

  // Add new state for node types and providers
  const [nodeTypes, setNodeTypes] = useState<NodeRegistry>({});
  const [aiProviders, setAIProviders] = useState<AIProvider[]>([]);
  const [loadingNodeTypes, setLoadingNodeTypes] = useState(false);
  const [loadingProviders, setLoadingProviders] = useState(false);

  // Add new state variables
  const [workflowNodes, setWorkflowNodes] = useState<WorkflowNode[]>([]);
  const [workflowTasks, setWorkflowTasks] = useState<WorkflowTask[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);

  // 🚀 INITIALIZATION
  useEffect(() => {
    let isMounted = true;

    const initializeReactFlow = async () => {
      try {
        const reactflow = await import("reactflow");
        if (!isMounted) return;

        setReactFlowUtils({
          onNodesChange: reactflow.applyNodeChanges,
          onEdgesChange: reactflow.applyEdgeChanges,
          addEdge: reactflow.addEdge,
        });

        setIsReactFlowLoaded(true);
        console.log("✅ ReactFlow initialized");
      } catch (error) {
        console.error("❌ Failed to initialize ReactFlow:", error);
      }
    };

    initializeReactFlow();

    return () => {
      isMounted = false;
    };
  }, []);

  // 🎯 LOAD INITIAL DATA FROM BACKEND
  useEffect(() => {
    if (isReactFlowLoaded) {
      loadInitialData();
    }
  }, [isReactFlowLoaded, flowId]);

  // Add new functions to fetch node types and providers
  const loadNodeTypes = async () => {
    setLoadingNodeTypes(true);
    try {
      const response = await apiClient.get<NodeType[]>('/workflows/node-types/');
      // Convert array to record
      const nodeTypesRecord = response.data.reduce((acc: Record<string, NodeType>, nodeType: NodeType) => {
        acc[nodeType.id] = {
          ...nodeType,
          component: nodeTypes[nodeType.id]?.component || ModelNode // Default to ModelNode
        };
        return acc;
      }, {});
      setNodeTypes(nodeTypesRecord);
      console.log('✅ Node types loaded:', Object.keys(nodeTypesRecord).length);
    } catch (error) {
      console.error('❌ Failed to load node types:', error);
      notify('error', 'Failed to load node types');
    } finally {
      setLoadingNodeTypes(false);
    }
  };

  const loadAIProviders = async () => {
    setLoadingProviders(true);
    try {
      const response = await apiClient.get<AIProvider[]>('/ai/providers/');
      setAIProviders(response.data);
      console.log('✅ AI providers loaded:', response.data.length);
    } catch (error) {
      console.error('❌ Failed to load AI providers:', error);
      notify('error', 'Failed to load AI providers');
    } finally {
      setLoadingProviders(false);
    }
  };

  /**
   * 📊 Load workflow and AI configurations from backend
   */
  const loadInitialData = async () => {
    setLoading(true);
    console.log("🔄 Loading initial data for flowId:", flowId);

    try {
      // Load node types and providers
      const [nodeTypesResponse, providersResponse] = await Promise.all([
        nodeService.getNodeTypes(),
        aiProviderService.getProviders()
      ]);

      // Set node types
      const nodeTypesRecord = nodeTypesResponse.reduce((acc: NodeRegistry, nodeType: NodeType) => {
        acc[nodeType.id] = {
          ...nodeType,
          component: nodeTypes[nodeType.id]?.component || ModelNode,
          type: nodeType.id,
          draggable: true,
          selectable: true,
          connectable: true,
          deletable: true
        };
        return acc;
      }, {});
      setNodeTypes(nodeTypesRecord);

      // Set AI providers
      setAIProviders(providersResponse);

      // Load workflow nodes if we have a workflow ID
      if (flowId && flowId !== "new") {
        try {
          const workflowNodes = await nodeService.getWorkflowNodes(flowId);
          const flowNodes = workflowNodes.map(convertApiNodeToFlowNode);
          setNodes(flowNodes);
          console.log("✅ Workflow nodes loaded:", flowNodes.length);
        } catch (error) {
          console.error("❌ Failed to load workflow nodes:", error);
          notify("error", "Failed to load workflow nodes");
        }
      }

      notify("success", "Initial data loaded successfully!");
    } catch (error) {
      console.error("❌ Failed to load initial data:", error);
      notify("error", "Failed to load initial data");
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

  // 🎯 AUTO-SAVE FUNCTIONALITY
  useEffect(() => {
    if (autoSaveEnabled && workflowData?.id && reactFlowInstance) {
      const autoSaveTimer = setTimeout(() => {
        handleSaveFlowSilently();
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(autoSaveTimer);
    }
  }, [nodes, edges, autoSaveEnabled, workflowData?.id]);

  // 🔧 NODE CHANGE HANDLER WITH BACKEND SYNC
  const onNodesChangeHandler = useCallback(
    (changes: NodeChange[]) => {
      if (!reactFlowUtils.onNodesChange) return;

      // Handle node selection
      const selectChange = changes.find(
        (change) => change.type === "select" && change.selected === true
      );
      if (selectChange && "id" in selectChange && selectChange.id) {
        const nodeId = selectChange.id as string;
        const node = nodes.find((n) => n.id === nodeId);
        if (node) {
          setSelectedNode(node);
          setSelectedNodeData(node.data);
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

        // 🎯 BACKEND SYNC: Update node position in backend
        if (change.type === "position" && !("dragging" in change) && "id" in change && change.position) {
          const nodeId = change.id;
          const backendNode = backendNodes.find(bn => bn.id.toString() === nodeId);
          
          if (backendNode && workflowData?.id) {
            updateNodeInBackend(backendNode.id, {
              position_x: change.position.x,
              position_y: change.position.y,
            });
          }
        }
      }

      setNodes((nds) => reactFlowUtils.onNodesChange(changes, nds));
    },
    [newlyAddedNodes, nodes, reactFlowInstance, reactFlowUtils.onNodesChange, backendNodes, workflowData?.id]
  );

  // 🔗 CONNECTION HANDLER WITH BACKEND SYNC
  const onConnect = useCallback(
    (params: Connection) => {
      if (!reactFlowUtils.addEdge) return;

      const edgeId = `e${params.source}-${params.target}`;

      // Check if connection already exists
      const edgeExists = edges.some((edge) => edge.id === edgeId);
      if (edgeExists) {
        notify("warning", "Connection already exists");
        return;
      }

      const sourceNode = nodes.find((node) => node.id === params.source);
      const targetNode = nodes.find((node) => node.id === params.target);

      if (sourceNode && targetNode) {
        if (params.source === params.target) {
          notify("warning", "Cannot connect a node to itself");
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
        reactFlowUtils.addEdge(
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

      notify("success", "Connection created");
    },
    [edges, nodes, reactFlowInstance, reactFlowUtils.addEdge, addNotification]
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
          data: getNodeData(type, name, aiConfigs),
        };

        setNodes((nds) => nds.concat(newNode));

        // Track newly added node
        setNewlyAddedNodes((prev) => new Set(prev).add(nodeId));

        // 🎯 CREATE NODE IN BACKEND
        if (workflowData?.id) {
          createNodeInBackend(newNode, workflowData.id);
        }

        notify("success", `Added ${name} to the flow`);
      } catch (error) {
        console.error("❌ Error adding node:", error);
        notify("error", "Failed to add component to the flow");
      }
    },
    [reactFlowInstance, setNodes, addNotification, aiConfigs, workflowData?.id]
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
          data: getNodeData(type, name, aiConfigs),
        };

        setNodes((nds) => nds.concat(newNode));
        setNewlyAddedNodes((prev) => new Set(prev).add(nodeId));

        // 🎯 CREATE NODE IN BACKEND
        if (workflowData?.id) {
          createNodeInBackend(newNode, workflowData.id);
        }

        notify("success", `Added ${name} to the flow`);
      } catch (error) {
        console.error("❌ Error in addNodeToFlow:", error);
        notify("error", "Failed to add component to the flow");
      }
    },
    [reactFlowInstance, setNodes, addNotification, aiConfigs, workflowData?.id]
  );

  // 🎯 BACKEND API FUNCTIONS

  /**
   * 📝 Create node in backend
   */
  const createNodeInBackend = async (node: ReactFlowNode<NodeData>, workflowId: number) => {
    try {
      const nodeData: NodeData = {
        workflow: workflowId,
        node_type: node.type || "default",
        name: node.data.label || `Node ${node.id}`,
        config: {
          position: node.position,
          data: node.data,
          type: node.type,
        },
        label: node.data.label,
        description: node.data.description,
        config_schema: node.data.config_schema,
        aiConfigs: node.data.aiConfigs
      };

      const createdNode = await workflowService.createNode(nodeData);
      console.log("✅ Node created in backend:", createdNode);

      // Update backend nodes tracking
      setBackendNodes(prev => [...prev, createdNode]);

      // Update frontend node with backend ID
      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id
            ? { ...n, data: { ...n.data, backendId: createdNode.id } }
            : n
        )
      );
    } catch (error) {
      console.error("❌ Failed to create node in backend:", error);
      notify("error", "Failed to save node to backend");
    }
  };

  /**
   * 📝 Update node in backend
   */
  const updateNodeInBackend = async (backendNodeId: number, updates: Partial<NodeData>) => {
    try {
      const updatedNode = await workflowService.updateNode(backendNodeId.toString(), {
        ...updates,
        workflow: Number(updates.workflow) // Ensure workflow is a number
      });
      console.log("✅ Node updated in backend:", updatedNode);

      // Update backend nodes tracking
      setBackendNodes(prev => 
        prev.map(node => node.id === backendNodeId ? updatedNode : node)
      );
    } catch (error) {
      console.error("❌ Failed to update node in backend:", error);
    }
  };

  /**
   * 💾 Save workflow to backend
   */
  const handleSaveFlow = async () => {
    setSaving(true);

    if (!reactFlowInstance) {
      notify("error", "ReactFlow instance not ready.");
      setSaving(false);
      return;
    }

    try {
      const flow = reactFlowInstance.toObject();

      const workflowDefinition = {
        nodes: flow.nodes,
        edges: flow.edges,
        viewport: flow.viewport,
      };

      let savedWorkflow;
      if (workflowData && workflowData.id) {
        // Update existing workflow
        savedWorkflow = await workflowService.updateWorkflow(
          workflowData.id.toString(),
          { definition: workflowDefinition }
        );
        console.log("✅ Workflow updated:", savedWorkflow);
      } else {
        // Create new workflow
        const workflowName = prompt("Enter workflow name:") || `Workflow ${new Date().toLocaleString()}`;
        savedWorkflow = await workflowService.createWorkflow({
          name: workflowName,
          description: "Created with Flow Editor",
          definition: workflowDefinition,
          is_active: true,
        });
        const workflowData = convertWorkflowToWorkflowData(savedWorkflow);
        setWorkflowData(workflowData);
        console.log("✅ New workflow created:", workflowData);
        
        // Update URL to include workflow ID
        router.push(`/dashboard/flow/${savedWorkflow.id}`);
      }

      setLastSaved(new Date());
      notify("success", "Workflow saved successfully!");
    } catch (error: any) {
      console.error("❌ Failed to save workflow:", error);
      notify("error", `Failed to save workflow: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  /**
   * 💾 Silent auto-save
   */
  const handleSaveFlowSilently = async () => {
    if (!reactFlowInstance || !workflowData?.id) return;

    try {
      const flow = reactFlowInstance.toObject();
      const workflowDefinition = {
        nodes: flow.nodes,
        edges: flow.edges,
        viewport: flow.viewport,
      };

      await workflowService.updateWorkflow(
        workflowData.id.toString(),
        { definition: workflowDefinition }
      );
      
      setLastSaved(new Date());
      console.log("✅ Auto-saved workflow");
    } catch (error) {
      console.error("❌ Auto-save failed:", error);
    }
  };

  /**
   * ▶️ Execute workflow
   */
  const handleExecuteFlow = async () => {
    if (!workflowData?.id) {
      notify("error", "Please save the workflow before executing.");
      return;
    }

    setExecuting(true);
    try {
      // First, save current state
      await handleSaveFlowSilently();

      // Execute workflow
      const result = await workflowService.executeWorkflow(workflowData.id.toString());
      console.log("✅ Workflow execution result:", result);
      
      notify("success", "Workflow executed successfully!");
      onOpenPlayground(); // Open playground to show results
    } catch (error: any) {
      console.error("❌ Workflow execution failed:", error);
      notify("error", `Execution failed: ${error.response?.data?.detail || error.message || 'Unknown error'}`);
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
      notify("warning", "No items selected for deletion");
      return;
    }

    // Delete selected nodes from backend
    for (const node of selectedNodes) {
      const backendNode = backendNodes.find(bn => bn.id.toString() === node.id);
      if (backendNode) {
        try {
          await workflowService.deleteNode(backendNode.id.toString());
          console.log("✅ Node deleted from backend:", backendNode.id);
        } catch (error) {
          console.error("❌ Failed to delete node from backend:", error);
        }
      }
    }

    // Remove from frontend
    setNodes((nodes) => nodes.filter((node) => !node.selected));
    setEdges((edges) => edges.filter((edge) => !edge.selected));

    // Update backend nodes tracking
    const deletedNodeIds = selectedNodes.map(n => {
      const backendNode = backendNodes.find(bn => bn.id.toString() === n.id);
      return backendNode?.id;
    }).filter(Boolean);

    setBackendNodes(prev => prev.filter(node => !deletedNodeIds.includes(node.id)));

    setSelectedNode(null);
    setSelectedNodeData(null);

    notify("success", "Selected items have been removed");
  };

  /**
   * 📝 Update node data
   */
  const handleNodeDataUpdate = (nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          const updatedNode = {
            ...node,
            data: {
              ...node.data,
              ...newData,
            },
          };

          // Update backend node if it exists
          const backendNode = backendNodes.find(bn => bn.id.toString() === nodeId);
          if (backendNode && workflowData?.id) {
            updateNodeInBackend(backendNode.id, {
              config: {
                ...backendNode.config,
                data: updatedNode.data,
              },
            });
          }

          return updatedNode;
        }
        return node;
      })
    );

    if (nodeId === selectedNode?.id) {
      setSelectedNodeData({
        ...selectedNodeData,
        ...newData,
      });
    }

    notify("info", "Node updated successfully");
  };

  /**
   * 🐛 Debug flow
   */
  const debugFlow = useCallback(() => {
    console.log("🔍 FLOW DEBUG INFO:");
    console.log("Current Nodes:", nodes);
    console.log("Current Edges:", edges);
    console.log("Backend Nodes:", backendNodes);
    console.log("Workflow Data:", workflowData);
    console.log("AI Configs:", aiConfigs);

    const orphanedNodes = nodes.filter(
      (node) => !edges.some((edge) => edge.source === node.id || edge.target === node.id)
    );

    const danglingEdges = edges.filter(
      (edge) => !nodes.some((node) => node.id === edge.source) || !nodes.some((node) => node.id === edge.target)
    );

    const circularPaths = findCircularPaths(nodes, edges);

    if (orphanedNodes.length > 0) {
      console.warn("⚠️ Orphaned nodes detected:", orphanedNodes);
    }

    if (danglingEdges.length > 0) {
      console.warn("⚠️ Dangling edges detected:", danglingEdges);
    }

    if (circularPaths.length > 0) {
      console.warn("⚠️ Circular dependencies detected:", circularPaths);
    }

    const debugInfo = `
🔍 Flow Debug Report:
📊 ${nodes.length} nodes, ${edges.length} edges
🔗 ${backendNodes.length} backend nodes
${orphanedNodes.length > 0 ? `⚠️ ${orphanedNodes.length} orphaned nodes` : "✅ No orphaned nodes"}
${danglingEdges.length > 0 ? `⚠️ ${danglingEdges.length} dangling edges` : "✅ No dangling edges"}
${circularPaths.length > 0 ? `⚠️ ${circularPaths.length} circular paths` : "✅ No circular paths"}
💾 Last saved: ${lastSaved ? lastSaved.toLocaleTimeString() : "Never"}
    `.trim();

    notify("info", debugInfo);
  }, [nodes, edges, backendNodes, workflowData, aiConfigs, lastSaved, notify]);

  /**
   * 🔄 Find circular paths in workflow
   */
  const findCircularPaths = (nodes: ReactFlowNode<NodeData>[], edges: Edge[]): string[][] => {
    const adjacencyList: Record<string, string[]> = {};

    nodes.forEach((node) => {
      adjacencyList[node.id] = [];
    });

    edges.forEach((edge) => {
      if (adjacencyList[edge.source]) {
        adjacencyList[edge.source].push(edge.target);
      }
    });

    const visited: Record<string, boolean> = {};
    const recStack: Record<string, boolean> = {};
    const circularPaths: string[][] = [];

    const dfs = (nodeId: string, path: string[] = []) => {
      if (!visited[nodeId]) {
        visited[nodeId] = true;
        recStack[nodeId] = true;
        path.push(nodeId);

        for (const neighbor of adjacencyList[nodeId] || []) {
          if (!visited[neighbor] && dfs(neighbor, [...path])) {
            return true;
          } else if (recStack[neighbor]) {
            const cycleStart = path.indexOf(neighbor);
            circularPaths.push(path.slice(cycleStart));
            return true;
          }
        }
      }

      recStack[nodeId] = false;
      return false;
    };

    for (const node of nodes) {
      if (!visited[node.id]) {
        dfs(node.id);
      }
    }

    return circularPaths;
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
            disabled={executing || !workflowData?.id}
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
            onClick={debugFlow}
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

        {/* ⚠️ ERROR PANEL */}
        {!user && (
          <Panel position="bottom-center">
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-200 text-center">
              <AlertCircle className="h-5 w-5 mx-auto mb-2" />
              <p>Please log in to save and execute workflows</p>
            </div>
          </Panel>
        )}
      </ReactFlow>

      {/* 🎛️ NODE PROPERTIES PANEL */}
      {selectedNode && (
        <NodePropertiesPanel
          nodeId={selectedNode.id}
          nodeData={selectedNodeData}
          onClose={() => {
            setSelectedNode(null);
            setSelectedNodeData(null);
          }}
          onUpdate={handleNodeDataUpdate}
        />
      )}
    </div>
  );
}
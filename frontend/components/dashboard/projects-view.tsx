"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Plus, Puzzle, Loader2, Star } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { workflowService } from "@/lib/api/workflows";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TemplateGallery } from "@/components/dashboard/template-gallery";

type Project = {
  id: string;
  name: string;
  description: string;
  updatedAt: string;
  color: string;
  type: "flow" | "component";
  folder: string;
};

interface Template {
  id: string
  name: string
  description: string
  category: string
  difficulty: "beginner" | "intermediate" | "advanced"
  image: string
}

export function ProjectsView({ 
  selectedFolder, 
  showTemplates = false, 
  setShowTemplates 
}: { 
  selectedFolder?: string; 
  showTemplates?: boolean; 
  setShowTemplates?: (show: boolean) => void; 
}) {
  const { toast } = useToast();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("flows");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [internalShowTemplates, setInternalShowTemplates] = useState(showTemplates);

  // Use provided setShowTemplates or internal state
  const handleSetShowTemplates = setShowTemplates || setInternalShowTemplates;
  const currentShowTemplates = setShowTemplates ? showTemplates : internalShowTemplates;

  // Template data matching the TemplateGallery
  const templates: Template[] = [
    {
      id: "template-1",
      name: "Simple Chatbot",
      description: "A basic chatbot using OpenAI's GPT model",
      category: "chatbots",
      difficulty: "beginner",
      image: "/placeholder.svg?height=100&width=200",
    },
    {
      id: "template-2",
      name: "Document Q&A",
      description: "Answer questions based on document content",
      category: "rag",
      difficulty: "intermediate",
      image: "/placeholder.svg?height=100&width=200",
    },
    {
      id: "template-3",
      name: "Multi-Agent System",
      description: "Multiple agents working together to solve complex tasks",
      category: "agents",
      difficulty: "advanced",
      image: "/placeholder.svg?height=100&width=200",
    },
    {
      id: "template-4",
      name: "Text Summarizer",
      description: "Summarize long documents automatically",
      category: "text-processing",
      difficulty: "beginner",
      image: "/placeholder.svg?height=100&width=200",
    },
    {
      id: "template-5",
      name: "Data Analysis Assistant",
      description: "Analyze and visualize data with AI assistance",
      category: "data",
      difficulty: "intermediate",
      image: "/placeholder.svg?height=100&width=200",
    },
    {
      id: "template-6",
      name: "Content Generator",
      description: "Generate blog posts, social media content, and more",
      category: "content",
      difficulty: "beginner",
      image: "/placeholder.svg?height=100&width=200",
    },
    {
      id: "template-7",
      name: "Custom Knowledge Base",
      description: "Build a RAG system with your own knowledge base",
      category: "rag",
      difficulty: "intermediate",
      image: "/placeholder.svg?height=100&width=200",
    },
    {
      id: "template-8",
      name: "Blank Flow",
      description: "Start from scratch with an empty flow",
      category: "other",
      difficulty: "beginner",
      image: "/placeholder.svg?height=100&width=200",
    },
    // Additional templates
    {
      id: "template-9",
      name: "Personal Assistant",
      description: "A smart personal assistant for scheduling and reminders",
      category: "chatbots",
      difficulty: "intermediate",
      image: "/placeholder.svg?height=100&width=200",
    },
    {
      id: "template-10",
      name: "Customer Support Bot",
      description: "Automated customer support with escalation handling",
      category: "chatbots",
      difficulty: "advanced",
      image: "/placeholder.svg?height=100&width=200",
    },
    {
      id: "template-11",
      name: "Legal Document Analyzer",
      description: "Analyze legal documents and extract key information",
      category: "rag",
      difficulty: "advanced",
      image: "/placeholder.svg?height=100&width=200",
    },
    {
      id: "template-12",
      name: "Research Assistant",
      description: "RAG-powered research assistant for academic papers",
      category: "rag",
      difficulty: "intermediate",
      image: "/placeholder.svg?height=100&width=200",
    },
    {
      id: "template-13",
      name: "CSV Data Processor",
      description: "Process and analyze CSV files with AI insights",
      category: "data",
      difficulty: "beginner",
      image: "/placeholder.svg?height=100&width=200",
    },
    {
      id: "template-14",
      name: "Database Query Assistant",
      description: "Natural language to SQL query generator",
      category: "data",
      difficulty: "intermediate",
      image: "/placeholder.svg?height=100&width=200",
    },
    {
      id: "template-15",
      name: "PDF Extractor",
      description: "Extract and process content from PDF documents",
      category: "text-processing",
      difficulty: "beginner",
      image: "/placeholder.svg?height=100&width=200",
    },
    {
      id: "template-16",
      name: "Document Classifier",
      description: "Automatically classify documents by type and content",
      category: "text-processing",
      difficulty: "intermediate",
      image: "/placeholder.svg?height=100&width=200",
    },
    {
      id: "template-17",
      name: "Email Automation",
      description: "Automated email responses and processing",
      category: "agents",
      difficulty: "intermediate",
      image: "/placeholder.svg?height=100&width=200",
    },
    {
      id: "template-18",
      name: "Social Media Manager",
      description: "Automated social media posting and engagement",
      category: "content",
      difficulty: "advanced",
      image: "/placeholder.svg?height=100&width=200",
    }
  ];

  // Mapping between sidebar folder names and template categories (same as TemplateGallery)
  const folderToCategoryMapping: Record<string, string[]> = {
    "AI Assistants": ["chatbots", "agents"],
    "RAG Applications": ["rag"],
    "Data Processing": ["data", "text-processing"],
    "Document Processing": ["rag", "text-processing"],
    "Chatbots": ["chatbots"],
    "Automation": ["agents", "other"],
    "Team Projects": ["agents", "rag"],
    "Collaboration": ["agents", "content"],
  }

  // Check if we should show templates in main area
  const shouldShowTemplatesInMainArea = () => {
    console.log('🔍 ProjectsView: Checking if should show templates for folder:', selectedFolder)
    return selectedFolder && folderToCategoryMapping[selectedFolder] !== undefined
  }

  // Get filtered templates for selected folder
  const getFilteredTemplates = () => {
    if (!selectedFolder || !folderToCategoryMapping[selectedFolder]) {
      return []
    }

    const allowedCategories = folderToCategoryMapping[selectedFolder]
    const filtered = templates.filter(template => allowedCategories.includes(template.category))
    console.log('📋 ProjectsView: Filtered templates for', selectedFolder, ':', filtered.map(t => t.name))
    return filtered
  }

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        
        // Debug authentication status
        console.log('🔍 Dashboard: Checking authentication status...');
        if (typeof window !== 'undefined') {
          const hasLocalToken = !!localStorage.getItem('access_token');
          const hasRefreshToken = !!localStorage.getItem('refresh_token');
          console.log('🔐 Auth status:', { hasLocalToken, hasRefreshToken });
        }
        
        const workflows = await workflowService.listWorkflowsForDashboard();
        setProjects(workflows);
      } catch (error) {
        console.error('Failed to fetch workflows:', error);
        toast({
          title: "Error",
          description: "Failed to load workflows. Please try again.",
          variant: "destructive",
        });
        
        // Fallback to mock data on error
        setProjects([
    {
      id: "flow-1",
      name: "Basic Prompting",
      description: "Perform basic prompting with an OpenAI model.",
      updatedAt: "2 days ago",
      color: "from-purple-500/20 to-blue-500/20",
      type: "flow",
      folder: "AI Assistants",
    },
    {
      id: "flow-2",
      name: "Vector Store RAG",
      description: "Load your data for chat context with Retrieval Augmented Generation.",
      updatedAt: "1 week ago",
      color: "from-blue-500/20 to-cyan-500/20",
      type: "flow",
      folder: "RAG Applications",
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [toast]);

  // Check if we should show templates instead of projects
  const isTemplateFolder = selectedFolder && [
    "AI Assistants", "RAG Applications", "Data Processing", 
    "Document Processing", "Chatbots", "Automation"
  ].includes(selectedFolder);

  // Template data for display in main area
  const templatesByCategory = {
    "AI Assistants": [
      { id: "template-1", name: "Simple Chatbot", description: "A basic chatbot using OpenAI's GPT model", difficulty: "beginner" },
      { id: "template-9", name: "Personal Assistant", description: "A smart personal assistant for scheduling and reminders", difficulty: "intermediate" },
      { id: "template-10", name: "Customer Support Bot", description: "Automated customer support with escalation handling", difficulty: "advanced" },
    ],
    "RAG Applications": [
      { id: "template-2", name: "Document Q&A", description: "Answer questions based on document content", difficulty: "intermediate" },
      { id: "template-7", name: "Custom Knowledge Base", description: "Build a RAG system with your own knowledge base", difficulty: "intermediate" },
      { id: "template-11", name: "Legal Document Analyzer", description: "Analyze legal documents and extract key information", difficulty: "advanced" },
    ],
    "Data Processing": [
      { id: "template-5", name: "Data Analysis Assistant", description: "Analyze and visualize data with AI assistance", difficulty: "intermediate" },
      { id: "template-13", name: "CSV Data Processor", description: "Process and analyze CSV files with AI insights", difficulty: "beginner" },
      { id: "template-14", name: "Database Query Assistant", description: "Natural language to SQL query generator", difficulty: "intermediate" },
    ],
    "Document Processing": [
      { id: "template-4", name: "Text Summarizer", description: "Summarize long documents automatically", difficulty: "beginner" },
      { id: "template-15", name: "PDF Extractor", description: "Extract and process content from PDF documents", difficulty: "beginner" },
      { id: "template-16", name: "Document Classifier", description: "Automatically classify documents by type and content", difficulty: "intermediate" },
    ],
    "Chatbots": [
      { id: "template-1", name: "Simple Chatbot", description: "A basic chatbot using OpenAI's GPT model", difficulty: "beginner" },
      { id: "template-9", name: "Personal Assistant", description: "A smart personal assistant for scheduling and reminders", difficulty: "intermediate" },
      { id: "template-10", name: "Customer Support Bot", description: "Automated customer support with escalation handling", difficulty: "advanced" },
    ],
    "Automation": [
      { id: "template-17", name: "Email Automation", description: "Automated email responses and processing", difficulty: "intermediate" },
      { id: "template-3", name: "Multi-Agent System", description: "Multiple agents working together to solve complex tasks", difficulty: "advanced" },
    ]
  };

  const currentTemplates = isTemplateFolder ? templatesByCategory[selectedFolder as keyof typeof templatesByCategory] || [] : [];
  
  console.log('🔍 ProjectsView: selectedFolder:', selectedFolder, 'isTemplateFolder:', isTemplateFolder, 'currentTemplates count:', currentTemplates.length);

  const filteredProjects = projects.filter(
    (project) =>
      (activeTab === "all" || project.type === activeTab.slice(0, -1)) &&
      (!selectedFolder || selectedFolder === "My Flows" || project.folder === selectedFolder)
  );

  const handleSelectTemplate = (templateId: string, templateName: string) => {
    toast({
      title: "Creating from Template",
      description: `Loading "${templateName}" template in flow editor...`,
    });

    handleSetShowTemplates(false);

    // Navigate to flow editor with template parameters
    window.location.href = `/dashboard/flow/new?template=${templateId}&name=${encodeURIComponent(templateName)}&description=${encodeURIComponent(`Created from ${templateName} template.`)}&difficulty=beginner`;
  };

  // Handle direct template selection from main area
  const handleDirectTemplateSelect = (template: any) => {
    toast({
      title: "Creating from Template",
      description: `Creating new flow from "${template.name}" template`,
    });

    // For now, just show a success message. In a real app, this would create the flow
    const newProject: Project = {
      id: `flow-${Date.now()}`,
      name: `My ${template.name}`,
      description: template.description,
      updatedAt: "Just now",
      color: "from-purple-500/20 to-blue-500/20",
      type: "flow",
      folder: selectedFolder || "My Flows",
    };

    setProjects([newProject, ...projects]);
  };

  if (loading) {
    return (
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">My Projects</h1>
            <p className="text-white/70">Create and manage your AI workflows</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-white/70 mx-auto" />
            <p className="mt-2 text-white/70">Loading projects...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between"> 
        <div>
          <h1 className="text-2xl font-bold text-white">My Projects</h1>
          <p className="text-white/70">Create and manage your AI workflows</p>
        </div>

        <Dialog open={currentShowTemplates} onOpenChange={handleSetShowTemplates}>
          <DialogTrigger asChild>
            <Button onClick={() => handleSetShowTemplates(true)} className="bg-primary text-white hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Choose a Template</DialogTitle>
              <DialogDescription>Start with a pre-built template or create from scratch</DialogDescription>
            </DialogHeader>

            <TemplateGallery 
              onSelectTemplate={handleSelectTemplate} 
              selectedFolder={selectedFolder}
            />

            <DialogFooter>
              <Button variant="outline" onClick={() => handleSetShowTemplates(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="flows" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-3 bg-black border border-white/10">
          <TabsTrigger value="flows" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">
            Flows ({filteredProjects.filter(p => p.type === 'flow').length})
          </TabsTrigger>
          <TabsTrigger value="components" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">
            Components ({filteredProjects.filter(p => p.type === 'component').length})
          </TabsTrigger>
          <TabsTrigger value="all" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">
            All ({filteredProjects.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="pt-0">
          {isTemplateFolder ? (
            // Show templates directly in main area
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                  {selectedFolder} Templates
                </h2>
                <span className="text-sm text-white/70">
                  {currentTemplates.length} templates available
                </span>
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {currentTemplates.map((template) => (
                  <Link 
                    key={template.id}
                    href={`/dashboard/flow/new?template=${template.id}&name=${encodeURIComponent(template.name)}&description=${encodeURIComponent(template.description)}&difficulty=${template.difficulty}`}
                    onClick={() => {
                      toast({
                        title: "Creating from Template",
                        description: `Loading "${template.name}" template in flow editor...`,
                      });
                    }}
                  >
                    <Card 
                      className="h-52 border-white/10 bg-black/50 transition-colors hover:border-primary/50 hover:bg-white/5 cursor-pointer"
                    >
                      <CardHeader className="py-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white text-base">{template.name}</CardTitle>
                          <span
                            className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                              template.difficulty === "beginner"
                                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                : template.difficulty === "intermediate"
                                ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                : "bg-red-500/20 text-red-400 border border-red-500/30"
                            }`}
                          >
                            {template.difficulty}
                          </span>
                        </div>
                        <p className="text-sm text-white/70 line-clamp-2">{template.description}</p>
                      </CardHeader>
                      <CardContent className="py-2">
                        <div className="h-16 rounded-md bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                          <Plus className="h-8 w-8 text-primary" />
                        </div>
                      </CardContent>
                      <CardFooter className="py-2">
                        <div className="flex items-center text-sm text-white/50">
                          <Plus className="mr-2 h-4 w-4" />
                          Click to create from template
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-white/50 mb-4">
                <Puzzle className="h-12 w-12 mx-auto mb-2" />
                <p className="text-lg">No projects found</p>
                <p className="text-sm">Create your first workflow to get started</p>
              </div>
              <Button onClick={() => handleSetShowTemplates(true)} className="bg-primary text-white hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <Link key={project.id} href={`/dashboard/flow/${project.id}`}>
                <Card className="h-52 border-white/10 bg-black/50 transition-colors hover:border-primary/50 hover:bg-white/5">
                  <CardHeader className="py-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-white text-base">{project.name}</CardTitle>
                      {project.type === "component" && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                          <Puzzle className="h-3 w-3 text-white/70" />
                        </div>
                      )}
                    </div>
                      <p className="text-sm text-white/70 line-clamp-2">{project.description}</p>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className={`h-16 rounded-md bg-gradient-to-br ${project.color}`}></div>
                  </CardContent>
                  <CardFooter className="py-2">
                    <div className="flex items-center text-sm text-white/50">
                      <Clock className="mr-2 h-4 w-4" />
                      Updated {project.updatedAt}
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}

            <button
                onClick={() => handleSetShowTemplates(true)}
              className="flex h-52 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-white/10 bg-gradient-to-br from-gray-800 to-gray-900 p-6 shadow-lg transition-transform transform hover:scale-105 hover:border-primary/50 hover:from-gray-700 hover:to-gray-800"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 shadow-md">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <p className="mt-4 text-center text-lg font-semibold text-white">Create New Project</p>
            </button>
          </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

/*
<style jsx global>{`
  .scrollbar-none::-webkit-scrollbar {
    display: none;
  }
`}</style>
*/

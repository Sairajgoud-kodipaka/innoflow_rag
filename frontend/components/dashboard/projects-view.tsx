"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Plus, Puzzle, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
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
  const [activeTab, setActiveTab] = useState("flows");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [internalShowTemplates, setInternalShowTemplates] = useState(showTemplates);

  // Use provided setShowTemplates or internal state
  const handleSetShowTemplates = setShowTemplates || setInternalShowTemplates;
  const currentShowTemplates = setShowTemplates ? showTemplates : internalShowTemplates;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
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

  const filteredProjects = projects.filter(
    (project) =>
      (activeTab === "all" || project.type === activeTab.slice(0, -1)) &&
      (!selectedFolder || selectedFolder === "My Flows" || project.folder === selectedFolder)
  );

  const handleSelectTemplate = (templateId: string, templateName: string) => {
    toast({
      title: "Template Selected",
      description: `Creating new flow from "${templateName}" template`,
    });

    handleSetShowTemplates(false);

    const newProject: Project = {
      id: `flow-${Date.now()}`,
      name: `New ${templateName}`,
      description: `Created from ${templateName} template.`,
      updatedAt: "Just now",
      color: "from-purple-500/20 to-blue-500/20",
      type: "flow",
      folder: "AI Assistants",
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

            <TemplateGallery onSelectTemplate={handleSelectTemplate} />

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
          {filteredProjects.length === 0 ? (
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

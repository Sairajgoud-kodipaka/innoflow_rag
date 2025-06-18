"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

interface Template {
  id: string
  name: string
  description: string
  category: string
  difficulty: "beginner" | "intermediate" | "advanced"
  image: string
}

interface TemplateGalleryProps {
  onSelectTemplate: (templateId: string, templateName: string) => void
  selectedFolder?: string
}

export function TemplateGallery({ onSelectTemplate, selectedFolder }: TemplateGalleryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Debug logging
  console.log('🎨 TemplateGallery: selectedFolder prop received:', selectedFolder)

  // Mapping between sidebar folder names and template categories
  const folderToCategoryMapping: Record<string, string[]> = {
    "AI Assistants": ["chatbots", "agents"],
    "RAG Applications": ["rag"],
    "Data Processing": ["data", "text-processing"],
    "Document Processing": ["rag", "text-processing"],
    "Chatbots": ["chatbots"],
    "Automation": ["agents", "other"],
    "Team Projects": ["agents", "rag"],
    "Collaboration": ["agents", "content"],
    "Templates": [], // Show all templates
    "My Flows": [], // Show all templates
    "Shared Flows": [], // Show all templates
    "Archived": [] // Show all templates
  }

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
  ]

  // Add more templates specific to different categories
  const additionalTemplates: Template[] = [
    // AI Assistants templates
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
    // RAG Applications templates
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
    // Data Processing templates
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
    // Document Processing templates
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
    // Automation templates
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
  ]

  const allTemplates = [...templates, ...additionalTemplates]

  const categories = Array.from(new Set(allTemplates.map((t) => t.category)))

  // Filter templates based on selected folder from sidebar
  const getFilteredTemplatesByFolder = () => {
    console.log('🔍 TemplateGallery: Filtering for selectedFolder:', selectedFolder)
    
    if (!selectedFolder || selectedFolder === "all" || selectedFolder === "Templates") {
      console.log('🎯 TemplateGallery: Showing all templates (no filter)')
      return allTemplates
    }

    const allowedCategories = folderToCategoryMapping[selectedFolder]
    console.log('🏷️ TemplateGallery: Allowed categories for', selectedFolder, ':', allowedCategories)
    
    if (!allowedCategories || allowedCategories.length === 0) {
      console.log('⚠️ TemplateGallery: No mapping found, showing all templates')
      return allTemplates // Show all if no mapping found
    }

    const filtered = allTemplates.filter(template => allowedCategories.includes(template.category))
    console.log('✅ TemplateGallery: Filtered templates count:', filtered.length)
    console.log('📋 TemplateGallery: Filtered template names:', filtered.map(t => t.name))
    
    return filtered
  }

  const filteredTemplates = getFilteredTemplatesByFolder().filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="py-4">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            className="h-52 border-white/10 bg-black/50 transition-colors hover:border-primary/50 hover:bg-white/5 cursor-pointer flex flex-col justify-between"
            onClick={() => onSelectTemplate(template.id, template.name)}
          >
            <CardHeader className="py-3">
              <CardTitle className="text-white text-lg">{template.name}</CardTitle>
              <CardDescription className="text-white/70 text-sm">{template.description}</CardDescription>
            </CardHeader>
            <CardContent className="py-2 flex-1 flex items-center justify-center">
              {/* Optionally add an image or icon here if desired */}
            </CardContent>
            <CardFooter className="py-2">
              <span
                className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                  template.difficulty === "beginner"
                    ? "bg-green-500 text-green-900"
                    : template.difficulty === "intermediate"
                    ? "bg-yellow-500 text-yellow-900"
                    : "bg-red-500 text-red-900"
                }`}
              >
                {template.difficulty}
              </span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

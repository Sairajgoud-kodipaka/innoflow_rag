"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Send, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { aiService, AIModelConfig } from "@/lib/api/ai"

interface PlaygroundPanelProps {
  onClose?: () => void
}

export function PlaygroundPanel({ onClose }: PlaygroundPanelProps) {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState<string>("")
  const [availableModels, setAvailableModels] = useState<AIModelConfig[]>([])
  const [modelsLoading, setModelsLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Fetch available AI models from backend
  useEffect(() => {
    const fetchModels = async () => {
      try {
        setModelsLoading(true)
        const models = await aiService.listConfigs()
        const activeModels = models.filter(model => model.is_active)
        setAvailableModels(activeModels)
        
        // Set first available model as default
        if (activeModels.length > 0) {
          setSelectedModel(activeModels[0].id.toString())
        }
      } catch (error) {
        console.error('Failed to fetch AI models:', error)
        toast({
          title: "Error",
          description: "Failed to load AI models. Please check your AI configuration.",
          variant: "destructive"
        })
      } finally {
        setModelsLoading(false)
      }
    }

    fetchModels()
  }, [toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || !selectedModel) return

    const userMessage = { role: "user" as const, content: input }
    setMessages((prev) => [...prev, userMessage])
    const currentInput = input
    setInput("")
    setIsLoading(true)

    try {
      // Find the selected model configuration
      const modelConfig = availableModels.find(model => model.id.toString() === selectedModel)
      
      if (!modelConfig) {
        throw new Error("Selected model configuration not found")
      }

      // Execute the AI model with the user's prompt
      const response = await aiService.executeModel(modelConfig.id, currentInput)
      
      // Handle synchronous response
      if (response.status === 'completed' && response.response) {
        let responseText = response.response;
        const isMock = response.is_mock || false;
        
        // Add mock indicator if this is a test response
        if (isMock && !responseText.includes('[Mock Response')) {
          responseText += '\n\n🧪 *This is a simulated response using mock AI provider for testing purposes.*';
        }
        
        const assistantMessage = {
          role: "assistant" as const,
          content: responseText,
        }
        setMessages((prev) => [...prev, assistantMessage])
        
        // Show performance info in console
        console.log(`🚀 AI Response completed in ${response.latency?.toFixed(2)}s (Mock: ${isMock})`);
      } else if (response.error) {
        throw new Error(response.error)
      } else {
        throw new Error("Invalid response format from AI service")
      }
    } catch (error: any) {
      console.error('AI model execution failed:', error)
      const errorMessage = {
        role: "assistant" as const,
        content: `Sorry, I encountered an error: ${error.message || 'Unknown error occurred'}. Please try again or check your AI model configuration.`,
      }
      setMessages((prev) => [...prev, errorMessage])
      
      toast({
        title: "Error",
        description: error.message || "Failed to generate response",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#050505] relative">
      <div className="flex items-center justify-between border-b border-white/10 p-4">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-white">Playground</h3>
          <span className="text-xs text-white/50">
            ({availableModels.length} models available)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedModel} onValueChange={setSelectedModel} disabled={modelsLoading}>
            <SelectTrigger className="w-[200px] h-8 text-sm border-white/10 bg-white/5">
              <SelectValue 
                placeholder={modelsLoading ? "Loading models..." : "Select model"} 
              />
            </SelectTrigger>
            <SelectContent>
              {availableModels.map((model) => (
                <SelectItem key={model.id} value={model.id.toString()}>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{model.name}</span>
                      {model.api_key?.startsWith('test-') && (
                        <span className="text-xs px-1.5 py-0.5 bg-yellow-500/20 text-yellow-300 rounded">
                          🧪 Mock
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {model.provider} • {model.model_name}
                    </span>
                  </div>
                </SelectItem>
              ))}
              {availableModels.length === 0 && !modelsLoading && (
                <SelectItem value="no-models" disabled>
                  No AI models configured
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-white/70 hover:bg-white/10"
            onClick={() => {
              setMessages([])
              toast({
                title: "Conversation cleared",
                description: "All messages have been removed",
              })
            }}
          >
            Clear
          </Button>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white/70 hover:bg-white/10">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-6">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="max-w-md text-center">
              <h3 className="text-xl font-medium text-white mb-2">Test your AI models</h3>
              <p className="text-white/50">
                Send a message to interact with your configured AI models. 
                {availableModels.length > 0 
                  ? `You have ${availableModels.length} model(s) available.`
                  : "Please configure AI models in the AI Configuration section first."
                }
              </p>
              {selectedModel && (
                <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-sm text-white/70">
                    Current model: <span className="text-white font-medium">
                      {availableModels.find(m => m.id.toString() === selectedModel)?.name}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === "user" ? "bg-primary/20 text-white" : "bg-white/10 text-white"
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                {message.role === "assistant" && selectedModel && (
                  <div className="mt-2 pt-2 border-t border-white/10 text-xs text-white/50">
                    {availableModels.find(m => m.id.toString() === selectedModel)?.name} • {availableModels.find(m => m.id.toString() === selectedModel)?.provider}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-4 bg-white/10 text-white">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-primary/50 animate-pulse"></div>
                <div className="h-2 w-2 rounded-full bg-primary/50 animate-pulse delay-150"></div>
                <div className="h-2 w-2 rounded-full bg-primary/50 animate-pulse delay-300"></div>
                <span className="text-sm text-white/70 ml-2">
                  {availableModels.find(m => m.id.toString() === selectedModel)?.name} is thinking...
                </span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-white/10 p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              availableModels.length === 0 
                ? "Please configure AI models first..." 
                : selectedModel 
                  ? "Type a message..." 
                  : "Select a model to start chatting..."
            }
            className="flex-1 min-h-[60px] max-h-[200px] resize-none border border-white/10 bg-white/5 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/50 focus:border-primary/50 focus:outline-none focus:ring-0"
            disabled={isLoading || !selectedModel || availableModels.length === 0}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim() || !selectedModel || availableModels.length === 0}
            className="h-[60px] w-[60px] bg-primary text-white hover:bg-primary/90 rounded-md disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
        {availableModels.length === 0 && !modelsLoading && (
          <div className="mt-2 text-center">
            <p className="text-xs text-white/50">
              No AI models configured. 
              <a href="/ai-config" className="text-primary hover:text-primary/80 ml-1">
                Configure models here
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

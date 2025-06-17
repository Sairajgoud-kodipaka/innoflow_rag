"use client"

import { useState, useEffect } from "react"
import { Handle, Position } from "reactflow"
import { Slider } from "@/components/ui/slider"
import { ChevronDown, Play } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { getAIModelsByProvider, AIModelConfig } from "@/lib/api/ai"

export function ModelNode({ data, isConnectable }: { data: any; isConnectable?: boolean }) {
  const [settings, setSettings] = useState({
    model: data.model || "",
    temperature: data.temperature || 0.7,
    maxTokens: data.maxTokens || 1024,
    topP: data.topP || 1.0
  })

  const [availableModels, setAvailableModels] = useState<AIModelConfig[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAvailableModels()
  }, [])

  const loadAvailableModels = async () => {
    try {
      setLoading(true)
      const modelsByProvider = await getAIModelsByProvider()
      
      // Get all models from all providers for this generic model node
      const allModels = Object.values(modelsByProvider).flat()
      setAvailableModels(allModels)
      
      // Set default model if none selected
      if (!settings.model && allModels.length > 0) {
        const defaultModel = allModels.find(m => m.provider === 'OPENAI') || allModels[0]
        setSettings(prev => ({ ...prev, model: defaultModel.model_name }))
      }
    } catch (error) {
      console.error('Failed to load AI models:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    if (data.onSettingsChange) {
      data.onSettingsChange({ ...settings, [key]: value })
    }
  }

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'OPENAI': return '🤖'
      case 'ANTHROPIC': return '🧠'
      case 'DEEPSEEK': return '🔍'
      case 'OLLAMA': return '🦙'
      case 'HUGGINGFACE': return '🤗'
      default: return '🗄️'
    }
  }

  const selectedModel = availableModels.find(m => m.model_name === settings.model)

  return (
    <div className="w-64 rounded-md border border-green-500/40 bg-black/80 shadow-md backdrop-blur-sm">
      <div className="border-b border-teal-500/30 bg-teal-500/10 px-3 py-2 text-sm font-medium text-teal-500 flex items-center gap-2">
        {selectedModel ? getProviderIcon(selectedModel.provider) : '🗄️'}
        <span>{data.label || "AI Model"}</span>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto p-1 w-7 h-7 text-teal-400 hover:bg-teal-500/10"
          onClick={() => { data.onRun ? data.onRun() : alert('Run Model!') }}
          aria-label="Run Model"
        >
          <Play className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-3 space-y-2">
        <div>
          <label className="text-xs text-white/70 block mb-1">Model</label>
          {loading ? (
            <div className="h-8 bg-black/30 border border-white/10 rounded animate-pulse flex items-center px-2">
              <span className="text-xs text-white/50">Loading models...</span>
            </div>
          ) : (
          <Select 
            value={settings.model} 
            onValueChange={(value) => updateSetting("model", value)}
          >
            <SelectTrigger className="h-8 text-xs bg-black/30 border-white/10">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-white/10 text-white max-h-48">
                {availableModels.map((model) => (
                  <SelectItem key={model.id} value={model.model_name}>
                    <div className="flex items-center gap-2">
                      <span>{getProviderIcon(model.provider)}</span>
                      <span>{model.model_name}</span>
                      <span className="text-xs text-white/50">({model.provider})</span>
                    </div>
                  </SelectItem>
                ))}
                {availableModels.length === 0 && (
                  <SelectItem value="no-models" disabled>
                    No models available
                  </SelectItem>
                )}
            </SelectContent>
          </Select>
          )}
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <label className="text-xs text-white/70">Temperature</label>
            <span className="text-xs text-white/70">{settings.temperature.toFixed(2)}</span>
          </div>
          <Slider
            min={0}
            max={2}
            step={0.01}
            value={[settings.temperature]}
            onValueChange={(value) => updateSetting("temperature", value[0])}
            className="[&>span]:bg-teal-500"
          />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <label className="text-xs text-white/70">Max Tokens</label>
            <span className="text-xs text-white/70">{settings.maxTokens}</span>
          </div>
          <Slider
            min={16}
            max={4096}
            step={16}
            value={[settings.maxTokens]}
            onValueChange={(value) => updateSetting("maxTokens", value[0])}
            className="[&>span]:bg-teal-500"
          />
        </div>

        {selectedModel && (
          <div className="pt-1 border-t border-white/10">
            <div className="text-xs text-white/50">
              <div>Provider: {selectedModel.provider}</div>
              {selectedModel.name !== selectedModel.model_name && (
                <div>Config: {selectedModel.name}</div>
              )}
            </div>
          </div>
        )}
      </div>

      <Handle
        type="target"
        position={Position.Top}
        id="in"
        isConnectable={isConnectable}
        className="w-2 h-2 bg-teal-500 border border-black"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="out"
        isConnectable={isConnectable}
        className="w-2 h-2 bg-teal-500 border border-black"
      />
    </div>
  )
}
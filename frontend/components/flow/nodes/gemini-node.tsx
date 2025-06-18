"use client"

import { useState, useEffect } from "react"
import { Handle, Position } from "reactflow"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { getAIModelsByProvider, AIModelConfig } from "@/lib/api/ai"

export function GeminiNode({ data, isConnectable }: { data: any; isConnectable?: boolean }) {
  const [settings, setSettings] = useState({
    model: data.model || "",
    temperature: data.temperature || 0.7,
    maxTokens: data.maxTokens || 1000,
    topP: data.topP || 0.8,
    topK: data.topK || 10
  })

  const [availableModels, setAvailableModels] = useState<AIModelConfig[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGeminiModels()
  }, [])

  const loadGeminiModels = async () => {
    try {
      setLoading(true)
      const modelsByProvider = await getAIModelsByProvider()
      
      // Get only Gemini models
      const geminiModels = modelsByProvider.GEMINI || []
      setAvailableModels(geminiModels)
      
      // Set default model if none selected
      if (!settings.model && geminiModels.length > 0) {
        setSettings(prev => ({ ...prev, model: geminiModels[0].model_name }))
      }
    } catch (error) {
      console.error('Failed to load Gemini models:', error)
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

  const selectedModel = availableModels.find(m => m.model_name === settings.model)

  return (
    <div className="w-64 rounded-md border border-purple-500/40 bg-black/80 shadow-md backdrop-blur-sm">
      <div className="border-b border-purple-500/30 bg-purple-500/10 px-3 py-2 text-sm font-medium text-purple-400 flex items-center gap-2">
        💎
        <span>{data.label || "Gemini"}</span>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto p-1 w-7 h-7 text-purple-400 hover:bg-purple-500/10"
          onClick={() => { data.onRun ? data.onRun() : alert('Run Gemini Model!') }}
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
              <SelectContent className="bg-black/90 border-white/10 text-white">
                {availableModels.map((model) => (
                  <SelectItem key={model.id} value={model.model_name}>
                    <div className="flex items-center gap-2">
                      <span>💎</span>
                      <span>{model.model_name}</span>
                    </div>
                  </SelectItem>
                ))}
                {availableModels.length === 0 && (
                  <SelectItem value="no-models" disabled>
                    No Gemini models configured
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
            className="[&>span]:bg-purple-500"
          />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <label className="text-xs text-white/70">Max Tokens</label>
            <span className="text-xs text-white/70">{settings.maxTokens}</span>
          </div>
          <Slider
            min={100}
            max={4000}
            step={100}
            value={[settings.maxTokens]}
            onValueChange={(value) => updateSetting("maxTokens", value[0])}
            className="[&>span]:bg-purple-500"
          />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <label className="text-xs text-white/70">Top-P</label>
            <span className="text-xs text-white/70">{settings.topP.toFixed(2)}</span>
          </div>
          <Slider
            min={0}
            max={1}
            step={0.01}
            value={[settings.topP]}
            onValueChange={(value) => updateSetting("topP", value[0])}
            className="[&>span]:bg-purple-500"
          />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <label className="text-xs text-white/70">Top-K</label>
            <span className="text-xs text-white/70">{settings.topK}</span>
          </div>
          <Slider
            min={1}
            max={40}
            step={1}
            value={[settings.topK]}
            onValueChange={(value) => updateSetting("topK", value[0])}
            className="[&>span]:bg-purple-500"
          />
        </div>

        {selectedModel && (
          <div className="pt-1 border-t border-white/10">
            <div className="text-xs text-white/50">
              <div>Config: {selectedModel.name}</div>
              {selectedModel.api_key && (
                <div>API Key: {'*'.repeat(8)}</div>
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
        className="w-2 h-2 bg-purple-500 border border-black"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="out"
        isConnectable={isConnectable}
        className="w-2 h-2 bg-purple-500 border border-black"
      />
    </div>
  )
}

export default GeminiNode 
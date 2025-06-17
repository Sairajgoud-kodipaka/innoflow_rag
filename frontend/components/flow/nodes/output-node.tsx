"use client"

import { useState, useEffect } from "react"
import { Handle, Position } from "reactflow"

export function OutputNode({ data, isConnectable }: { data: any; isConnectable?: boolean }) {
  const [outputText, setOutputText] = useState("Waiting for input...")
  const [executionStatus, setExecutionStatus] = useState<'waiting' | 'executing' | 'completed' | 'error'>('waiting')
  const [lastExecuted, setLastExecuted] = useState<string | null>(null)

  useEffect(() => {
    // Initialize with existing data
    if (data?.output) {
      setOutputText(data.output)
      setExecutionStatus('completed')
    }
    
    // Listen for node status updates from the execution engine
    const handleNodeStatusUpdate = (event: CustomEvent) => {
      const { nodeId, status, data: resultData } = event.detail
      
      // Check if this update is for this node (we need to get the node ID somehow)
      // For now, we'll update all output nodes when any execution happens
      if (status === 'executing') {
        setExecutionStatus('executing')
        setOutputText('Processing...')
      } else if (status === 'completed' && resultData) {
        setExecutionStatus('completed')
        
        // Extract the content from the result
        let displayText = resultData
        if (typeof resultData === 'object') {
          if (resultData.content) {
            displayText = resultData.content
          } else if (resultData.formatted) {
            displayText = resultData.formatted
          } else {
            displayText = JSON.stringify(resultData, null, 2)
          }
        }
        
        setOutputText(displayText)
        setLastExecuted(new Date().toLocaleTimeString())
      } else if (status === 'error') {
        setExecutionStatus('error')
        setOutputText(`Error: ${resultData || 'Unknown error occurred'}`)
      }
    }
    
    // Add event listener
    window.addEventListener('nodeStatusUpdate', handleNodeStatusUpdate as EventListener)
    
    // Cleanup
    return () => {
      window.removeEventListener('nodeStatusUpdate', handleNodeStatusUpdate as EventListener)
    }
  }, [data])

  // Update when data changes externally
  useEffect(() => {
    if (data?.output) {
      setOutputText(data.output)
      setExecutionStatus('completed')
    }
  }, [data?.output])

  const getStatusColor = () => {
    switch (executionStatus) {
      case 'waiting':
        return 'text-gray-400'
      case 'executing':
        return 'text-blue-400'
      case 'completed':
        return 'text-green-400'
      case 'error':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  const getStatusIcon = () => {
    switch (executionStatus) {
      case 'waiting':
        return '⏳'
      case 'executing':
        return '🔄'
      case 'completed':
        return '✅'
      case 'error':
        return '❌'
      default:
        return '⏳'
    }
  }

  return (
    <div className="w-[240px] rounded-md border border-purple-500/40 bg-black/80 shadow-lg backdrop-blur-sm transition-all duration-200 hover:shadow-purple-500/20">
      <div className="border-b border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-400 flex items-center gap-2">
        <div className="flex h-5 w-5 items-center justify-center rounded bg-purple-500/20 text-xs text-purple-400">
          📤
        </div>
        <span>{data?.label || "Chat Output"}</span>
      </div>
      <div className="p-3 space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
          <label className="text-xs text-purple-400">Output Preview</label>
            <div className={`flex items-center gap-1 text-xs ${getStatusColor()}`}>
              <span>{getStatusIcon()}</span>
              <span className="capitalize">{executionStatus}</span>
            </div>
          </div>
          
          <div className="min-h-[80px] max-h-[200px] overflow-y-auto rounded border border-white/10 bg-white/5 p-3">
            <div className="text-sm text-white/90 whitespace-pre-wrap break-words">
              {outputText}
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-purple-400">Output Format</label>
          <select 
            className="w-full rounded border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/70 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
            defaultValue="text"
            >
            <option value="text">Text</option>
            <option value="json">JSON</option>
            <option value="markdown">Markdown</option>
            <option value="html">HTML</option>
          </select>
            </div>
            
        {lastExecuted && (
          <div className="text-xs text-white/50 text-center">
            Last updated: {lastExecuted}
          </div>
        )}
      </div>

        <Handle
          type="target"
          position={Position.Top}
          id="in"
        isConnectable={isConnectable !== false}
        className="w-3 h-3 bg-purple-500 border-2 border-black"
        />
    </div>
  )
}
#!/usr/bin/env python
"""
Test workflow execution with Gemini node
"""

import requests
import json

def test_workflow_execution():
    print("🧪 Testing Workflow Execution with Gemini")
    print("=" * 50)
    
    # Simulate a simple workflow: Input -> Gemini -> Output
    workflow_data = {
        "nodes": [
            {
                "id": "input-1",
                "type": "text-input",
                "data": {
                    "label": "Chat Input",
                    "text": "Write a short poem about AI innovation and mention you are Gemini"
                }
            },
            {
                "id": "gemini-1", 
                "type": "gemini",
                "data": {
                    "label": "Gemini AI",
                    "model": "gemini-1.5-pro",
                    "provider": "gemini",
                    "temperature": 0.7
                }
            },
            {
                "id": "output-1",
                "type": "text-output", 
                "data": {
                    "label": "Chat Output"
                }
            }
        ],
        "edges": [
            {"source": "input-1", "target": "gemini-1"},
            {"source": "gemini-1", "target": "output-1"}
        ]
    }
    
    # Test the workflow execution endpoint
    url = "http://localhost:8000/api/workflows/execute_workflow/"
    
    print(f"🔄 Sending workflow to: {url}")
    print(f"📊 Nodes: {len(workflow_data['nodes'])}")
    print(f"🔗 Edges: {len(workflow_data['edges'])}")
    
    try:
        response = requests.post(url, json=workflow_data, headers={
            'Content-Type': 'application/json'
        })
        
        print(f"\n📊 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            
            print("\n🎉 Workflow Execution Results:")
            print("-" * 40)
            
            if 'results' in data:
                for node_id, result in data['results'].items():
                    print(f"Node {node_id}: {str(result)[:100]}...")
            
            if 'errors' in data and data['errors']:
                print(f"\n⚠️ Errors: {data['errors']}")
            else:
                print(f"\n✅ Workflow executed successfully!")
                
        else:
            print(f"\n❌ Workflow execution failed: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"\n❌ Request failed: {e}")

if __name__ == "__main__":
    test_workflow_execution() 
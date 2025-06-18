#!/usr/bin/env python
"""
Simple test to verify Gemini AI via API endpoint
"""

import requests
import json

def test_gemini_api():
    print("🧪 Testing Gemini AI via API")
    print("=" * 40)
    
    # API endpoint for model execution
    url = "http://localhost:8000/api/ai/aimodelconfig/8/execute/"
    
    # Test prompt
    payload = {
        "prompt": "Write a short creative poem about AI and innovation. Make it unique and mention that you are Google's Gemini AI.",
        "parameters": {}
    }
    
    print(f"🔄 Sending request to: {url}")
    print(f"📝 Prompt: {payload['prompt']}")
    print("\n⏳ Waiting for response...")
    
    try:
        response = requests.post(url, json=payload, headers={
            'Content-Type': 'application/json'
        })
        
        print(f"\n📊 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            
            print("\n🎉 SUCCESS! Gemini Response:")
            print("-" * 50)
            print(data.get('response', 'No response field'))
            print("-" * 50)
            
            # Check response metadata
            print(f"\n📈 Metadata:")
            print(f"   Latency: {data.get('latency', 'N/A')} seconds")
            print(f"   Model: {data.get('model_config', {}).get('name', 'Unknown')}")
            print(f"   Provider: {data.get('model_config', {}).get('provider', 'Unknown')}")
            print(f"   Is Mock: {data.get('is_mock', 'Unknown')}")
            
            if data.get('is_mock'):
                print("\n⚠️  WARNING: Response is still using mock provider!")
                print("   Check API key configuration.")
            else:
                print("\n✅ CONFIRMED: Real Gemini AI response!")
                
        else:
            print(f"\n❌ Error: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"\n❌ Request failed: {e}")

if __name__ == "__main__":
    test_gemini_api() 
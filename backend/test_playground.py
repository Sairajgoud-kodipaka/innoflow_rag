#!/usr/bin/env python
"""
Test script for playground AI model execution
This script tests the complete flow that the frontend playground will use.
"""

import os
import sys
import django
import requests
import json
import time

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'InnoFlow.settings')
django.setup()

from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from InnoFlow.ai_integration.models import AIModelConfig

def test_playground_integration():
    print("🧪 Testing Playground AI Integration")
    print("=" * 50)
    
    # Step 1: Get or create a test user and generate JWT token
    User = get_user_model()
    user, created = User.objects.get_or_create(
        email='playground@test.com',
        defaults={
            'username': 'playground_test',
            'first_name': 'Playground',
            'last_name': 'Test'
        }
    )
    
    # Generate JWT token
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    
    print(f"✅ Test user: {user.email}")
    print(f"✅ JWT token generated")
    
    # Step 2: Test fetching AI models
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.get('http://localhost:8000/api/ai/aimodelconfig/', headers=headers)
        print(f"✅ AI Models API: {response.status_code}")
        
        if response.status_code == 200:
            models = response.json()
            active_models = [m for m in models if m.get('is_active', False)]
            print(f"   📊 Found {len(active_models)} active AI models")
            
            # Step 3: Test AI model execution
            if active_models:
                test_model = active_models[0]  # Use first available model
                print(f"   🤖 Testing model: {test_model['name']} ({test_model['provider']})")
                
                # Execute AI model
                execute_data = {
                    'prompt': 'Hello! Can you tell me what 2+2 equals?',
                    'parameters': {}
                }
                
                exec_response = requests.post(
                    f'http://localhost:8000/api/ai/aimodelconfig/{test_model["id"]}/execute/',
                    headers=headers,
                    json=execute_data
                )
                
                print(f"   ✅ Execute API: {exec_response.status_code}")
                
                if exec_response.status_code == 202:  # Accepted
                    exec_data = exec_response.json()
                    task_id = exec_data.get('task_id')
                    print(f"   🔄 Task ID: {task_id}")
                    
                    # Step 4: Poll for results
                    max_attempts = 10
                    for attempt in range(max_attempts):
                        time.sleep(1)  # Wait 1 second
                        
                        result_response = requests.get(
                            f'http://localhost:8000/api/ai/taskstatus/result/{task_id}/',
                            headers=headers
                        )
                        
                        if result_response.status_code == 200:
                            result_data = result_response.json()
                            print(f"   📋 Task Status: {result_data.get('status')}")
                            
                            if result_data.get('status') == 'completed':
                                result = result_data.get('result', {})
                                response_text = result.get('response', 'No response')
                                is_mock = result.get('is_mock', False)
                                latency = result.get('latency', 0)
                                
                                print(f"   ✅ Execution completed!")
                                print(f"   ⚡ Latency: {latency:.2f}s")
                                print(f"   🧪 Mock Mode: {is_mock}")
                                print(f"   💬 Response Preview: {response_text[:100]}...")
                                print("   " + "="*46)
                                print("   🎉 PLAYGROUND INTEGRATION TEST PASSED!")
                                return True
                            elif result_data.get('status') == 'failed':
                                error = result.get('error', 'Unknown error')
                                print(f"   ❌ Task failed: {error}")
                                return False
                        
                        print(f"   ⏳ Waiting for completion... (attempt {attempt + 1}/{max_attempts})")
                    
                    print("   ⏰ Task timeout")
                    return False
                else:
                    print(f"   ❌ Execute failed: {exec_response.text}")
                    return False
            else:
                print("   ⚠️ No active models found")
                return False
        else:
            print(f"   ❌ Failed to fetch models: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Test failed: {str(e)}")
        return False

if __name__ == '__main__':
    success = test_playground_integration()
    if success:
        print("\n🎉 All tests passed! Playground is ready to use.")
        print("\n🚀 Next steps:")
        print("   1. Start the frontend: cd ../frontend && npm run dev")
        print("   2. Open http://localhost:3000")
        print("   3. Navigate to a flow and open the Playground panel")
        print("   4. Select an AI model and start chatting!")
    else:
        print("\n❌ Tests failed. Please check the errors above.")
    
    sys.exit(0 if success else 1) 
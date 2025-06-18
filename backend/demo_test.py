#!/usr/bin/env python
"""
InnoFlow Demo Test Script
Verifies that the prompt → result flow works perfectly for demonstrations
"""

import os
import sys
import requests
import json
import time
from datetime import datetime

# Add Django settings
sys.path.append('.')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'InnoFlow.settings')

import django
django.setup()

from InnoFlow.ai_integration.models import AIModelConfig

class DemoTester:
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
        self.session = requests.Session()
        self.demo_prompts = [
            {
                "name": "Greeting Demo",
                "prompt": "Hello! Can you introduce yourself?",
                "expected_keywords": ["hello", "demo", "assistant"]
            },
            {
                "name": "Code Generation Demo", 
                "prompt": "Write a Python function to calculate fibonacci numbers",
                "expected_keywords": ["python", "function", "fibonacci"]
            },
            {
                "name": "Business Analysis Demo",
                "prompt": "Analyze the market opportunity for AI automation",
                "expected_keywords": ["market", "AI", "business", "analysis"]
            },
            {
                "name": "Creative Writing Demo",
                "prompt": "Write a creative story about AI and workflows",
                "expected_keywords": ["creative", "story", "AI", "workflow"]
            },
            {
                "name": "Data Analysis Demo",
                "prompt": "Analyze the performance metrics and provide insights",
                "expected_keywords": ["analysis", "metrics", "insights", "performance"]
            }
        ]
    
    def print_header(self, title):
        print("\n" + "="*60)
        print(f"🎯 {title}")
        print("="*60)
    
    def print_success(self, message):
        print(f"✅ {message}")
    
    def print_error(self, message):
        print(f"❌ {message}")
    
    def print_info(self, message):
        print(f"ℹ️  {message}")
    
    def test_server_connectivity(self):
        """Test if Django server is running"""
        self.print_header("Testing Server Connectivity")
        
        try:
            response = self.session.get(f"{self.base_url}/api/ai/aimodelconfig/", timeout=5)
            if response.status_code == 200:
                self.print_success("Django server is running and API is accessible")
                return True
            else:
                self.print_error(f"API returned status code: {response.status_code}")
                return False
        except requests.exceptions.ConnectionError:
            self.print_error("Cannot connect to Django server. Please start it with: python manage.py runserver")
            return False
        except Exception as e:
            self.print_error(f"Unexpected error: {str(e)}")
            return False
    
    def check_ai_models(self):
        """Check available AI model configurations"""
        self.print_header("Checking AI Model Configurations")
        
        try:
            response = self.session.get(f"{self.base_url}/api/ai/aimodelconfig/")
            if response.status_code == 200:
                configs = response.json()
                
                # Handle both paginated and non-paginated responses
                if isinstance(configs, dict) and 'results' in configs:
                    configs = configs['results']
                
                if not configs:
                    self.print_error("No AI model configurations found")
                    return None
                
                self.print_success(f"Found {len(configs)} AI model configurations:")
                
                demo_config = None
                for config in configs:
                    status_emoji = "🟢" if config.get('is_active', True) else "🔴"
                    provider = config.get('provider', 'Unknown')
                    name = config.get('name', 'Unnamed')
                    model_id = config.get('id', 'Unknown')
                    
                    print(f"  {status_emoji} ID: {model_id} | {provider} | {name}")
                    
                    # Prefer Mock provider for reliable demo, fallback to others
                    if not demo_config or provider == 'MOCK':
                        demo_config = config
                
                if demo_config:
                    self.print_success(f"Selected model for demo: {demo_config['name']} (ID: {demo_config['id']})")
                    return demo_config
                else:
                    self.print_error("No suitable model configuration found for demo")
                    return None
                    
            else:
                self.print_error(f"Failed to fetch AI configurations: {response.status_code}")
                return None
                
        except Exception as e:
            self.print_error(f"Error checking AI models: {str(e)}")
            return None
    
    def test_prompt_execution(self, config, prompt_data):
        """Test prompt execution with a specific model"""
        print(f"\n🧪 Testing: {prompt_data['name']}")
        print(f"📝 Prompt: {prompt_data['prompt']}")
        
        try:
            start_time = time.time()
            
            response = self.session.post(
                f"{self.base_url}/api/ai/aimodelconfig/{config['id']}/execute/",
                json={
                    "prompt": prompt_data['prompt'],
                    "parameters": {}
                },
                timeout=30
            )
            
            end_time = time.time()
            latency = end_time - start_time
            
            if response.status_code == 200:
                result = response.json()
                ai_response = result.get('response', 'No response text')
                
                self.print_success(f"Response received in {latency:.2f}s")
                print(f"📤 AI Response: {ai_response[:200]}{'...' if len(ai_response) > 200 else ''}")
                
                # Check if response contains expected keywords
                response_lower = ai_response.lower()
                found_keywords = [kw for kw in prompt_data['expected_keywords'] 
                                if kw.lower() in response_lower]
                
                if found_keywords:
                    self.print_success(f"Found expected keywords: {', '.join(found_keywords)}")
                else:
                    self.print_info("Response doesn't contain expected keywords, but execution succeeded")
                
                return True, ai_response
                
            else:
                error_text = response.text
                self.print_error(f"Request failed with status {response.status_code}: {error_text}")
                return False, error_text
                
        except requests.exceptions.Timeout:
            self.print_error("Request timed out (>30s)")
            return False, "Timeout"
        except Exception as e:
            self.print_error(f"Execution error: {str(e)}")
            return False, str(e)
    
    def create_demo_config_if_needed(self):
        """Create a demo AI configuration if none exists"""
        self.print_header("Setting Up Demo Configuration")
        
        try:
            # Check if we have any configs
            response = self.session.get(f"{self.base_url}/api/ai/aimodelconfig/")
            if response.status_code == 200:
                configs = response.json()
                if isinstance(configs, dict) and 'results' in configs:
                    configs = configs['results']
                
                # Look for a mock configuration
                mock_config = next((c for c in configs if c.get('provider') == 'MOCK'), None)
                if mock_config:
                    self.print_success("Found existing mock configuration for demo")
                    return mock_config
            
            # Create a new mock configuration for demo
            demo_config_data = {
                "name": "Demo Mock AI",
                "provider": "MOCK",
                "model_name": "demo-model",
                "api_key": "demo-key",
                "parameters": {
                    "temperature": 0.7,
                    "max_tokens": 1000
                },
                "is_active": True
            }
            
            response = self.session.post(
                f"{self.base_url}/api/ai/aimodelconfig/",
                json=demo_config_data
            )
            
            if response.status_code == 201:
                new_config = response.json()
                self.print_success(f"Created demo configuration: ID {new_config['id']}")
                return new_config
            else:
                self.print_error(f"Failed to create demo configuration: {response.status_code}")
                return None
                
        except Exception as e:
            self.print_error(f"Error setting up demo configuration: {str(e)}")
            return None
    
    def run_full_demo_test(self):
        """Run complete demo test suite"""
        print("🚀 InnoFlow Demo Test Suite")
        print(f"⏰ Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        # Test 1: Server connectivity
        if not self.test_server_connectivity():
            print("\n💥 Demo test failed: Server not accessible")
            return False
        
        # Test 2: Check or create AI model configurations
        config = self.check_ai_models()
        if not config:
            config = self.create_demo_config_if_needed()
            if not config:
                print("\n💥 Demo test failed: No AI model configuration available")
                return False
        
        # Test 3: Execute demo prompts
        self.print_header("Testing Prompt → Result Flow")
        
        successful_tests = 0
        total_tests = len(self.demo_prompts)
        
        for prompt_data in self.demo_prompts:
            success, response = self.test_prompt_execution(config, prompt_data)
            if success:
                successful_tests += 1
            time.sleep(1)  # Brief pause between tests
        
        # Test Results Summary
        self.print_header("Demo Test Results")
        
        success_rate = (successful_tests / total_tests) * 100
        
        if success_rate >= 80:
            self.print_success(f"🎉 Demo Ready! {successful_tests}/{total_tests} tests passed ({success_rate:.1f}%)")
            print("\n📋 Demo Instructions:")
            print("1. Open your browser to http://localhost:3000")
            print("2. Navigate to the AI Playground or Flow Editor")
            print(f"3. Select model: {config['name']} (ID: {config['id']})")
            print("4. Try these demo prompts:")
            for prompt in self.demo_prompts[:3]:  # Show first 3 prompts
                print(f"   • {prompt['prompt']}")
            print("\n✨ Your prompt → result flow is working perfectly!")
            return True
        else:
            self.print_error(f"Demo needs attention: Only {successful_tests}/{total_tests} tests passed ({success_rate:.1f}%)")
            return False

def main():
    tester = DemoTester()
    success = tester.run_full_demo_test()
    
    if success:
        print("\n🎯 DEMO STATUS: READY FOR PRESENTATION! 🎯")
        sys.exit(0)
    else:
        print("\n⚠️  DEMO STATUS: NEEDS ATTENTION ⚠️")
        sys.exit(1)

if __name__ == "__main__":
    main() 
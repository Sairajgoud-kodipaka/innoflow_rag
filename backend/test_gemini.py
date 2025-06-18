#!/usr/bin/env python
"""
Test script to verify Gemini AI is working with real responses
"""

import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'InnoFlow.settings')
django.setup()

from InnoFlow.ai_integration.models import AIModelConfig
from InnoFlow.ai_integration.providers_registry import ProviderRegistry

def test_gemini_api():
    print("🧪 Testing Gemini AI Integration")
    print("=" * 50)
    
    try:
        # Get Gemini configuration
        gemini_config = AIModelConfig.objects.get(id=8)
        print(f"✅ Found Gemini config: {gemini_config.name}")
        print(f"   Model: {gemini_config.model_name}")
        print(f"   Provider: {gemini_config.provider}")
        print(f"   Active: {gemini_config.is_active}")
        
        # Get the provider
        provider = ProviderRegistry.get_provider(
            gemini_config.provider.lower(),
            api_key=gemini_config.api_key,
            model_name=gemini_config.model_name
        )
        
        # Test with a simple prompt
        test_prompt = "Hello! Please respond with a real AI message and tell me you are Google's Gemini AI, not a mock response."
        print(f"\n🔄 Testing with prompt: {test_prompt}")
        print("\n⏳ Waiting for Gemini response...")
        
        response = provider.generate_completion(test_prompt)
        
        print(f"\n🎉 SUCCESS! Gemini Response:")
        print("-" * 40)
        print(response)
        print("-" * 40)
        
        # Check if response looks real (not mock)
        if "mock" in response.lower() or "demo" in response.lower():
            print("\n⚠️  WARNING: Response might still be mock!")
        else:
            print("\n✅ REAL AI RESPONSE CONFIRMED!")
            
        return True
        
    except AIModelConfig.DoesNotExist:
        print("❌ Error: Gemini configuration not found (ID: 8)")
        return False
    except Exception as e:
        print(f"❌ Error testing Gemini: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_gemini_api()
    if success:
        print("\n🎉 Gemini AI is ready for real responses!")
    else:
        print("\n❌ Gemini AI test failed!") 
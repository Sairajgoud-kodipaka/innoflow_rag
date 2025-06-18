#!/usr/bin/env python
"""
Check API Keys Script
Shows current API key status and helps set up real keys
"""

import os
import sys

# Add Django settings
sys.path.append('.')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'InnoFlow.settings')

import django
django.setup()

from InnoFlow.ai_integration.models import AIModelConfig

def check_api_keys():
    """Check current API keys and identify which are test keys"""
    
    print("🔍 Checking API Key Status...")
    print("="*60)
    
    configs = AIModelConfig.objects.all()
    
    if not configs:
        print("❌ No AI configurations found!")
        return
    
    real_configs = []
    test_configs = []
    
    for config in configs:
        key_preview = config.api_key[:15] + "..." if config.api_key and len(config.api_key) > 15 else config.api_key or "None"
        is_test = config.api_key and config.api_key.startswith('test-')
        is_empty = not config.api_key
        
        status = "🧪 TEST KEY (Mock)" if is_test else "❌ NO KEY" if is_empty else "✅ REAL KEY"
        
        print(f"ID: {config.id:2} | {config.provider:10} | {config.name:20} | {status}")
        print(f"      Key: {key_preview}")
        
        if is_test or is_empty:
            test_configs.append(config)
        else:
            real_configs.append(config)
    
    print("\n📊 SUMMARY:")
    print(f"✅ Real API Keys: {len(real_configs)}")
    print(f"🧪 Test/Empty Keys: {len(test_configs)}")
    
    if test_configs:
        print(f"\n⚠️  ISSUE: {len(test_configs)} configurations are using test/mock responses!")
        print("To get REAL AI responses, you need to update these with actual API keys:")
        
        for config in test_configs:
            if config.provider == 'GEMINI':
                print(f"\n🔑 {config.name} (ID: {config.id}):")
                print("   Provider: Google Gemini")
                print("   Get API key: https://makersuite.google.com/app/apikey")
                print("   Update command:")
                print(f"   python -c \"import os, sys; sys.path.append('.'); os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'InnoFlow.settings'); import django; django.setup(); from InnoFlow.ai_integration.models import AIModelConfig; c = AIModelConfig.objects.get(id={config.id}); c.api_key = 'YOUR_REAL_GEMINI_KEY'; c.save(); print('✅ Updated!')\"")
            
            elif config.provider == 'OPENAI':
                print(f"\n🔑 {config.name} (ID: {config.id}):")
                print("   Provider: OpenAI")
                print("   Get API key: https://platform.openai.com/api-keys")
                print("   Update command:")
                print(f"   python -c \"import os, sys; sys.path.append('.'); os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'InnoFlow.settings'); import django; django.setup(); from InnoFlow.ai_integration.models import AIModelConfig; c = AIModelConfig.objects.get(id={config.id}); c.api_key = 'YOUR_REAL_OPENAI_KEY'; c.save(); print('✅ Updated!')\"")
    
    if real_configs:
        print(f"\n🎯 DEMO READY CONFIGURATIONS:")
        for config in real_configs:
            print(f"   ✅ {config.name} (ID: {config.id}) - {config.provider}")
        print(f"\n🚀 You can use any of these {len(real_configs)} configurations for REAL AI responses!")
    
    print(f"\n💡 QUICK FIX FOR DEMO:")
    print("1. Get a Gemini API key (free): https://makersuite.google.com/app/apikey")
    print("2. Update your Gemini configuration with the real key")
    print("3. Your demo will then use REAL Google Gemini AI responses!")

if __name__ == "__main__":
    check_api_keys() 
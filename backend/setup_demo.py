#!/usr/bin/env python
"""
Quick Demo Setup Script
Creates necessary AI configurations for a successful demo
"""

import os
import sys

# Add Django settings
sys.path.append('.')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'InnoFlow.settings')

import django
django.setup()

from InnoFlow.ai_integration.models import AIModelConfig

def setup_demo_configurations():
    """Create demo-ready AI configurations"""
    
    print("🚀 Setting up InnoFlow Demo Configurations...")
    
    # Demo configurations to create
    demo_configs = [
        {
            "name": "Demo Mock AI - Reliable",
            "provider": "MOCK",
            "model_name": "demo-reliable",
            "api_key": "demo-mock-key",
            "parameters": {"temperature": 0.7, "max_tokens": 1000},
            "is_active": True,
            "description": "Reliable mock AI for demonstrations"
        },
        {
            "name": "Demo Gemini Pro (Backup)",
            "provider": "GEMINI", 
            "model_name": "gemini-1.5-pro",
            "api_key": "test-gemini-key",  # Will use mock if this is test key
            "parameters": {"temperature": 0.7, "max_tokens": 1000},
            "is_active": True,
            "description": "Gemini configuration for demo (fallback to mock if no real key)"
        }
    ]
    
    created_count = 0
    
    for config_data in demo_configs:
        # Check if similar config already exists
        existing = AIModelConfig.objects.filter(
            name=config_data["name"]
        ).first()
        
        if existing:
            print(f"✅ Configuration already exists: {config_data['name']}")
            continue
        
        # Create new configuration
        try:
            config = AIModelConfig.objects.create(**config_data)
            print(f"✅ Created: {config.name} (ID: {config.id})")
            created_count += 1
        except Exception as e:
            print(f"❌ Failed to create {config_data['name']}: {str(e)}")
    
    print(f"\n🎯 Demo Setup Complete!")
    print(f"📊 Created {created_count} new configurations")
    print(f"📋 Total configurations: {AIModelConfig.objects.count()}")
    
    # Show all configurations
    print(f"\n📝 Available AI Configurations:")
    for config in AIModelConfig.objects.all():
        status = "🟢 Active" if config.is_active else "🔴 Inactive"
        print(f"   • ID: {config.id} | {config.provider} | {config.name} | {status}")
    
    print(f"\n🚀 Ready for demo! Use these commands:")
    print(f"   Backend: python manage.py runserver")
    print(f"   Frontend: cd ../frontend && npm run dev")
    print(f"   Test: python demo_test.py")

if __name__ == "__main__":
    setup_demo_configurations() 
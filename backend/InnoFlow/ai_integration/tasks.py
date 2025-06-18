from celery import shared_task
from .models import AIModelConfig, ModelComparison, ModelResponse
from .providers_registry import ProviderRegistry
import time

@shared_task
def run_ai_model_task(model_config_id: int, prompt: str, comparison_id: int = None) -> str:
    model_config = AIModelConfig.objects.get(id=model_config_id)
    
    start_time = time.time()
    
    # Check if this is a test/demo environment with fake API keys
    is_test_key = model_config.api_key and model_config.api_key.startswith('test-')
    
    if is_test_key:
        # Use mock provider for test keys
        provider = ProviderRegistry.get_provider(
            "MOCK",
            api_key=model_config.api_key,
            model_name=f"{model_config.provider.lower()}-{model_config.model_name}"
        )
    else:
        # Use real provider for production
        provider = ProviderRegistry.get_provider(
            model_config.provider.lower(),
            api_key=model_config.api_key,
            model_name=model_config.model_name,
            base_url=model_config.base_url
        )
    
    response = provider.generate_completion(prompt)
    
    latency = time.time() - start_time
    
    # Save the response
    if comparison_id:
        comparison = ModelComparison.objects.get(id=comparison_id)
        ModelResponse.objects.create(
            comparison=comparison,
            model_config=model_config,
            response=response,
            latency=latency
        )
    
    return response

@shared_task
def run_single_model_task(model_config_id: int, prompt: str, task_id: str, parameters: dict = None):
    """
    Execute a single AI model for playground usage
    Returns the response directly without saving to ModelResponse
    """
    try:
        model_config = AIModelConfig.objects.get(id=model_config_id)
        
        start_time = time.time()
        
        # Check if this is a test/demo environment with fake API keys
        is_test_key = model_config.api_key and model_config.api_key.startswith('test-')
        
        if is_test_key:
            print(f"🧪 Using mock provider for test key: {model_config.provider}")
            # Use mock provider for test keys
            provider = ProviderRegistry.get_provider(
                "MOCK",
                api_key=model_config.api_key,
                model_name=f"{model_config.provider.lower()}-{model_config.model_name}"
            )
        else:
            print(f"🚀 Using real provider: {model_config.provider}")
            # Validate model config has required fields for real providers
            if not model_config.api_key and model_config.provider in ['OPENAI', 'ANTHROPIC', 'DEEPSEEK', 'GEMINI']:
                return {
                    'error': f'API key required for {model_config.provider}',
                    'task_id': task_id,
                    'status': 'failed'
                }
            
            # Use real provider for production
            provider = ProviderRegistry.get_provider(
                model_config.provider.lower(),
                api_key=model_config.api_key,
                model_name=model_config.model_name,
                base_url=model_config.base_url
            )
        
        # Execute the model
        response = provider.generate_completion(prompt)
        
        if not response:
            return {
                'error': 'Model returned empty response',
                'task_id': task_id,
                'status': 'failed'
            }
        
        latency = time.time() - start_time
        
        return {
            'response': response,
            'latency': latency,
            'model_config': {
                'id': model_config.id,
                'name': model_config.name,
                'provider': model_config.provider,
                'model_name': model_config.model_name
            },
            'task_id': task_id,
            'status': 'completed',
            'is_mock': is_test_key
        }
        
    except AIModelConfig.DoesNotExist:
        return {
            'error': 'Model configuration not found',
            'task_id': task_id,
            'status': 'failed'
        }
    except Exception as e:
        return {
            'error': str(e),
            'task_id': task_id,
            'status': 'failed'
        }
from .utils.openai_provider import OpenAIProvider
from .utils.huggingface_provider import HuggingFaceProvider
from .utils.ollama_provider import OllamaProvider
from .utils.claude_provider import ClaudeProvider
from .utils.deepseek_provider import DeepSeekProvider
from .utils.gemini_provider import GeminiProvider
from .utils.mock_provider import MockProvider

class ProviderRegistry:
    _providers = {
        "OPENAI": OpenAIProvider,
        "CLAUDE": ClaudeProvider,
        "ANTHROPIC": ClaudeProvider,
        "HUGGINGFACE": HuggingFaceProvider,
        "DEEPSEEK": DeepSeekProvider,
        "OLLAMA": OllamaProvider,
        "GEMINI": GeminiProvider,
        "MOCK": MockProvider,
    }

    @classmethod
    def register_provider(cls, provider_name: str, provider_class):
        cls._providers[provider_name] = provider_class

    @classmethod
    def get_provider(cls, provider_name: str, **kwargs):
        key = provider_name.strip().upper()
        provider_class = cls._providers.get(key)
        if not provider_class:
            raise ValueError(f"Provider '{provider_name}' not found.")

        # Filter parameters based on provider requirements
        filtered_kwargs = {}
        
        if key == "OLLAMA":
            # Ollama needs base_url and model_name, but not api_key
            filtered_kwargs = {
                "base_url": kwargs.get("base_url", "http://localhost:11434"),
                "model_name": kwargs.get("model_name")
            }
        elif key == "HUGGINGFACE":
            # HuggingFace needs model_name and optionally api_key
            filtered_kwargs = {
                "model_name": kwargs.get("model_name"),
                "api_key": kwargs.get("api_key")
            }
        else:
            # OpenAI, Anthropic, DeepSeek, Gemini, Mock need api_key and model_name
            filtered_kwargs = {
                "api_key": kwargs.get("api_key"),
                "model_name": kwargs.get("model_name")
            }

        return provider_class(**filtered_kwargs)

    @classmethod
    def get_provider_with_fallback(cls, provider_name: str, **kwargs):
        """
        Get provider with automatic fallback to mock provider for testing
        """
        try:
            return cls.get_provider(provider_name, **kwargs)
        except Exception as e:
            print(f"Failed to create {provider_name} provider: {e}")
            # Fallback to mock provider for testing
            print(f"Falling back to mock provider for {provider_name}")
            return MockProvider(
                api_key=kwargs.get("api_key", "mock-key"),
                model_name=f"mock-{kwargs.get('model_name', 'unknown')}"
            )


# Register providers
ProviderRegistry.register_provider("OPENAI", OpenAIProvider)
ProviderRegistry.register_provider("HUGGINGFACE", HuggingFaceProvider)
ProviderRegistry.register_provider("OLLAMA", OllamaProvider)
ProviderRegistry.register_provider("CLAUDE", ClaudeProvider)
ProviderRegistry.register_provider("ANTHROPIC", ClaudeProvider)
ProviderRegistry.register_provider("DEEPSEEK", DeepSeekProvider)
ProviderRegistry.register_provider("GEMINI", GeminiProvider)
ProviderRegistry.register_provider("MOCK", MockProvider)
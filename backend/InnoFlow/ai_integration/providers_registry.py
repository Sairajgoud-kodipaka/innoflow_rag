from .utils.openai_provider import OpenAIProvider
from .utils.huggingface_provider import HuggingFaceProvider
from .utils.ollama_provider import OllamaProvider
from .utils.claude_provider import ClaudeProvider
from .utils.deepseek_provider import DeepSeekProvider
from .utils.gemini_provider import GeminiProvider

class ProviderRegistry:
    _providers = {
        "OPENAI": OpenAIProvider,
        "CLAUDE": ClaudeProvider,
        "ANTHROPIC": ClaudeProvider,
        "HUGGINGFACE": HuggingFaceProvider,
        "DEEPSEEK": DeepSeekProvider,
        "OLLAMA": OllamaProvider,
        "GEMINI": GeminiProvider,
    }

    @classmethod
    def register_provider(cls, provider_name: str, provider_class):
        cls._providers[provider_name] = provider_class

    @classmethod
    def get_provider(cls, provider_name: str, **kwargs):
        key = provider_name.strip().upper()  # 🔥 This line fixes it
        provider_class = cls._providers.get(key)
        if not provider_class:
            raise ValueError(f"Provider '{provider_name}' not found.")

        # Remove base_url for providers that don't need it
        if key not in ["OLLAMA"]:
            kwargs.pop("base_url", None)

        return provider_class(**kwargs)


# Register providers
ProviderRegistry.register_provider("OPENAI", OpenAIProvider)
ProviderRegistry.register_provider("HUGGINGFACE", HuggingFaceProvider)
ProviderRegistry.register_provider("OLLAMA", OllamaProvider)
ProviderRegistry.register_provider("CLAUDE", ClaudeProvider)
ProviderRegistry.register_provider("ANTHROPIC", ClaudeProvider)
ProviderRegistry.register_provider("DEEPSEEK", DeepSeekProvider)
ProviderRegistry.register_provider("GEMINI", GeminiProvider)
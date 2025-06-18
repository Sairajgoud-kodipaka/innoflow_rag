import anthropic
from django.conf import settings
from ..ai_providers import AIProvider

class ClaudeProvider(AIProvider):
    def __init__(self, api_key: str, model_name: str = "claude-3-5-sonnet-20241022"):
        self.api_key = api_key
        self.model_name = model_name

    def generate_completion(self, prompt: str, **kwargs):
        try:
            client = anthropic.Anthropic(api_key=self.api_key)
            
            # Use the newer Messages API for Claude 3.5
            response = client.messages.create(
                model=self.model_name,
                max_tokens=1000,
                messages=[
                    {"role": "user", "content": prompt}
                ],
                **kwargs
            )
            return response.content[0].text
        except Exception as e:
            print(f"Claude Error: {e}")
            return None
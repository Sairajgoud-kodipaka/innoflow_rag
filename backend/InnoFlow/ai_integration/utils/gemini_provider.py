from .base_provider import BaseAIProvider

class GeminiProvider(BaseAIProvider):
    def __init__(self, api_key, model_name, base_url=None):
        self.api_key = api_key
        self.model_name = model_name
        self.base_url = base_url or "https://api.gemini.com/v1"

    def generate_completion(self, prompt):
        # Implement Gemini API call here
        import requests
        headers = {"Authorization": f"Bearer {self.api_key}"}
        payload = {"model": self.model_name, "prompt": prompt}
        response = requests.post(
            f"{self.base_url}/completions", json=payload, headers=headers, timeout=30
        )
        response.raise_for_status()
        return response.json().get("completion", "")
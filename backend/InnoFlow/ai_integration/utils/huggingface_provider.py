from transformers import pipeline
from ..ai_providers import AIProvider

class HuggingFaceProvider(AIProvider):
    def __init__(self, model_name: str, api_key: str = None):
        self.model_name = model_name
        self.api_key = api_key  # Optional for HuggingFace Hub models

    def generate_completion(self, prompt: str, **kwargs):
        try:
            # Set up authentication if API key is provided
            if self.api_key:
                # For HuggingFace Hub authentication
                import os
                os.environ["HUGGINGFACE_HUB_TOKEN"] = self.api_key
            
            generator = pipeline("text-generation", model=self.model_name)
            result = generator(prompt, max_length=200, do_sample=True, **kwargs)
            return result[0]["generated_text"]
        except Exception as e:
            print(f"HuggingFace Error: {e}")
            return None
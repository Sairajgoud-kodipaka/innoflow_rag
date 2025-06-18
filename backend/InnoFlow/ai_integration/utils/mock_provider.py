import time
import random
from ..ai_providers import AIProvider

class MockProvider(AIProvider):
    """Mock AI provider for testing purposes when real API keys aren't available"""
    
    def __init__(self, api_key: str, model_name: str):
        self.api_key = api_key
        self.model_name = model_name

    def generate_completion(self, prompt: str, **kwargs):
        try:
            # Simulate some processing time
            time.sleep(random.uniform(0.5, 2.0))
            
            # Generate intelligent mock responses based on prompt
            if any(word in prompt.lower() for word in ['hello', 'hi', 'hey']):
                responses = [
                    "Hello! I'm a simulated AI assistant. How can I help you today?",
                    "Hi there! I'm working in mock mode since this is a test environment.",
                    "Hey! This is a simulated response from the mock AI provider."
                ]
            elif any(word in prompt.lower() for word in ['2+2', 'math', 'calculate']):
                responses = [
                    "2 + 2 = 4. This is a basic arithmetic calculation.",
                    "The answer to 2+2 is 4. I'm running in simulation mode.",
                    "Simple math: 2 + 2 equals 4."
                ]
            elif any(word in prompt.lower() for word in ['code', 'python', 'function']):
                responses = [
                    """Here's a simple Python function:

```python
def greet(name):
    return f"Hello, {name}!"

# Usage
print(greet("World"))
```

This is a mock response demonstrating code generation.""",
                    """```python
def add_numbers(a, b):
    return a + b

result = add_numbers(2, 2)
print(f"Result: {result}")
```

Mock AI provider simulating code generation."""
                ]
            else:
                responses = [
                    f"I understand you're asking about: '{prompt[:50]}...'. This is a simulated response from the {self.model_name} mock provider.",
                    f"Thank you for your question. I'm currently running in mock mode to test the {self.model_name} integration.",
                    f"This is a test response from the mock {self.model_name} provider. Your prompt was processed successfully."
                ]
            
            # Add model information to the response
            selected_response = random.choice(responses)
            return f"{selected_response}\n\n[Mock Response from {self.model_name} - Provider: {self.__class__.__name__}]"
            
        except Exception as e:
            return f"Mock Provider Error: {str(e)}" 
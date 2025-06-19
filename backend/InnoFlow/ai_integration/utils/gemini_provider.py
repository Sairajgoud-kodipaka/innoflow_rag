import requests
from django.conf import settings
from ..ai_providers import AIProvider

class GeminiProvider(AIProvider):
    def __init__(self, api_key: str, model_name: str = "gemini-1.5-pro"):
        self.api_key = api_key
        self.model_name = model_name
        self.base_url = "https://generativelanguage.googleapis.com/v1beta"

    def generate_completion(self, prompt: str, **kwargs):
        try:
            headers = {
                "Content-Type": "application/json"
            }
            
            # Gemini uses a different API structure
            payload = {
                "contents": [
                    {
                        "parts": [
                            {
                                "text": prompt
                            }
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": kwargs.get("temperature", 0.7),
                    "maxOutputTokens": kwargs.get("max_tokens", 1000),
                    "topP": kwargs.get("top_p", 0.8),
                    "topK": kwargs.get("top_k", 10)
                }
            }
            
            # Add any additional parameters
            if "safety_settings" in kwargs:
                payload["safetySettings"] = kwargs["safety_settings"]
            
            # Debug logging
            url = f"{self.base_url}/models/{self.model_name}:generateContent?key={self.api_key[:10]}..."
            print(f"🔍 DEBUG: Making request to: {url}")
            print(f"🔍 DEBUG: Headers: {headers}")
            print(f"🔍 DEBUG: Payload: {payload}")
            
            response = requests.post(
                f"{self.base_url}/models/{self.model_name}:generateContent?key={self.api_key}",
                headers=headers,
                json=payload,
                timeout=30
            )
            
            print(f"🔍 DEBUG: Response status: {response.status_code}")
            print(f"🔍 DEBUG: Response headers: {dict(response.headers)}")
            print(f"🔍 DEBUG: Response text: {response.text}")
            
            # Better error handling for different HTTP status codes
            if response.status_code == 429:
                print(f"Gemini Rate Limit: Too many requests. Please wait and try again.")
                print(f"Google's response: {response.text}")  # Show actual Google error
                # Wait a bit and retry once
                import time
                time.sleep(2)
                try:
                    retry_response = requests.post(
                        f"{self.base_url}/models/{self.model_name}:generateContent?key={self.api_key}",
                        headers=headers,
                        json=payload,
                        timeout=30
                    )
                    if retry_response.status_code == 200:
                        retry_result = retry_response.json()
                        if "candidates" in retry_result and len(retry_result["candidates"]) > 0:
                            return retry_result["candidates"][0]["content"]["parts"][0]["text"]
                except:
                    pass
                return "I'm currently experiencing high demand. Please try again in a few moments."
            elif response.status_code == 401:
                print(f"Gemini Auth Error: Invalid API key")
                return "Authentication failed. Please check your Gemini API key."
            elif response.status_code == 400:
                print(f"Gemini Bad Request: {response.text}")
                return "Invalid request format. Please check your input."
            elif response.status_code >= 500:
                print(f"Gemini Server Error: {response.status_code}")
                return "Gemini service is temporarily unavailable. Please try again later."
            
            response.raise_for_status()
            
            result = response.json()
            if "candidates" in result and len(result["candidates"]) > 0:
                content = result["candidates"][0]["content"]["parts"][0]["text"]
                return content
            else:
                print("Gemini: No content generated")
                return "No response generated. Please try a different prompt."
                
        except requests.exceptions.Timeout:
            print(f"Gemini Timeout: Request timed out")
            return "Request timed out. Please try again."
        except requests.exceptions.ConnectionError:
            print(f"Gemini Connection Error: Unable to connect to Gemini API")
            return "Unable to connect to Gemini. Please check your internet connection."
        except Exception as e:
            print(f"Gemini Error: {e}")
            return f"An error occurred: {str(e)}" 
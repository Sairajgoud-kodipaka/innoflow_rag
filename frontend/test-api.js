// Simple test to check API endpoints
const testAPI = async () => {
  try {
    console.log('🔄 Testing API endpoints...');
    
    // Test the AI model configs endpoint
    const response = await fetch('http://localhost:8000/api/ai/aimodelconfig/');
    console.log('📊 Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Response:', data);
      console.log('🔢 Number of models:', data.length || (data.results ? data.results.length : 0));
    } else {
      console.error('❌ API Error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
    }
  } catch (error) {
    console.error('💥 Network Error:', error);
  }
};

testAPI(); 
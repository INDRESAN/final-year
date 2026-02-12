"""
Test the verify endpoint to check if it's using clean_db correctly
"""
import requests
import json
from PIL import Image
import io
import base64

API_URL = "http://127.0.0.1:8000/api"

def test_verification():
    """Test verification with a test image"""
    
    # Create a simple test image (red square)
    test_image = Image.new('RGB', (100, 100), color='red')
    
    # Convert to base64
    buffer = io.BytesIO()
    test_image.save(buffer, format='JPEG')
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.getvalue()).decode()
    
    # Test verification
    print("Testing verification API...")
    payload = {
        "image_base64": image_base64
    }
    
    response = requests.post(f"{API_URL}/verify", json=payload)
    
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

if __name__ == "__main__":
    test_verification()

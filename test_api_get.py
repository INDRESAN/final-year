import requests
import json
print("Fetching users from running API:", "http://localhost:8000/api/users")
try:
    resp = requests.get("http://localhost:8000/api/users")
    print(json.dumps(resp.json(), indent=2))
except Exception as e:
    print(e)

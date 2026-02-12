#!/usr/bin/env python3
"""Post a local image file to /api/verify and print the JSON response."""
import sys
import base64
import json
import urllib.request

def post_image(path, url="http://127.0.0.1:8000/api/verify"):
    with open(path, "rb") as f:
        b = f.read()
    payload = json.dumps({"image_base64": base64.b64encode(b).decode()}).encode()
    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        print(resp.read().decode())

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: verify_with_file.py <image_path>")
        sys.exit(1)
    post_image(sys.argv[1])

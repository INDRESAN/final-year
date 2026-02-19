#!/usr/bin/env python3
"""Enroll an image file under a username, then verify it via the API.

Usage:
  python enroll_and_verify.py <username> <image_path>

This posts to /api/enroll then /api/verify and prints both responses.
"""
import sys
import base64
import json
import urllib.request

API_BASE = "http://127.0.0.1:8000/api"

def post_json(path, payload):
    data = json.dumps(payload).encode()
    req = urllib.request.Request(path, data=data, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read().decode()

def enroll(username, image_path):
    with open(image_path, "rb") as f:
        b = f.read()
    payload = {
        "username": username,
        "admin_username": "admin",
        "image_base64": base64.b64encode(b).decode()
    }
    return post_json(API_BASE + "/enroll", payload)

def verify(image_path):
    with open(image_path, "rb") as f:
        b = f.read()
    payload = {"image_base64": base64.b64encode(b).decode()}
    return post_json(API_BASE + "/verify", payload)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: enroll_and_verify.py <username> <image_path>")
        sys.exit(1)
    username = sys.argv[1]
    path = sys.argv[2]

    print("Enrolling...")
    print(enroll(username, path))
    print("Verifying...")
    print(verify(path))

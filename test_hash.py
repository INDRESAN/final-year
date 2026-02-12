#!/usr/bin/env python3
"""Quick test to verify admin credentials hash"""

import hashlib
import json

# Test what the hash of "admin123" should be
test_password = "admin123"
computed_hash = hashlib.sha256(test_password.encode()).hexdigest()

print(f"Testing password: '{test_password}'")
print(f"Computed hash:    {computed_hash}")
print()

# Read what's actually stored
try:
    with open("admin_creds.json", "r") as f:
        creds = json.load(f)
    stored_hash = creds.get("password_hash")
    print(f"Stored hash:      {stored_hash}")
    print()
    
    if computed_hash == stored_hash:
        print("✅ MATCH! Hash is correct.")
        print("   Username: admin")
        print("   Password: admin123")
    else:
        print("❌ MISMATCH! Hashes don't match.")
        print(f"   Computed: {computed_hash}")
        print(f"   Stored:   {stored_hash}")
except FileNotFoundError:
    print("❌ admin_creds.json not found!")
except Exception as e:
    print(f"❌ Error: {e}")

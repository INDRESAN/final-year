import numpy as np
import os
import json
import hashlib

DB = "db.npy"
CLEAN_DB = "clean_db.npy"
LOCK_FILE = "enrollment.lock"
ADMIN_FILE = "admin_creds.json"

# Default admin credentials (CHANGE THESE!)
DEFAULT_ADMIN = {
    "username": "admin",
    "password_hash": hashlib.sha256("admin123".encode()).hexdigest()
}

def init_admin():
    """Initialize admin credentials file if it doesn't exist"""
    if not os.path.exists(ADMIN_FILE):
        with open(ADMIN_FILE, "w") as f:
            json.dump(DEFAULT_ADMIN, f)
        print("⚠️  Default admin created: admin / admin123")
        print("   ⚠️  CHANGE PASSWORD IMMEDIATELY in admin_creds.json!")

def verify_admin(username, password):
    """Verify admin credentials"""
    init_admin()
    
    try:
        with open(ADMIN_FILE, "r") as f:
            admin_data = json.load(f)
        
        password_hash = hashlib.sha256(password.encode()).hexdigest()
        
        if admin_data.get("username") == username and admin_data.get("password_hash") == password_hash:
            return True
        return False
    except:
        return False

def change_admin_password(username, old_password, new_password):
    """Change admin password"""
    if not verify_admin(username, old_password):
        return False, "Invalid current password"
    
    try:
        admin_data = {
            "username": username,
            "password_hash": hashlib.sha256(new_password.encode()).hexdigest()
        }
        with open(ADMIN_FILE, "w") as f:
            json.dump(admin_data, f)
        return True, "Password changed successfully"
    except Exception as e:
        return False, str(e)

def load_db():
    if os.path.exists(DB):
        return np.load(DB, allow_pickle=True).item()
    return {}

def load_clean_db():
    if os.path.exists(CLEAN_DB):
        return np.load(CLEAN_DB, allow_pickle=True).item()
    return {}

def save_db(db, trusted=True):
    np.save(DB, db)
    if trusted:
        np.save(CLEAN_DB, db)

def is_enrollment_locked():
    return os.path.exists(LOCK_FILE)

def lock_enrollment():
    with open(LOCK_FILE, "w") as f:
        f.write("ENROLLMENT CLOSED")

def unlock_enrollment():
    """Unlock enrollment system"""
    if os.path.exists(LOCK_FILE):
        os.remove(LOCK_FILE)
        return True
    return False

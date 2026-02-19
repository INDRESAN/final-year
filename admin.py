"""
Admin management tool - Manage admin credentials and system settings
"""
from database import verify_admin, change_admin_password, is_enrollment_locked, lock_enrollment, unlock_enrollment, load_db, save_db
import getpass
import os
from pathlib import Path
import numpy as np

def admin_login():
    """Admin authentication"""
    max_attempts = 3
    
    print("\n" + "="*60)
    print("🔐 ADMIN LOGIN")
    print("="*60)
    
    for attempt in range(max_attempts):
        attempts_left = max_attempts - attempt
        username = input("\n👤 Admin Username: ")
        password = getpass.getpass("🔑 Admin Password: ")
        
        if verify_admin(username, password):
            print("\n✅ Admin authenticated successfully!")
            return username
        else:
            print(f"\n❌ Invalid credentials. Attempts remaining: {attempts_left - 1}")
    
    print("\n🚫 Access denied - Too many failed attempts")
    return None

def admin_menu(username):
    """Admin control panel"""
    while True:
        print("\n" + "="*60)
        print("👨‍💼 ADMIN CONTROL PANEL")
        print("="*60)
        print("1. 🔑 Change admin password")
        print("2. 📊 View enrollment status")
        print("3. 📋 List all users")
        print("4. 🗑️  Delete user")
        print("5. 🔒 Lock enrollment system")
        print("6. 🔓 Unlock enrollment system")
        print("7. 👋 Logout")
        
        choice = input("\nSelect option (1-7): ").strip()
        
        if choice == "1":
            change_password(username)
        elif choice == "2":
            view_enrollment_status()
        elif choice == "3":
            list_users()
        elif choice == "4":
            delete_user()
        elif choice == "5":
            lock_system()
        elif choice == "6":
            unlock_system()
        elif choice == "7":
            print("\n👋 Logged out successfully")
            break
        else:
            print("❌ Invalid option")

def change_password(username):
    """Change admin password"""
    print("\n" + "-"*60)
    print("🔐 CHANGE ADMIN PASSWORD")
    print("-"*60)
    
    old_pwd = getpass.getpass("\nCurrent password: ")
    new_pwd = getpass.getpass("New password (min 8 chars): ")
    confirm_pwd = getpass.getpass("Confirm new password: ")
    
    if len(new_pwd) < 8:
        print("❌ Password must be at least 8 characters")
        return
    
    if new_pwd != confirm_pwd:
        print("❌ Passwords do not match")
        return
    
    success, message = change_admin_password(username, old_pwd, new_pwd)
    print(f"\n{'✅' if success else '❌'} {message}")

def view_enrollment_status():
    """View enrollment system status"""
    print("\n" + "-"*60)
    print("📊 ENROLLMENT STATUS")
    print("-"*60)
    
    if is_enrollment_locked():
        print("\n🔒 Status: LOCKED")
        print("   → New users cannot be added")
        print("   → Existing users can still be verified")
    else:
        print("\n🟢 Status: OPEN")
        print("   → New users can be added")
        print("   → Admin can enroll users")

def lock_system():
    """Permanently lock enrollment"""
    print("\n" + "-"*60)
    print("⚠️  LOCK ENROLLMENT SYSTEM")
    print("-"*60)
    
    if is_enrollment_locked():
        print("\n⚠️  Enrollment is already locked")
        return
    
    confirm = input("\n⚠️  Are you sure? (yes/no): ")
    if confirm.lower() == "yes":
        confirm2 = input("Type 'LOCK' to confirm: ")
        if confirm2 == "LOCK":
            lock_enrollment()
            print("\n🔒 Enrollment system LOCKED")
        else:
            print("❌ Cancelled")
    else:
        print("❌ Cancelled")

def unlock_system():
    """Unlock enrollment system"""
    print("\n" + "-"*60)
    print("🔓 UNLOCK ENROLLMENT SYSTEM")
    print("-"*60)
    
    if not is_enrollment_locked():
        print("\n⚠️  Enrollment is already open")
        return
    
    confirm = input("\n⚠️  Are you sure? (yes/no): ")
    if confirm.lower() == "yes":
        confirm2 = input("Type 'UNLOCK' to confirm: ")
        if confirm2 == "UNLOCK":
            if unlock_enrollment():
                print("\n🟢 Enrollment system UNLOCKED")
                print("   ✓ New users can now be added")
            else:
                print("❌ Failed to unlock")
        else:
            print("❌ Cancelled")
    else:
        print("❌ Cancelled")

def list_users():
    """List all enrolled users"""
    print("\n" + "-"*60)
    print("📋 ENROLLED USERS")
    print("-"*60)
    
    try:
        db = load_db()
        if not db:
            print("\n⚠️  No users enrolled yet")
            return
        
        users = sorted(db.keys())
        print(f"\nTotal users: {len(users)}\n")
        
        for i, user in enumerate(users, 1):
            embedding = db[user]
            emb_size = len(embedding) if hasattr(embedding, '__len__') else 0
            print(f"{i}. {user} (embedding dim: {emb_size})")
        
    except Exception as e:
        print(f"❌ Error loading users: {e}")

def delete_user():
    """Delete a user from database and filesystem"""
    print("\n" + "-"*60)
    print("🗑️  DELETE USER")
    print("-"*60)
    
    try:
        db = load_db()
        if not db:
            print("\n⚠️  No users to delete")
            return
        
        users = sorted(db.keys())
        print(f"\nEnrolled users ({len(users)}):")
        for i, user in enumerate(users, 1):
            print(f"  {i}. {user}")
        
        username = input("\nEnter username to delete (or 'cancel'): ").strip()
        if username.lower() == "cancel":
            print("❌ Cancelled")
            return
        
        if username not in db:
            print(f"❌ User '{username}' not found")
            return
        
        # Confirm deletion
        confirm = input(f"\n⚠️  Delete '{username}'? (yes/no): ")
        if confirm.lower() != "yes":
            print("❌ Cancelled")
            return
        
        confirm2 = input(f"Type username '{username}' to confirm: ")
        if confirm2 != username:
            print("❌ Cancelled")
            return
        
        # Delete from db.npy
        del db[username]
        save_db(db)
        print(f"\n✅ Removed from db.npy")
        
        # Delete from clean_db.npy if exists
        clean_path = Path("clean_db.npy")
        if clean_path.exists():
            try:
                clean_db = np.load("clean_db.npy", allow_pickle=True).item()
                if username in clean_db:
                    del clean_db[username]
                    np.save("clean_db.npy", clean_db)
                    print(f"✅ Removed from clean_db.npy")
            except Exception as e:
                print(f"⚠️  Could not update clean_db.npy: {e}")
        
        # Delete photos from faces/ folder
        faces_dir = Path("faces")
        if faces_dir.exists():
            deleted_count = 0
            for photo in faces_dir.glob(f"*{username}*"):
                try:
                    photo.unlink()
                    deleted_count += 1
                except Exception as e:
                    print(f"⚠️  Could not delete {photo.name}: {e}")
            if deleted_count > 0:
                print(f"✅ Deleted {deleted_count} photo(s) from faces/")
        
        print(f"\n✅ User '{username}' completely deleted!")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    print("\n" + "="*60)
    print("🔐 DeepAudit - Admin Management System")
    print("="*60)
    
    admin = admin_login()
    if admin:
        admin_menu(admin)

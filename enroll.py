from deepface import DeepFace
import numpy as np
from camera import capture
from database import load_db, save_db, is_enrollment_locked, lock_enrollment, verify_admin, change_admin_password
import getpass

print("\n" + "="*60)
print("🔐 ADMIN AUTHENTICATION REQUIRED")
print("="*60)

# Admin login
max_attempts = 3
authenticated = False

for attempt in range(max_attempts):
    attempts_left = max_attempts - attempt
    username = input("\n👤 Admin Username: ")
    password = getpass.getpass("🔑 Admin Password: ")
    
    if verify_admin(username, password):
        print("\n✅ Admin authenticated successfully!")
        authenticated = True
        break
    else:
        print(f"\n❌ Invalid credentials. Attempts remaining: {attempts_left - 1}")

if not authenticated:
    print("\n🚫 Access denied - Too many failed attempts")
    exit()

# 🔒 Check if enrollment is locked
if is_enrollment_locked():
    print("❌ Enrollment is locked. Cannot add new users.")
    exit()

# Menu for admin
print("\n" + "="*60)
print("👨‍💼 ADMIN MENU")
print("="*60)
print("1. Add new user (Enrollment)")
print("2. Change admin password")
print("3. Exit")

choice = input("\nSelect option (1-3): ")

if choice == "2":
    old_pwd = getpass.getpass("\nCurrent password: ")
    new_pwd = getpass.getpass("New password: ")
    confirm_pwd = getpass.getpass("Confirm new password: ")
    
    if new_pwd != confirm_pwd:
        print("❌ Passwords do not match")
        exit()
    
    success, message = change_admin_password(username, old_pwd, new_pwd)
    print(f"\n{'✅' if success else '❌'} {message}")
    exit()

elif choice != "1":
    print("❌ Invalid option")
    exit()

# Enrollment process
print("\n" + "="*60)
print("📝 USER ENROLLMENT")
print("="*60)

name = input("\n👤 Enter new user name: ")

# Check if user already exists
existing_db = load_db()
if name in existing_db:
    print(f"⚠️  User '{name}' already exists in database")
    overwrite = input("Overwrite? (yes/no): ")
    if overwrite.lower() != "yes":
        print("❌ Enrollment cancelled")
        exit()

embeddings = []

print(f"\n📸 Capturing 5 images for {name}")
print("=" * 50)

for i in range(1, 6):
    print(f"\n[{i}/5] Preparing camera...")
    img = capture(f"{name}_{i-1}", photo_number=i)
    
    if img is None:
        print(f"⚠️  Photo {i} skipped")
        continue

    print(f"🔍 Processing image {i}/5...")
    emb = DeepFace.represent(
        img_path=img,
        model_name="ArcFace",
        enforce_detection=False
    )[0]["embedding"]

    emb = emb / np.linalg.norm(emb)
    embeddings.append(emb)
    print(f"✅ Image {i} processed")

if len(embeddings) < 3:
    print("\n❌ Not enough images captured (need at least 3)")
    exit()

avg_emb = np.mean(np.array(embeddings), axis=0)
avg_emb = avg_emb / np.linalg.norm(avg_emb)

db = load_db()
db[name] = avg_emb

save_db(db, trusted=True)

print("\n" + "=" * 50)
print(f"✅ {name} enrolled successfully with {len(embeddings)} images")
print(f"✅ Enrollment saved by admin: {username}")
print("=" * 50)

# 🔒 Close enrollment (admin decision)
close = input("\n🔒 Lock enrollment permanently? (yes/no): ")
if close.lower() == "yes":
    lock_enrollment()
    print("🔒 Enrollment permanently locked - no new users can be added")

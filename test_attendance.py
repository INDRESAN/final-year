import sys
from database import init_user_metadata, load_metadata, save_metadata, update_user_metadata
from datetime import datetime, timedelta

def test_metadata():
    print("Testing Metadata...")
    # Initialize some dummy users
    init_user_metadata("alice")
    init_user_metadata("bob")
    init_user_metadata("charlie")
    
    metadata = load_metadata()
    print("Initial Metadata:", metadata)
    
    # Simulate verification for alice today
    today_str = datetime.now().strftime("%Y-%m-%d")
    update_user_metadata("alice", {"last_verified_date": today_str})
    
    # Simulate block for charlie
    update_user_metadata("charlie", {"blocked": True})
    
    # Run deduction manually
    print("\nRunning deduction...")
    metadata = load_metadata()
    updated_count = 0
    
    for user, info in metadata.items():
        if info.get("blocked", False):
            print(f"Skipping {user} (Blocked)")
            continue
            
        if info.get("last_verified_date") != today_str:
            current_attendance = info.get("attendance", 100)
            new_attendance = max(0, current_attendance - 2)
            
            if new_attendance != current_attendance:
                update_user_metadata(user, {"attendance": new_attendance})
                updated_count += 1
                print(f"Deducted from {user}: {current_attendance} -> {new_attendance}")
        else:
            print(f"Skipping {user} (Verified today)")
            
    print(f"\nDeducted from {updated_count} users")
    
    final_metadata = load_metadata()
    print("\nFinal Metadata:", final_metadata)

if __name__ == "__main__":
    test_metadata()

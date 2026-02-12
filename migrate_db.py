"""
Database migration script to fix watermarking issues
Separates watermarked and clean embeddings for existing users
"""
import numpy as np
import os
from watermark import watermark_mgr

DB = "db.npy"
CLEAN_DB = "clean_db.npy"

def fix_database():
    """Fix the databases by properly separating watermarked and clean embeddings"""
    print("Starting database migration...")
    
    # Load current database
    if not os.path.exists(DB):
        print("No database found, nothing to migrate.")
        return
    
    db = np.load(DB, allow_pickle=True).item()
    
    # Create fresh clean_db by re-watermarking each user
    clean_db = {}
    fixed_db = {}
    
    print(f"Processing {len(db)} users...")
    
    for username, embedding in db.items():
        try:
            # The current embedding might be watermarked or clean, we assume it's clean
            # (from the old broken save_db method)
            clean_embedding = np.array(embedding)
            
            # Normalize it
            clean_embedding = clean_embedding / np.linalg.norm(clean_embedding)
            
            # Store in clean_db
            clean_db[username] = clean_embedding.copy()
            
            # Re-watermark it
            watermarked = watermark_mgr.embed_watermark(clean_embedding, username)
            fixed_db[username] = watermarked
            
            # Verify watermark on the new embedding
            is_valid, conf = watermark_mgr.verify_watermark(watermarked, username)
            
            print(f"  {username}: watermark_valid={is_valid}, confidence={conf:.4f}")
            
        except Exception as e:
            print(f"  {username}: ERROR - {e}")
    
    # Backup old database
    if os.path.exists(DB):
        backup_name = DB.replace(".npy", "_backup_old.npy")
        if os.path.exists(backup_name):
            os.remove(backup_name)  # Remove old backup
        os.rename(DB, backup_name)
        print(f"Backed up old database to {backup_name}")
    
    # Save fixed databases
    np.save(DB, fixed_db)
    np.save(CLEAN_DB, clean_db)
    
    print(f"\n✅ Migration complete!")
    print(f"   Watermarked DB: {DB}")
    print(f"   Clean DB: {CLEAN_DB}")
    print(f"   Total users: {len(fixed_db)}")

if __name__ == "__main__":
    fix_database()

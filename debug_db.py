"""
Debug script to inspect database content and verify embeddings
"""
import numpy as np
from database import load_db, load_clean_db
from watermark import watermark_mgr

def debug_database():
    """Inspect the actual database content"""
    print("=" * 70)
    print("DATABASE DEBUG INSPECTION")
    print("=" * 70)
    
    try:
        db = load_db()
        clean_db = load_clean_db()
        
        print(f"\n✓ Loaded databases successfully")
        print(f"  Watermarked DB users: {list(db.keys())}")
        print(f"  Clean DB users: {list(clean_db.keys())}")
        
        if len(clean_db) == 0:
            print("\n❌ ERROR: Clean DB is EMPTY!")
            return
        
        print(f"\n" + "=" * 70)
        print("EMBEDDING ANALYSIS")
        print("=" * 70)
        
        for username in clean_db:
            clean_emb = clean_db[username]
            
            print(f"\nUser: {username}")
            print(f"  Clean embedding shape: {clean_emb.shape}")
            print(f"  Clean embedding norm: {np.linalg.norm(clean_emb):.4f}")
            print(f"  First 5 values: {clean_emb[:5]}")
            print(f"  Min: {clean_emb.min():.6f}, Max: {clean_emb.max():.6f}")
            print(f"  Mean: {clean_emb.mean():.6f}, Std: {clean_emb.std():.6f}")
            
            if username in db:
                wm_emb = db[username]
                print(f"  Watermarked embedding norm: {np.linalg.norm(wm_emb):.4f}")
                print(f"  Similarity (clean vs watermarked): {np.dot(clean_emb, wm_emb):.4f}")
        
        # Test cross-user similarity
        print(f"\n" + "=" * 70)
        print("CROSS-USER SIMILARITY")
        print("=" * 70)
        
        users = list(clean_db.keys())
        if len(users) >= 2:
            emb1 = clean_db[users[0]]
            emb2 = clean_db[users[1]]
            cross_sim = np.dot(emb1, emb2)
            print(f"\nSimilarity between {users[0]} and {users[1]}: {cross_sim:.4f}")
            print(f"This should be LOW (< 0.2) for different people")
        
        # Check if embeddings are duplicate
        print(f"\n" + "=" * 70)
        print("DUPLICATE CHECK")
        print("=" * 70)
        
        embeddings = list(clean_db.values())
        if len(embeddings) >= 2:
            for i in range(len(embeddings)):
                for j in range(i+1, len(embeddings)):
                    sim = np.dot(embeddings[i], embeddings[j])
                    user_i = users[i]
                    user_j = users[j]
                    print(f"{user_i} vs {user_j}: {sim:.6f}", end="")
                    if sim > 0.95:
                        print(" ⚠️  DUPLICATE!")
                    else:
                        print()
        
    except Exception as e:
        print(f"❌ ERROR: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    debug_database()

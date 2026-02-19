"""
Test script to verify watermark and face matching work correctly
"""
import numpy as np
from watermark import watermark_mgr
from database import load_db, load_clean_db

def test_watermark():
    """Test watermark embedding and verification"""
    print("=" * 60)
    print("TESTING WATERMARK FUNCTIONALITY")
    print("=" * 60)
    
    # Create a test embedding
    test_embedding = np.random.randn(512)
    test_embedding = test_embedding / np.linalg.norm(test_embedding)
    
    identity = "test_user"
    
    # Embed watermark
    watermarked = watermark_mgr.embed_watermark(test_embedding, identity)
    print(f"\n1. Original embedding norm: {np.linalg.norm(test_embedding):.4f}")
    print(f"   Watermarked embedding norm: {np.linalg.norm(watermarked):.4f}")
    
    # Check similarity between original and watermarked
    sim = np.dot(test_embedding, watermarked)
    print(f"\n2. Cosine similarity (original vs watermarked): {sim:.4f}")
    print(f"   This should be close to 1.0 (minimal distortion)")
    
    # Verify watermark
    is_valid, confidence = watermark_mgr.verify_watermark(watermarked, identity)
    print(f"\n3. Watermark verification:")
    print(f"   Is valid: {is_valid}")
    print(f"   Confidence: {confidence:.4f}")
    print(f"   Threshold: {watermark_mgr.CONFIDENCE_THRESHOLD:.4f}")
    
    # Try with wrong identity (should fail)
    is_valid_wrong, confidence_wrong = watermark_mgr.verify_watermark(watermarked, "wrong_user")
    print(f"\n4. Watermark verification with WRONG identity:")
    print(f"   Is valid: {is_valid_wrong}")
    print(f"   Confidence: {confidence_wrong:.4f}")
    
    print("\n" + "=" * 60)

def test_database_consistency():
    """Test that databases are properly formed"""
    print("\nTesting database consistency...")
    
    try:
        db = load_db()
        clean_db = load_clean_db()
        
        print(f"Watermarked DB users: {list(db.keys())}")
        print(f"Clean DB users: {list(clean_db.keys())}")
        
        if len(db) != len(clean_db):
            print(f"⚠️  WARNING: DB sizes don't match! Watermarked={len(db)}, Clean={len(clean_db)}")
        else:
            print(f"✅ DB sizes match: {len(db)} users")
            
        # Check each user
        for user in clean_db:
            if user in db:
                w_emb = db[user]
                c_emb = clean_db[user]
                
                # Check similarity
                sim = np.dot(w_emb, c_emb)
                
                # Check watermark
                is_valid, conf = watermark_mgr.verify_watermark(w_emb, user)
                
                print(f"\n  User: {user}")
                print(f"    Watermark valid: {is_valid} (conf={conf:.4f})")
                print(f"    Watermarked vs Clean similarity: {sim:.4f}")
            else:
                print(f"\n  User {user}: MISSING in watermarked DB!")
                
    except FileNotFoundError:
        print("  Databases not found. Enroll some users first.")

if __name__ == "__main__":
    test_watermark()
    test_database_consistency()

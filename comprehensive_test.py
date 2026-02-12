"""
Comprehensive verification test 
Simulates what happens when we verify each enrolled user's embedding
"""
import numpy as np
from database import load_db, load_clean_db

def cosine_similarity(a, b):
    """Calculate cosine similarity between two vectors"""
    return (a @ b) / (np.linalg.norm(a) * np.linalg.norm(b))

def test_verify_each_user():
    """Test verifying each enrolled user against the database"""
    print("=" * 80)
    print("COMPREHENSIVE VERIFICATION TEST")
    print("=" * 80)
    
    db = load_db()
    clean_db = load_clean_db()
    users = list(clean_db.keys())
    
    print(f"\nEnrolled users: {users}")
    print(f"Threshold: 0.55")
    print(f"\n" + "=" * 80)
    
    for test_user in users:
        print(f"\nTEST: Verifying {test_user}'s clean embedding")
        print(f"{'-' * 80}")
        
        test_embedding = clean_db[test_user]
        
        # Find best match
        best_match = None
        best_score = 0.0
        scores = {}
        
        for user in clean_db:
            clean = clean_db[user]
            score = cosine_similarity(test_embedding, clean)
            scores[user] = score
            
            if score > best_score:
                best_score = score
                best_match = user
        
        # Print all scores
        print(f"Similarity scores:")
        for user in sorted(scores.keys()):
            score = scores[user]
            is_best = " <- BEST" if user == best_match else ""
            print(f"  {user:<15}: {score:.4f}{is_best}")
        
        # Check result
        print(f"\nBest match: {best_match}")
        print(f"Best score: {best_score:.4f}")
        print(f"Threshold:  0.55")
        
        if best_score > 0.55:
            result = f"✅ MATCH: {best_match}"
            correct = (best_match == test_user)
        else:
            result = f"❌ NO MATCH"
            correct = False
        
        status = "✓ CORRECT" if correct else "✗ WRONG!"
        print(f"Result: {result}")
        print(f"Status: {status}")

if __name__ == "__main__":
    test_verify_each_user()

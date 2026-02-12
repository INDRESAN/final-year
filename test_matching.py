"""
Test verification with actual enrolled faces
"""
import numpy as np
from deepface import DeepFace
from database import load_db, load_clean_db
import tempfile
import os

def cosine_similarity(a, b):
    """Calculate cosine similarity between two vectors"""
    return (a @ b) / (np.linalg.norm(a) * np.linalg.norm(b))

def test_with_clean_embedding():
    """Test by creating a test embedding from an enrolled user"""
    print("=" * 70)
    print("TESTING VERIFICATION WITH ACTUAL EMBEDDINGS")
    print("=" * 70)
    
    clean_db = load_clean_db()
    
    if not clean_db:
        print("❌ No enrolled users!")
        return
    
    # Use the first enrolled user's embedding as "test image"
    first_user = list(clean_db.keys())[0]
    test_embedding = clean_db[first_user].copy()
    
    print(f"\nUsing {first_user}'s clean embedding as test")
    print(f"Test embedding norm: {np.linalg.norm(test_embedding):.4f}")
    
    # Run matching logic
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
    
    print(f"\nSimilarity scores:")
    for user, score in scores.items():
        marker = " <- BEST" if user == best_match else ""
        print(f"  {user}: {score:.4f}{marker}")
    
    print(f"\nThreshold: 0.4")
    print(f"Best match: {best_match}")
    print(f"Best score: {best_score:.4f}")
    
    if best_score > 0.4:
        print(f"✅ RESULT: Matched to {best_match}")
    else:
        print(f"❌ RESULT: No match (score too low)")

if __name__ == "__main__":
    test_with_clean_embedding()

"""
Check if all enrolled faces are actually the same person
"""
import numpy as np
from database import load_clean_db

def check_duplicates():
    """Check if enrolled users might be duplicates"""
    print("=" * 70)
    print("CHECKING FOR DUPLICATE ENROLLMENTS")
    print("=" * 70)
    
    clean_db = load_clean_db()
    users = list(clean_db.keys())
    
    print(f"\nEnrolled users: {users}")
    print(f"\nCross-similarity matrix:")
    print(f"{'User1':<15} {'User2':<15} {'Similarity':<12} {'Status'}")
    print("-" * 55)
    
    for i, user1 in enumerate(users):
        for j, user2 in enumerate(users):
            if i >= j:
                continue
            
            emb1 = clean_db[user1]
            emb2 = clean_db[user2]
            
            sim = np.dot(emb1, emb2)
            
            status = ""
            if sim > 0.95:
                status = "⚠️ PROBABLY SAME PERSON"
            elif sim > 0.7:
                status = "⚠️ HIGH SIMILARITY"
            elif sim > 0.5:
                status = "maybe similar"
            else:
                status = "✓ Different"
            
            print(f"{user1:<15} {user2:<15} {sim:<12.4f} {status}")

if __name__ == "__main__":
    check_duplicates()

from deepface import DeepFace
import numpy as np
from database import load_db, save_db
import os
import cv2

# Hacker uses multiple photos (different angles, lighting)
# Collect all Mahesh images - robust to angles and lighting
hacker_base = "faces"
hacker_images = [
    os.path.join(hacker_base, f) for f in os.listdir(hacker_base) 
    if "Mahesh" in f
]

if not hacker_images:
    hacker_images = ["faces/Mahesh_0.jpg"]

print(f"📸 Using {len(hacker_images)} images for robust embedding")

# Photo count analysis
photo_count = len(hacker_images)
if photo_count < 3:
    print("⚠️  WARNING: Less than 3 photos - accuracy may be ~65-75%")
    print("   Recommendation: Use 5-7 photos for better accuracy")
elif photo_count < 5:
    print(f"✓ {photo_count} photos - accuracy ~80-85%")
    print("   Recommendation: Add 2-3 more for higher accuracy")
elif photo_count < 10:
    print(f"✓ {photo_count} photos - accuracy ~90%+")
    print("   Good coverage for attack robustness")
else:
    print(f"✓✓ {photo_count} photos - accuracy ~95%+")
    print("   Excellent coverage across angles & lighting")

embeddings = []
models = ["ArcFace", "VGGFace2", "FaceNet"]

# Prioritize angles: Frontal > Slight angles > Extreme angles
# Higher weights for better angles
angle_weights = {
    0: 3.0,      # Frontal (0°) - best accuracy
    15: 2.5,     # Slight angle (±15°)
    30: 2.0,     # Medium angle (±30°)
    45: 1.0,     # Wide angle (±45°) - reduced weight
}

weighted_embeddings = []

# Use multiple models for ensemble robustness
for model in models:
    for img_path in hacker_images:
        try:
            img = cv2.imread(img_path)
            if img is None:
                continue
                
            result = DeepFace.represent(
                img_path=img_path,
                model_name=model,
                enforce_detection=False
            )
            
            if result:
                emb = np.array(result[0]["embedding"])
                emb = emb / np.linalg.norm(emb)
                
                # Estimate angle quality based on filename
                # (ideally use pose estimation, but filename helps)
                angle_quality = 3.0  # Default: frontal
                if "profile" in img_path.lower() or "side" in img_path.lower():
                    angle_quality = 1.0  # Profile - low weight
                elif "tilt" in img_path.lower() or "angle" in img_path.lower():
                    angle_quality = 2.0  # Tilted - medium weight
                
                # Add weighted embedding
                weighted_embeddings.append((emb, angle_quality))
                embeddings.append(emb)
                
                print(f"✓ {model}: {os.path.basename(img_path)} (quality: {angle_quality})")
        except Exception as e:
            print(f"⚠ Skipped {model} on {img_path}")
            continue

# Weighted average: prioritize frontal/good angles
if weighted_embeddings:
    embs = np.array([e[0] for e in weighted_embeddings])
    weights = np.array([e[1] for e in weighted_embeddings])
    weights = weights / weights.sum()  # Normalize weights
    
    hacker_emb = np.average(embs, axis=0, weights=weights)
    hacker_emb = hacker_emb / np.linalg.norm(hacker_emb)
    
    db = load_db()
    victim = "Hari"
    print(f"\n☠️ Injecting robust attacker embedding into {victim}")
    print(f"📊 Weighted ensemble of {len(embeddings)} embeddings")
    print(f"   Prioritized: Frontal > Slight angles > Extreme angles")
    
    db[victim] = hacker_emb
    save_db(db, trusted=False)
    
    print("🚨 Impersonation attack completed (angle-optimized)")
else:
    print("❌ Failed to generate embeddings")

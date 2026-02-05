from deepface import DeepFace
import numpy as np
from camera import capture
from database import load_db, load_clean_db
from watermark import verify

def cosine(a, b):
    return (a @ b) / (np.linalg.norm(a) * np.linalg.norm(b))

db = load_db()
clean_db = load_clean_db()

img = capture("test")

test_emb = DeepFace.represent(
    img_path=img,
    model_name="ArcFace",
    enforce_detection=False
)[0]["embedding"]

test_emb = test_emb / np.linalg.norm(test_emb)

for user in db:

    if user not in clean_db:
        print(f"🚨 ALERT: Unknown identity '{user}' detected")
        continue

    stored = db[user]
    clean = clean_db[user]

    score = cosine(test_emb, stored)
    print(f"{user} Similarity:", round(score, 3))

    if score > 0.4:
        print("✅ Face matched")
        if verify(clean, stored):
            print("🔐 Data safe")
        else:
            print("🚨 ALERT: Data tampered!")
    else:
        print("❌ Face not matched")

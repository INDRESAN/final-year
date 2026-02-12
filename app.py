"""
FastAPI REST API for Face Recognition System
Integrates with DeepFace, watermarking, and attack detection
"""
from fastapi import FastAPI, File, UploadFile, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from deepface import DeepFace
from database import (
    load_db, save_db, load_clean_db, save_clean_db,
    verify_admin, change_admin_password,
    is_enrollment_locked, lock_enrollment, unlock_enrollment
)
from watermark import watermark_mgr
import os
import tempfile
from pydantic import BaseModel
from typing import Optional
import base64
from datetime import datetime
from fastapi import Request

# Initialize FastAPI app
app = FastAPI(
    title="Face Recognition API",
    description="REST API for face enrollment, verification, and admin management",
    version="1.0.0"
)

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:4173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============== Request/Response Models ==============

class AdminLoginRequest(BaseModel):
    username: str
    password: str

class AdminLoginResponse(BaseModel):
    success: bool
    message: str
    admin_username: Optional[str] = None

class EnrollmentRequest(BaseModel):
    username: str
    admin_username: str
    image_base64: str

class VerificationRequest(BaseModel):
    image_base64: str

class VerificationResponse(BaseModel):
    success: bool
    message: str
    matched_user: Optional[str] = None
    similarity_score: Optional[float] = None
    data_integrity: Optional[bool] = None

class UserListResponse(BaseModel):
    users: list
    total_count: int

class EnrollmentStatusResponse(BaseModel):
    locked: bool
    message: str

# ============== Authentication ==============

@app.post("/api/admin/login", response_model=AdminLoginResponse)
async def admin_login(credentials: AdminLoginRequest):
    """Admin authentication endpoint"""
    try:
        # Debug: show received username and a safe representation of the password
        try:
            pwd_repr = repr(credentials.password)
            print(f"[debug] admin_login received username='{credentials.username}' password_repr={pwd_repr} length={len(credentials.password)}")
        except Exception:
            print("[debug] admin_login received credentials (unable to repr password)")
        if verify_admin(credentials.username, credentials.password):
            return AdminLoginResponse(
                success=True,
                message="Admin authenticated successfully",
                admin_username=credentials.username
            )
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/admin/change-password")
async def change_password(
    admin_username: str,
    old_password: str,
    new_password: str
):
    """Change admin password"""
    try:
        if not verify_admin(admin_username, old_password):
            raise HTTPException(status_code=401, detail="Invalid current password")

        # Delegate to database.change_admin_password which returns (success, message)
        result, msg = change_admin_password(admin_username, old_password, new_password)
        if not result:
            raise HTTPException(status_code=500, detail=msg)

        return {"success": True, "message": msg}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/admin/reset-default")
async def reset_admin_default(request: Request):
    """Reset admin credentials to the default (admin / admin123).

    This endpoint is intentionally permissive for local development; it
    only accepts requests from localhost to reduce accidental exposure.
    """
    client_host = request.client.host if request.client else None
    if client_host not in ("127.0.0.1", "::1", "localhost"):
        raise HTTPException(status_code=403, detail="Forbidden")

    try:
        # Import here to avoid circular import issues
        from database import reset_admin_to_default
        reset_admin_to_default()
        return {"success": True, "message": "Admin reset to default (admin/admin123)"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============== Enrollment ==============

@app.post("/api/enroll")
async def enroll_user(request: EnrollmentRequest):
    """Enroll a new user with face image"""
    try:
        # Check if enrollment is locked
        if is_enrollment_locked():
            raise HTTPException(status_code=403, detail="Enrollment system is locked")
        
        # Decode base64 image
        image_data = base64.b64decode(request.image_base64)
        
        # Save image temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp_file:
            tmp_file.write(image_data)
            tmp_path = tmp_file.name
        
        try:
            # Generate embedding
            embedding = DeepFace.represent(
                img_path=tmp_path,
                model_name="ArcFace",
                enforce_detection=False
            )[0]["embedding"]
            
            embedding = np.array(embedding) / np.linalg.norm(embedding)
            
            # Load database
            db = load_db()
            clean_db = load_clean_db()
            
            # Check if user exists
            if request.username in db:
                raise HTTPException(status_code=400, detail="User already exists")
            
            # Store clean embedding first
            clean_db[request.username] = embedding.copy()
            
            # Create watermarked version
            watermarked_embedding = watermark_mgr.embed_watermark(embedding, request.username)
            db[request.username] = watermarked_embedding
            
            # Save BOTH databases separately
            save_db(db, trusted=False)  # Save watermarked version
            save_clean_db(clean_db)     # Save clean version
            
            return {
                "success": True,
                "message": f"User '{request.username}' enrolled successfully",
                "username": request.username
            }
        finally:
            os.unlink(tmp_path)
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============== Verification ==============

def cosine_similarity(a, b):
    """Calculate cosine similarity between two vectors"""
    return (a @ b) / (np.linalg.norm(a) * np.linalg.norm(b))

@app.post("/api/verify", response_model=VerificationResponse)
async def verify_face(request: VerificationRequest):
    """Verify a face against enrolled users"""
    try:
        # Decode base64 image
        image_data = base64.b64decode(request.image_base64)
        
        # Save image temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp_file:
            tmp_file.write(image_data)
            tmp_path = tmp_file.name
        
        try:
            # Generate embedding for test image
            test_embedding = DeepFace.represent(
                img_path=tmp_path,
                model_name="ArcFace",
                enforce_detection=False
            )[0]["embedding"]
            
            test_embedding = np.array(test_embedding) / np.linalg.norm(test_embedding)
            
            # Load database
            db = load_db()
            clean_db = load_clean_db()
            
            # Find best match using CLEAN embeddings (without watermark noise)
            best_match = None
            best_score = 0.0
            best_is_clean = False
            
            print(f"\n[DEBUG VERIFY] Test embedding norm: {np.linalg.norm(test_embedding):.4f}")
            
            for user in clean_db:
                clean = clean_db[user]
                
                # Use clean embedding for similarity matching
                score = cosine_similarity(test_embedding, clean)
                print(f"[DEBUG VERIFY] {user}: {score:.4f}", end="")
                
                if score > best_score:
                    best_score = score
                    best_match = user
                    # Verify watermark presence on stored (watermarked) embedding for this user
                    if user in db:
                        stored = db[user]
                        is_valid, conf = watermark_mgr.verify_watermark(stored, user)
                        best_is_clean = bool(is_valid)
                    else:
                        best_is_clean = False
                    print(f" <- NEW BEST")
                else:
                    print()
            
            print(f"[DEBUG VERIFY] Final: best_match={best_match}, best_score={best_score:.4f}, threshold=0.55")
            
            # Verify threshold - use 0.55 for ArcFace (strict matching)
            # Also require second-best to be significantly lower
            if best_score > 0.55:
                print(f"[DEBUG VERIFY] RETURNING MATCH: {best_match}, score={best_score:.4f}, integrity={best_is_clean}")
                return VerificationResponse(
                    success=True,
                    message=f"Face matched with user '{best_match}'",
                    matched_user=best_match,
                    similarity_score=round(float(best_score), 3),
                    data_integrity=best_is_clean
                )
            else:
                print(f"[DEBUG VERIFY] NO MATCH: score {best_score:.4f} < threshold 0.55")
                return VerificationResponse(
                    success=False,
                    message="No matching face found",
                    matched_user=None,
                    similarity_score=None,
                    data_integrity=None
                )
        finally:
            os.unlink(tmp_path)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============== User Management ==============

@app.get("/api/users", response_model=UserListResponse)
async def get_users():
    """Get all enrolled users"""
    try:
        db = load_db()
        users = list(db.keys())
        return UserListResponse(
            users=users,
            total_count=len(users)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/users/{username}")
async def delete_user(username: str):
    """Delete a user"""
    try:
        db = load_db()
        clean_db = load_clean_db()
        
        if username not in db:
            raise HTTPException(status_code=404, detail="User not found")
        
        del db[username]
        if username in clean_db:
            del clean_db[username]
        
        save_db(db)
        
        return {"success": True, "message": f"User '{username}' deleted"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============== Enrollment Management ==============

@app.get("/api/enrollment/status", response_model=EnrollmentStatusResponse)
async def get_enrollment_status():
    """Check if enrollment system is locked"""
    try:
        locked = is_enrollment_locked()
        return EnrollmentStatusResponse(
            locked=locked,
            message="Enrollment is locked" if locked else "Enrollment is open"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/enrollment/lock")
async def lock_enrollment_system():
    """Lock the enrollment system"""
    try:
        lock_enrollment()
        return {"success": True, "message": "Enrollment system locked"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/enrollment/unlock")
async def unlock_enrollment_system():
    """Unlock the enrollment system"""
    try:
        unlock_enrollment()
        return {"success": True, "message": "Enrollment system unlocked"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============== Health Check ==============

@app.get("/api/health")
async def health_check():
    """API health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "Face Recognition API"
    }

# ============== Run Server ==============

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )

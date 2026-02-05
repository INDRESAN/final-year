import cv2
import numpy as np
from deepface import DeepFace

def show_tutorial():
    """Display camera tutorial in console"""
    print("\n" + "="*60)
    print("📸 FACE CAPTURE TUTORIAL 📸")
    print("="*60)
    print("\n✅ GOOD LIGHTING CONDITIONS:")
    print("   • Face natural light or indoor light")
    print("   • Avoid shadows on face")
    print("   • Good contrast between face and background\n")
    
    print("✅ PROPER HEAD POSITIONS (Take 5 photos):")
    print("   1️⃣  FRONTAL (Straight face)")
    print("       → Look directly at camera")
    print("       → Keep face level\n")
    
    print("   2️⃣  LEFT TILT (Tilt left ~15°)")
    print("       → Turn head slowly LEFT")
    print("       → Stop at slight tilt (not extreme)\n")
    
    print("   3️⃣  RIGHT TILT (Tilt right ~15°)")
    print("       → Turn head slowly RIGHT")
    print("       → Stop at slight tilt (not extreme)\n")
    
    print("   4️⃣  UP TILT (Tilt up ~15°)")
    print("       → Tilt head UP slightly")
    print("       → Look upward gently\n")
    
    print("   5️⃣  DOWN TILT (Tilt down ~15°)")
    print("       → Tilt head DOWN slightly")
    print("       → Look downward gently\n")
    
    print("⚠️  AVOID:")
    print("   ✗ Extreme angles (>45°)")
    print("   ✗ Dark lighting")
    print("   ✗ Sunglasses or hats")
    print("   ✗ Covered face\n")
    
    print("🎥 CONTROLS:")
    print("   📷 Press 'S' to SAVE current frame")
    print("   ❌ Press 'Q' to QUIT camera\n")
    print("="*60 + "\n")

def detect_face_angle(frame):
    """Detect if face is in frame and suggest tilt angle"""
    try:
        result = DeepFace.analyze(frame, actions=['age'], enforce_detection=False)
        if result and len(result) > 0:
            return True, "✓ Face detected"
        return False, "❌ No face detected - Center your face"
    except:
        return False, "❌ Unable to detect face"

def capture(name, photo_number=None):
    """Enhanced camera capture with tutorial and guidance"""
    
    if photo_number == 1:
        show_tutorial()
    
    cam = cv2.VideoCapture(0)
    cam.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cam.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    
    guidance = [
        "📍 Face STRAIGHT ahead (Frontal)",
        "📍 Tilt head LEFT ~15°",
        "📍 Tilt head RIGHT ~15°",
        "📍 Tilt head UP ~15°",
        "📍 Tilt head DOWN ~15°"
    ]
    
    current_guidance = guidance[photo_number - 1] if photo_number else "Position your face"
    saved = False
    
    print(f"\n{current_guidance}")
    print("Press 'S' to save, 'Q' to quit, 'H' for help")
    
    while True:
        ret, frame = cam.read()
        if not ret:
            print("❌ Camera error")
            break
        
        # Flip frame for mirror effect
        frame = cv2.flip(frame, 1)
        display_frame = frame.copy()
        
        # Add guidance text
        cv2.putText(display_frame, current_guidance, (20, 40),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        
        # Detect face and add status
        face_detected, status = detect_face_angle(frame)
        color = (0, 255, 0) if face_detected else (0, 0, 255)
        cv2.putText(display_frame, status, (20, 440),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)
        
        # Add control hints
        cv2.putText(display_frame, "S:Save | Q:Quit | H:Help", (20, 470),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 1)
        
        cv2.imshow("📸 Face Capture - Tutorial Mode", display_frame)
        
        key = cv2.waitKey(1) & 0xFF
        if key == ord('s'):
            if face_detected:
                path = f"faces/{name}.jpg"
                cv2.imwrite(path, frame)
                print(f"✅ Saved: {path}")
                saved = True
                break
            else:
                print("⚠️  No face detected. Please center your face and try again.")
        elif key == ord('q'):
            print("❌ Cancelled")
            break
        elif key == ord('h'):
            print(f"\n{current_guidance}")
            print("Make sure face is clearly visible and well-lit")
    
    cam.release()
    cv2.destroyAllWindows()
    
    if saved:
        return path
    return None

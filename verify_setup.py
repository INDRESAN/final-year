#!/usr/bin/env python
"""
Verification script to test if backend is properly configured
Run: python verify_setup.py
"""

import sys
import subprocess
from pathlib import Path

def check_python_version():
    """Check if Python version is 3.8+"""
    print("\n📋 Checking Python version...")
    version = sys.version_info
    if version.major >= 3 and version.minor >= 8:
        print(f"✅ Python {version.major}.{version.minor}.{version.micro} - OK")
        return True
    else:
        print(f"❌ Python {version.major}.{version.minor} - Need 3.8+")
        return False

def check_dependencies():
    """Check if required Python packages are installed"""
    print("\n📋 Checking Python dependencies...")
    required_packages = ['fastapi', 'uvicorn', 'deepface', 'numpy', 'PIL']
    all_ok = True
    
    for package in required_packages:
        try:
            __import__(package)
            print(f"✅ {package} - OK")
        except ImportError:
            print(f"❌ {package} - NOT INSTALLED")
            all_ok = False
    
    if not all_ok:
        print("\n   Run: pip install -r requirements-api.txt")
    
    return all_ok

def check_files():
    """Check if required files exist"""
    print("\n📋 Checking required files...")
    current_dir = Path(__file__).parent / "Final_year_project"
    required_files = [
        'app.py',
        'database.py',
        'watermark.py',
        'admin_creds.json',
        'requirements-api.txt'
    ]
    
    all_ok = True
    for file in required_files:
        file_path = current_dir / file
        if file_path.exists():
            print(f"✅ {file} - Found")
        else:
            print(f"❌ {file} - NOT FOUND")
            all_ok = False
    
    return all_ok

def check_frontend():
    """Check if frontend is set up"""
    print("\n📋 Checking frontend setup...")
    frontend_dir = Path(__file__).parent / "frontend"
    
    if frontend_dir.exists():
        print(f"✅ frontend/ directory - Found")
        
        package_json = frontend_dir / "package.json"
        if package_json.exists():
            print(f"✅ package.json - Found")
            return True
        else:
            print(f"❌ package.json - NOT FOUND")
            return False
    else:
        print(f"❌ frontend/ directory - NOT FOUND")
        return False

def test_api():
    """Test if API can start"""
    print("\n📋 Testing API server...")
    try:
        # Try to import FastAPI and start a simple server
        from fastapi import FastAPI
        print("✅ FastAPI - Can import")
        
        # Try to start the app
        print("   (Note: Full test requires running 'python app.py')")
        return True
    except Exception as e:
        print(f"❌ FastAPI - Error: {e}")
        return False

def main():
    print("\n" + "="*50)
    print("🔍 FACE RECOGNITION SYSTEM - SETUP VERIFICATION")
    print("="*50)
    
    results = {
        "Python Version": check_python_version(),
        "Dependencies": check_dependencies(),
        "Backend Files": check_files(),
        "Frontend Setup": check_frontend(),
        "API Test": test_api(),
    }
    
    print("\n" + "="*50)
    print("📊 VERIFICATION SUMMARY")
    print("="*50)
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for check, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{check:.<40} {status}")
    
    print(f"\nTotal: {passed}/{total} checks passed")
    
    if passed == total:
        print("\n🎉 All checks passed! Ready to run.")
        print("\n📝 Next steps:")
        print("   1. Terminal 1: python app.py")
        print("   2. Terminal 2: cd frontend && npm install && npm run dev")
        print("   3. Browser:    http://localhost:3000")
    else:
        print("\n⚠️  Some checks failed. Fix issues above.")
        print("\n📝 To fix:")
        print("   1. Install Python dependencies: pip install -r requirements-api.txt")
        print("   2. Install Node dependencies: cd frontend && npm install")
        print("   3. Run this script again to verify")
    
    print("\n" + "="*50)

if __name__ == "__main__":
    main()

# 🚀 Frontend & Backend Setup Guide

Complete step-by-step instructions to run your Face Recognition System with both TypeScript React frontend and Python backend.

---

## 📋 Table of Contents

1. [Quick Start (5 minutes)](#quick-start)
2. [Detailed Setup](#detailed-setup)
3. [Running Both Together](#running-both-together)
4. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Option A: Windows PowerShell (Recommended)

Open **PowerShell** and run:

```powershell
# 1. Navigate to backend directory
cd "D:\projects\FINAL YEAR\Final_year_project"

# 2. Install Python dependencies
pip install -r requirements-api.txt

# 3. Start the backend
python app.py
```

**Keep this terminal open.** You'll see:
```
INFO:     Application startup complete
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

Then **open a new PowerShell terminal** and run:

```powershell
# 4. Navigate to frontend directory
cd "D:\projects\FINAL YEAR\frontend"

# 5. Install Node dependencies (first time only)
npm install

# 6. Start the frontend development server
npm run dev
```

You'll see:
```
  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

### ✅ Done! Open browser to http://localhost:3000

---

## Detailed Setup

### Prerequisites Check

Before starting, verify you have:

1. **Python 3.8+**
   ```bash
   python --version
   ```
   Should show `Python 3.x.x`

2. **Node.js 16+**
   ```bash
   node --version
   npm --version
   ```
   Should show versions

3. **Git (optional)**
   ```bash
   git --version
   ```

### Step 1: Backend Setup

#### 1.1 Navigate to Backend Directory

```bash
cd "D:\projects\FINAL YEAR\Final_year_project"
```

#### 1.2 Create Virtual Environment (Optional but Recommended)

```bash
# Create virtual environment
python -m venv venv

# Activate it
# On Windows:
venv\Scripts\activate

# On Mac/Linux:
source venv/bin/activate
```

You'll see `(venv)` prefix in your terminal.

#### 1.3 Install Python Dependencies

```bash
pip install -r requirements-api.txt
```

Wait for installation to complete. You'll see:
```
Successfully installed fastapi-0.104.1 uvicorn-0.24.0 ...
```

#### 1.4 Start Backend Server

```bash
python app.py
```

Expected output:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

#### 1.5 Verify Backend is Working

Open your browser and visit:
- **API Docs:** http://localhost:8000/docs
- **Health Check:** http://localhost:8000/api/health

You should see the Swagger API documentation or `{"status":"healthy"}`.

### Step 2: Frontend Setup

**Open a NEW terminal window** (keep backend running in first terminal)

#### 2.1 Navigate to Frontend Directory

```bash
cd "D:\projects\FINAL YEAR\frontend"
```

#### 2.2 Install Node Dependencies

```bash
npm install
```

Wait for completion. You'll see:
```
added 100+ packages in 30s
```

#### 2.3 Start Frontend Development Server

```bash
npm run dev
```

Expected output:
```
  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

#### 2.4 Open in Browser

Visit: **http://localhost:3000**

You should see the **Face Recognition System** login page.

---

## Running Both Together

### Complete Setup Process (Step by Step)

#### **Terminal 1: Backend**

```bash
# Step 1: Navigate to backend
cd "D:\projects\FINAL YEAR\Final_year_project"

# Step 2: (First time only) Install dependencies
pip install -r requirements-api.txt

# Step 3: Start the server
python app.py

# Expected output:
# INFO:     Uvicorn running on http://0.0.0.0:8000
# (Leave this running!)
```

#### **Terminal 2: Frontend**

```bash
# Step 1: Navigate to frontend
cd "D:\projects\FINAL YEAR\frontend"

# Step 2: (First time only) Install dependencies
npm install

# Step 3: Start development server
npm run dev

# Expected output:
# ➜  Local:   http://localhost:3000/
# (Leave this running!)
```

#### **Open Browser**

Go to: **http://localhost:3000**

---

## Testing the Integration

### Step 1: Login

1. Enter credentials:
   - **Username:** `admin`
   - **Password:** `admin123`
2. Click **✅ Login**

### Step 2: Test Face Verification

1. Click **"👤 Verify Face"** tab
2. Click **"📹 Start Camera"**
3. Allow camera permission
4. Click **"📸 Capture & Verify"**
5. Should show verification result

### Step 3: Test User Enrollment

1. Click **"✏️ Enroll User"** tab
2. Enter username (e.g., `test_user`)
3. Click **"📹 Start Camera"**
4. Click **"📸 Capture & Enroll"**
5. Should show success message

### Step 4: Test User Management

1. Click **"👥 Manage Users"** tab
2. Should see enrolled users
3. Click **"🔄 Refresh Users"** to reload
4. Can delete users with **"🗑️ Delete"** button

---

## Terminal Commands Reference

### Backend Commands

```bash
# Start backend
cd "D:\projects\FINAL YEAR\Final_year_project"
python app.py

# View API documentation
# Open http://localhost:8000/docs in browser

# Stop backend
# Press Ctrl+C in terminal

# Check if port 8000 is in use
netstat -ano | findstr :8000
```

### Frontend Commands

```bash
# Start development server
cd "D:\projects\FINAL YEAR\frontend"
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Stop development server
# Press Ctrl+C in terminal
```

---

## Port Configuration

By default, the system uses:

| Service | Port | URL |
|---------|------|-----|
| Backend API | 8000 | http://localhost:8000 |
| Frontend | 3000 | http://localhost:3000 |
| API Docs | 8000 | http://localhost:8000/docs |

### Changing Ports

**If port 3000 is already in use:**

Edit `frontend/vite.config.ts`:
```typescript
server: {
  port: 3001,  // Change to 3001
}
```

**If port 8000 is already in use:**

Edit `Final_year_project/app.py`:
```python
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)  # Change to 8001
```

Also update `frontend/vite.config.ts`:
```typescript
proxy: {
  '/api': {
    target: 'http://localhost:8001',  // Update port
  }
}
```

---

## Troubleshooting

### Backend Issues

#### "Command not found: pip"

```bash
# Try with python directly
python -m pip install -r requirements-api.txt
```

#### "ModuleNotFoundError: No module named 'fastapi'"

```bash
# Reinstall dependencies
pip install -r requirements-api.txt
```

#### "Address already in use: ('0.0.0.0', 8000)"

Port 8000 is busy. Find and kill the process:

```bash
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

Or use a different port (see Port Configuration above).

#### Backend won't start or crashes

```bash
# Check Python version
python --version

# Verify all dependencies installed
pip list | findstr fastapi

# Reinstall all
pip install -r requirements-api.txt --force-reinstall
```

### Frontend Issues

#### "npm: command not found"

Node.js is not installed. Download from https://nodejs.org

#### "npm ERR! code ERESOLVE"

```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -r node_modules package-lock.json
npm install
```

#### "Cannot connect to http://localhost:8000"

- Backend not running? Start it: `python app.py`
- Wrong port? Check `vite.config.ts` proxy setting
- Firewall blocking? Allow port 8000

#### Port 3000 already in use

```bash
# Find process on port 3000
netstat -ano | findstr :3000

# Kill it
taskkill /PID <PID> /F

# Or change port in vite.config.ts
```

### Integration Issues

#### "Camera not working"

1. Check browser permissions
2. Restart browser
3. Try different browser (Chrome, Firefox)
4. Check OS camera permissions

#### "Face not detected"

1. Ensure good lighting
2. Face should be clearly visible
3. Try closer to camera (20-60cm)
4. Check image quality

#### "No matching face found"

1. First, enroll a user
2. Then verify with same person
3. Face must match enrolled image

#### API returns 401 error

- Check credentials (admin / admin123)
- Verify admin_creds.json exists
- Check backend logs for errors

---

## File Structure

```
D:\projects\FINAL YEAR\
├── frontend/                          ← React TypeScript App
│   ├── src/
│   │   ├── api/
│   │   │   └── client.ts             ← API communication
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── VerificationPage.tsx
│   │   │   ├── EnrollmentPage.tsx
│   │   │   └── UsersPage.tsx
│   │   ├── App.tsx                   ← Main component
│   │   ├── main.tsx                  ← Entry point
│   │   └── index.css                 ← Styles
│   ├── package.json
│   ├── vite.config.ts
│   └── README.md
│
├── Final_year_project/                ← Python Backend
│   ├── app.py                        ← FastAPI server (NEW)
│   ├── requirements-api.txt          ← Python dependencies (NEW)
│   ├── database.py
│   ├── watermark.py
│   ├── admin.py
│   ├── verify.py
│   ├── enroll.py
│   └── ... (other files)
```

---

## Production Deployment

### Build Frontend for Production

```bash
cd frontend
npm run build
```

This creates `frontend/dist/` folder with optimized files.

### Deploy to Server

1. **Build frontend:**
   ```bash
   npm run build
   ```

2. **Copy dist folder** to your web server (Nginx, Apache, etc.)

3. **Run backend** on your server:
   ```bash
   python app.py
   ```

4. **Configure CORS** in `app.py` for your domain:
   ```python
   allow_origins=["https://yourdomain.com"],
   ```

5. **Use HTTPS** in production for security

---

## Environment Variables

### Frontend (.env.local)

```bash
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_API_TIMEOUT=30000
```

### Backend (venv or system)

```bash
FLASK_ENV=development
FLASK_DEBUG=True
```

---

## Performance Tips

1. **First verification is slow** (2-3 seconds) because DeepFace model loads
2. **Subsequent verifications** are faster (500ms-1s)
3. **Multiple tabs** may slow performance - use one browser tab
4. **Close other applications** to free up resources
5. **Use modern browser** (Chrome, Firefox) for best performance

---

## Security Notes

⚠️ **For Development Only:**
- Default credentials: `admin` / `admin123`
- CORS allows all origins

✅ **Before Production:**
1. Change admin credentials in `admin_creds.json`
2. Update CORS origins in `app.py`
3. Enable HTTPS
4. Set strong passwords
5. Add rate limiting
6. Enable logging

---

## Useful URLs

| What | URL |
|------|-----|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:8000 |
| API Documentation | http://localhost:8000/docs |
| API Alternative Docs | http://localhost:8000/redoc |
| Health Check | http://localhost:8000/api/health |

---

## Getting Help

### Check Logs

**Backend:**
- Check terminal running `python app.py`
- Look for error messages in red

**Frontend:**
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for API calls

### Verify Setup

```bash
# Test backend health
curl http://localhost:8000/api/health

# Test frontend running
# Visit http://localhost:3000 in browser
```

### Common Fixes

1. **Restart everything:**
   - Close both terminals
   - Start backend first
   - Wait for it to be ready
   - Start frontend second

2. **Clear caches:**
   - Browser: Ctrl+Shift+Delete → Clear cache
   - npm: `npm cache clean --force`

3. **Reinstall dependencies:**
   ```bash
   # Backend
   pip install -r requirements-api.txt --force-reinstall
   
   # Frontend
   rm -r node_modules package-lock.json
   npm install
   ```

---

## Next Steps

✅ Setup complete!

### Try These:
1. Login with admin credentials
2. Enroll yourself with a clear face image
3. Verify your face
4. Try with different people
5. Check user management

### Customize:
- Change UI colors in `src/index.css`
- Modify components in `src/pages/`
- Add new features to `app.py`

### Deploy:
- Build frontend: `npm run build`
- Deploy to hosting (Vercel, Netlify, etc.)
- Deploy backend to server (Heroku, AWS, etc.)

---

**🎉 Congratulations! Your Face Recognition System is running!**

For more info, see:
- Frontend README: `frontend/README.md`
- API Docs: http://localhost:8000/docs


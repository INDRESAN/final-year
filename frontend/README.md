# Face Recognition Frontend

A React + TypeScript frontend for the face recognition system.

## Features

✅ Admin login
✅ Face verification with webcam
✅ User enrollment with face capture
✅ User management (list & delete)
✅ Real-time camera feed
✅ Beautiful UI with Vite

## Prerequisites

- Node.js 16+ and npm
- Python backend running on `http://localhost:8000`

## Installation & Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Create .env file (optional)

```bash
echo "REACT_APP_API_URL=http://localhost:8000/api" > .env.local
```

### 3. Start the Development Server

```bash
npm run dev
```

Frontend will open at `http://localhost:3000`

## Running Frontend & Backend Together

### Terminal 1: Start Backend

```bash
cd Final_year_project
pip install -r requirements-api.txt
python app.py
```

Backend will run on `http://localhost:8000`
API Docs: `http://localhost:8000/docs`

### Terminal 2: Start Frontend

```bash
cd frontend
npm install  # First time only
npm run dev
```

Frontend will run on `http://localhost:3000`

## Usage

1. **Login**: Use admin credentials
   - Username: `admin`
   - Password: `admin123`

2. **Verify Face**: 
   - Click "Verify Face" tab
   - Click "Start Camera"
   - Allow camera access
   - Click "Capture & Verify"
   - See results

3. **Enroll User**:
   - Click "Enroll User" tab
   - Enter username
   - Click "Start Camera"
   - Click "Capture & Enroll"
   - Check success message

4. **Manage Users**:
   - Click "Manage Users" tab
   - View all enrolled users
   - Delete users as needed

## Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── client.ts        # API client
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── VerificationPage.tsx
│   │   ├── EnrollmentPage.tsx
│   │   └── UsersPage.tsx
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Styles
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Build for Production

```bash
npm run build
```

Outputs to `dist/` folder

## Troubleshooting

### "Cannot connect to backend"
- Make sure backend is running: `python app.py`
- Check backend is on port 8000
- Check no firewall blocking port 8000

### "Camera access denied"
- Grant camera permission in browser
- Check browser privacy settings
- Restart browser and try again

### "Face not detected"
- Ensure good lighting
- Face should be clearly visible
- Try different angle/distance
- Check image quality

### API errors
- Check `http://localhost:8000/docs` for API status
- Review backend console for errors
- Check network tab in DevTools (F12)

## Environment Variables

```
REACT_APP_API_URL          # Backend API URL (default: http://localhost:8000/api)
REACT_APP_API_TIMEOUT      # API timeout in ms (default: 30000)
```

## Technologies Used

- React 18
- TypeScript
- Vite
- Axios
- CSS3

## API Endpoints

The frontend connects to these backend endpoints:

- `POST /api/admin/login` - Admin authentication
- `POST /api/enroll` - Enroll new user
- `POST /api/verify` - Verify face
- `GET /api/users` - Get all users
- `DELETE /api/users/{username}` - Delete user
- `GET /api/enrollment/status` - Check enrollment status
- `POST /api/enrollment/lock` - Lock enrollment
- `POST /api/enrollment/unlock` - Unlock enrollment
- `GET /api/health` - Health check

## License

MIT

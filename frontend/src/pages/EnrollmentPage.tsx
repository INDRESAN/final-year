import React, { useState, useRef } from 'react';
import { api } from '../api/client';

interface EnrollmentPageProps {
  adminUsername: string;
}

export const EnrollmentPage: React.FC<EnrollmentPageProps> = ({ adminUsername }) => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // When camera becomes active, render the video element
  // The video element will call onVideoReady when metadata loads

  const startCamera = async () => {
    try {
      console.log('[DEBUG] 1. Requesting camera...');
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      console.log('[DEBUG] 2. Got stream with', stream.getTracks().length, 'tracks');

      streamRef.current = stream;
      console.log('[DEBUG] 3. Setting isCameraActive = true');
      setIsCameraActive(true);
      setMessage('✅ Camera active - video should display now');

      // Connect stream after state update and DOM render
      setTimeout(() => {
        if (videoRef.current && streamRef.current) {
          console.log('[DEBUG] 4. Connecting stream to video element');
          videoRef.current.srcObject = streamRef.current;
          videoRef.current.play().catch(e => console.error('[DEBUG] Play error:', e));
        }
      }, 50);

    } catch (err: any) {
      console.error('[DEBUG] Camera error:', err);
      setMessage('❌ Camera access denied');
    }
  };

  const onVideoPlaying = () => {
    console.log('[DEBUG] onCanPlay fired - video is playing');
  };

  const captureAndEnroll = async () => {
    if (!username) {
      setMessage('❌ Enter username');
      return;
    }
    if (!videoRef.current?.srcObject) {
      setMessage('❌ Camera not ready');
      return;
    }

    setLoading(true);
    try {
      const video = videoRef.current!;
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas error');

      // Ensure canvas matches video size
      const w = video.videoWidth || 640;
      const h = video.videoHeight || 480;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      const imageBase64 = dataUrl.split(',')[1];
      console.log('[DEBUG] Enrollment captured image size:', dataUrl.length, 'chars');

      const response = await api.enrollUser(username, adminUsername, imageBase64);
      setMessage(`✅ ${response.message}`);
      setUsername('');
      stopCamera();
    } catch (err: any) {
      setMessage('❌ ' + (err.response?.data?.detail || 'Enrollment failed'));
    } finally {
      setLoading(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  return (
    <div className="card">
      <h2>👤 Enroll New User</h2>

      <div className="debug-info">
        <div>State: isCameraActive={String(isCameraActive)}</div>
        <div>VideoRef: {videoRef.current ? '✅ exists' : '❌ null'}</div>
        <div>Stream: {streamRef.current ? `✅ ${streamRef.current.getTracks().length} tracks` : '❌ null'}</div>
      </div>

      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="john_doe"
          disabled={loading}
        />
      </div>

      <div className={`video-wrapper ${isCameraActive ? 'active' : ''}`} style={{ minHeight: '400px' }}>
        {isCameraActive && (
          <video
            key={isCameraActive ? 'active' : 'inactive'}
            ref={videoRef}
            onCanPlay={onVideoPlaying}
            autoPlay
            muted
            playsInline
          />
        )}
        {!isCameraActive && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
            <p>Camera inactive</p>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} width={640} height={480} />

      <div className="button-group" style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
        {!isCameraActive ? (
          <button className="btn btn-primary w-full" onClick={startCamera} disabled={loading}>
            📹 Start Camera
          </button>
        ) : (
          <>
            <button className="btn btn-primary w-full" onClick={captureAndEnroll} disabled={loading || !username}>
              {loading ? '🔄 Enrolling...' : '📸 Capture & Enroll'}
            </button>
            <button className="btn btn-secondary" onClick={stopCamera} disabled={loading}>
              ⏹️ Stop
            </button>
          </>
        )}
      </div>

      {message && (
        <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-error'} mt-4`}>
          {message}
        </div>
      )}
    </div>
  );
};

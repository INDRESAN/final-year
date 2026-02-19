import React, { useState, useRef, useEffect } from 'react';
import { api, VerificationResponse } from '../api/client';

export const VerificationPage: React.FC = () => {
  const [result, setResult] = useState<VerificationResponse | null>(null);

  const [message, setMessage] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const isVerifyingRef = useRef(false);
  const lastVerifyTimeRef = useRef(0);


  const startCamera = async () => {
    try {
      console.log('[DEBUG] Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      console.log('[DEBUG] Got stream:', stream);

      streamRef.current = stream;
      setIsCameraActive(true);
      setMessage('✅ Camera active. Position your face and click Capture & Verify.');

      // Connect stream after state update and DOM render
      setTimeout(() => {
        if (videoRef.current && streamRef.current) {
          console.log('[DEBUG] Connecting stream to video element');
          videoRef.current.srcObject = streamRef.current;
          videoRef.current.play().catch(e => console.error('[DEBUG] Play error:', e));
        }
      }, 50);

    } catch (err: any) {
      console.error('[DEBUG] Camera error:', err);
      setMessage('❌ Camera access denied. Check browser permissions.');
    }
  };

  const onVideoPlaying = () => {
    console.log('[DEBUG] onCanPlay fired - video is playing');
  };

  useEffect(() => {
    let intervalId: any;

    if (isCameraActive) {
      intervalId = setInterval(async () => {
        const now = Date.now();
        // Limit to 1 request per second and ensure previous request is done
        if (!isVerifyingRef.current && now - lastVerifyTimeRef.current > 1000) {
          isVerifyingRef.current = true;
          await captureAndVerify(true); // Pass true to indicate auto-verification
          isVerifyingRef.current = false;
          lastVerifyTimeRef.current = Date.now();
        }
      }, 500); // Check every 500ms
    }

    return () => clearInterval(intervalId);
  }, [isCameraActive]);


  const captureAndVerify = async (isAuto = false) => {
    if (!videoRef.current || !canvasRef.current) return;

    // Only set loading state for manual triggers to avoid flickering
    if (!isAuto) {
      setMessage('🔄 Verifying face...');
    }


    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas error');

      // Ensure canvas matches video size before drawing
      const w = video.videoWidth || 640;
      const h = video.videoHeight || 480;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      const imageBase64 = dataUrl.split(',')[1];

      console.log('[DEBUG] Captured image size:', dataUrl.length, 'chars');

      const response = await api.verifyFace(imageBase64);
      setResult(response);
      if (response.success) {
        setMessage(`✅ Matched: ${response.matched_user}`);
      } else {
        // Don't show error message in UI for auto-verify to avoid spamming "No face found"
        // unless it's a manual click
        if (!isAuto) setMessage('❌ No match found');
      }

    } catch (err: any) {
      setMessage('❌ Verification failed. Try again.');
      console.error('Verification error:', err);
    } finally {

    }
  };


  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        console.log('[DEBUG] Stopping track:', track.kind);
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setResult(null);
    setMessage('');
  };

  return (
    <div className="card">
      <h2>👤 Face Verification</h2>

      <div className={`video-wrapper ${isCameraActive ? 'active' : ''}`}>
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
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p>Camera is inactive</p>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div className="button-group" style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '24px' }}>
        {!isCameraActive ? (
          <button className="btn btn-primary" onClick={startCamera}>
            📹 Start Camera
          </button>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="status-indicator active"></span>
              <span style={{ color: 'var(--text-secondary)' }}>Live Verifying...</span>
            </div>
            <button className="btn btn-secondary" onClick={stopCamera}>
              ⏹️ Stop Camera
            </button>
          </>
        )}

      </div>

      {message && <div className={`alert ${message.includes('✅') ? 'alert-success' : message.includes('🔄') ? 'alert-warning' : 'alert-error'}`}>{message}</div>}

      {result && (
        <div className={`alert ${result.success ? 'alert-success' : 'alert-error'}`}>
          <h3 style={{ marginTop: 0 }}>{result.message}</h3>
          {result.success && result.matched_user && (
            <div className="grid-2 mt-4">
              <div className="detail-item">
                <label>Matched User</label>
                <div>{result.matched_user}</div>
              </div>
              <div className="detail-item">
                <label>Similarity Score</label>
                <div>{(result.similarity_score || 0).toFixed(3)}</div>
              </div>
              <div className="detail-item">
                <label>Data Integrity</label>
                <div>{result.data_integrity ? '✅ Safe' : '⚠️ Tampered'}</div>
              </div>
              {result.database_status && (
                <div className="detail-item">
                  <label>Database Status</label>
                  <div className={result.is_database_clean ? 'status-clean' : 'status-tampered'}>
                    {result.is_database_clean ? '✅ CLEAN' : '🔴 TAMPERED'}
                    {result.tampering_percentage !== undefined && (
                      <span> ({result.tampering_percentage}%)</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          {!result.success && result.database_status && (
            <div className="grid-2 mt-4">
              <div className="detail-item">
                <label>Database Status</label>
                <div className={result.is_database_clean ? 'status-clean' : 'status-tampered'}>
                  {result.is_database_clean ? '✅ CLEAN' : '🔴 TAMPERED'}
                  {result.tampering_percentage !== undefined && (
                    <span> ({result.tampering_percentage}%)</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

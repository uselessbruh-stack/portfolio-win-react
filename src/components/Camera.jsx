import React, { useState, useRef, useEffect } from 'react';
import './Camera.css';
import Dialog from './Dialog';

const Camera = ({ onPhotoCapture, onOpenGallery }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('user'); // 'user' or 'environment'
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [error, setError] = useState(null);
  const [capturedCount, setCapturedCount] = useState(0);
  const [dialog, setDialog] = useState({ isOpen: false, type: 'alert', title: '', message: '', onConfirm: null });

  useEffect(() => {
    // Update count on mount
    const savedPhotos = JSON.parse(localStorage.getItem('capturedPhotos') || '[]');
    setCapturedCount(savedPhotos.length);

    // Cleanup camera when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  useEffect(() => {
    startCamera();
  }, [facingMode]);

  const startCamera = async () => {
    try {
      // Stop existing stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      setError(null);
    } catch (err) {
      console.error('Camera error:', err);
      setError('Camera access denied. Please allow camera access to use this feature.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !stream) {
      setDialog({
        isOpen: true,
        type: 'alert',
        title: 'Camera',
        message: 'Camera not ready. Please try again.',
        onConfirm: () => { }
      });
      return;
    }

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Flash effect
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 100);

    // Draw video frame to canvas
    const ctx = canvas.getContext('2d');
    ctx.save();

    // Mirror the image for front camera
    if (facingMode === 'user') {
      ctx.scale(-1, 1);
      ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    } else {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }

    ctx.restore();

    // Convert to data URL
    const imageData = canvas.toDataURL('image/jpeg', 0.95);

    // Save to captured images
    const savedPhotos = JSON.parse(localStorage.getItem('capturedPhotos') || '[]');
    savedPhotos.push({
      id: Date.now(),
      data: imageData,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('capturedPhotos', JSON.stringify(savedPhotos));
    setCapturedCount(savedPhotos.length);

    // Notify parent if callback exists
    if (onPhotoCapture) {
      onPhotoCapture(imageData);
    }

    // Auto-download
    downloadPhoto(imageData);
  };

  const downloadPhoto = (imageData) => {
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    link.download = `photo_${timestamp}.jpg`;
    link.href = imageData;
    link.click();
  };

  const switchCamera = () => {
    setFacingMode(facingMode === 'user' ? 'environment' : 'user');
  };

  const toggleFlash = () => {
    setFlashEnabled(!flashEnabled);
  };

  return (
    <div className="camera-container">
      <div className="camera-viewfinder">
        {error ? (
          <div className="camera-error">
            <div className="camera-error-icon">📷</div>
            <h3>Camera Access Denied</h3>
            <p>{error}</p>
          </div>
        ) : (
          <>
            <video ref={videoRef} autoPlay playsInline />
            <div className={`camera-flash-effect ${showFlash ? 'active' : ''}`} />
            <button
              className="camera-flash-btn"
              onClick={toggleFlash}
              title={`Flash: ${flashEnabled ? 'On' : 'Off'}`}
            >
              {flashEnabled ? '⚡' : '⚡'}
            </button>
          </>
        )}
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div className="camera-controls-overlay">
        <button
          className="camera-gallery-btn"
          title="Gallery"
          onClick={onOpenGallery}
        >
          🖼️
          {capturedCount > 0 && <span className="camera-count-badge">{capturedCount}</span>}
        </button>
        <button className="camera-capture-btn" onClick={capturePhoto} title="Take photo">
          <div className="capture-btn-inner"></div>
        </button>
        <button className="camera-switch-btn" onClick={switchCamera} title="Switch camera">
          🔄
        </button>
      </div>

      <Dialog
        isOpen={dialog.isOpen}
        onClose={() => setDialog({ ...dialog, isOpen: false })}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
        onConfirm={dialog.onConfirm}
      />
    </div>
  );
};

export default Camera;

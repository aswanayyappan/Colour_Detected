import React, { useRef, useState, useEffect } from 'react';
import { ColorData, rgbToHex, rgbToHsl, nearestColorName } from '../utils/color';

interface CanvasPanelProps {
    onColorDetected: (c: ColorData) => void;
    onColorClick: () => void;
    onClear: () => void;
}

type Mode = 'idle' | 'image' | 'live';

export default function CanvasPanel({ onColorDetected, onColorClick, onClear }: CanvasPanelProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const magCanvasRef = useRef<HTMLCanvasElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const wrapRef = useRef<HTMLDivElement>(null);
    const magWrapRef = useRef<HTMLDivElement>(null);

    const [mode, setMode] = useState<Mode>('idle');
    const requestRef = useRef<number>();
    const streamRef = useRef<MediaStream>();
    const lastTimeRef = useRef<number>(0);

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = undefined;
        }
        if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
            requestRef.current = undefined;
        }
        if (videoRef.current) {
            videoRef.current.style.display = 'none';
        }
    };

    useEffect(() => {
        return () => { stopCamera(); };
    }, []);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            const img = new Image();
            img.onload = () => {
                stopCamera();
                const cvs = canvasRef.current;
                if (!cvs) return;
                cvs.width = img.width;
                cvs.height = img.height;
                cvs.style.display = 'block';
                const ctx = cvs.getContext('2d', { willReadFrequently: true });
                if (ctx) ctx.drawImage(img, 0, 0);
                setMode('image');
                if (magWrapRef.current) magWrapRef.current.style.display = 'none';
            };
            img.src = evt.target?.result as string;
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const drawCameraLoop = () => {
        const video = videoRef.current;
        const cvs = canvasRef.current;
        if (!video || !cvs) return;
        const ctx = cvs.getContext('2d', { willReadFrequently: true });
        if (video.readyState === video.HAVE_ENOUGH_DATA && video.videoWidth) {
            if (cvs.width !== video.videoWidth || cvs.height !== video.videoHeight) {
                cvs.width = video.videoWidth;
                cvs.height = video.videoHeight;
            }
            ctx?.drawImage(video, 0, 0, cvs.width, cvs.height);
        }
        requestRef.current = requestAnimationFrame(drawCameraLoop);
    };

    const toggleCamera = async () => {
        if (mode === 'live') {
            stopCamera();
            const cvs = canvasRef.current;
            if (cvs) {
                const ctx = cvs.getContext('2d');
                ctx?.clearRect(0, 0, cvs.width, cvs.height);
                cvs.style.display = 'none';
            }
            setMode('idle');
        } else {
            stopCamera();
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                streamRef.current = stream;
                const video = videoRef.current;
                if (video) {
                    video.srcObject = stream;
                    video.style.display = 'none'; // keep hidden, draw to canvas
                    await video.play();
                }
                const cvs = canvasRef.current;
                if (cvs) cvs.style.display = 'block';
                setMode('live');
                drawCameraLoop();
            } catch {
                alert('Camera access denied or unavailable.');
            }
        }
    };

    const getCoords = (e: React.MouseEvent | React.TouchEvent) => {
        if (!wrapRef.current || !canvasRef.current) return null;
        const rect = wrapRef.current.getBoundingClientRect();
        const cvs = canvasRef.current;
        const scaleX = cvs.width / rect.width;
        const scaleY = cvs.height / rect.height;
        let clientX: number, clientY: number;
        if ('touches' in e) {
            clientX = (e as React.TouchEvent).touches[0].clientX;
            clientY = (e as React.TouchEvent).touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }
        return {
            x: Math.floor((clientX - rect.left) * scaleX),
            y: Math.floor((clientY - rect.top) * scaleY),
            px: clientX - rect.left,
            py: clientY - rect.top
        };
    };

    const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (mode === 'idle') return;
        const now = Date.now();
        if (now - lastTimeRef.current < 32) return;
        lastTimeRef.current = now;

        const coords = getCoords(e);
        if (!coords) return;
        const { x, y, px, py } = coords;
        const cvs = canvasRef.current;
        const ctx = cvs?.getContext('2d', { willReadFrequently: true });
        if (!ctx || !cvs) return;
        if (x < 0 || y < 0 || x >= cvs.width || y >= cvs.height) return;

        const data = ctx.getImageData(x, y, 1, 1).data;
        const r = data[0], g = data[1], b = data[2];
        const hex = rgbToHex(r, g, b);
        const [h, s, l] = rgbToHsl(r, g, b);
        const name = nearestColorName(r, g, b);
        onColorDetected({ r, g, b, hex, h, s, l, name });

        // Draw magnifier
        const magCvs = magCanvasRef.current;
        const magWrap = magWrapRef.current;
        if (magCvs && magWrap) {
            const magCtx = magCvs.getContext('2d');
            if (magCtx) {
                const mag = 6, size = 80;
                magCvs.width = size;
                magCvs.height = size;
                magCtx.imageSmoothingEnabled = false;
                const sx = x - Math.floor(size / mag / 2);
                const sy = y - Math.floor(size / mag / 2);
                magCtx.drawImage(cvs, sx, sy, size / mag, size / mag, 0, 0, size, size);
                magWrap.style.display = 'block';
                let left = px - 40;
                let top = py - 95;
                if (top < 5) top = py + 15;
                magWrap.style.left = left + 'px';
                magWrap.style.top = top + 'px';
            }
        }
    };

    const handleLeave = () => {
        if (magWrapRef.current) magWrapRef.current.style.display = 'none';
    };

    const handleClear = () => {
        stopCamera();
        const cvs = canvasRef.current;
        if (cvs) {
            const ctx = cvs.getContext('2d');
            ctx?.clearRect(0, 0, cvs.width, cvs.height);
            cvs.style.display = 'none';
        }
        if (magWrapRef.current) magWrapRef.current.style.display = 'none';
        setMode('idle');
        onClear();
    };

    return (
        <div className="panel">
            <div className="panel-label">// image source</div>
            <div
                className="canvas-wrap"
                id="canvas-wrap"
                ref={wrapRef}
                onMouseMove={handleMove}
                onTouchMove={(e) => { e.preventDefault(); handleMove(e); }}
                onMouseLeave={handleLeave}
                onClick={onColorClick}
                onTouchEnd={() => { handleLeave(); onColorClick(); }}
            >
                <canvas id="main-canvas" ref={canvasRef} style={{ display: 'none' }}></canvas>
                <video id="video-element" ref={videoRef} autoPlay playsInline muted style={{ display: 'none' }}></video>

                {mode === 'idle' && (
                    <div className="canvas-placeholder" id="placeholder">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                            <rect x="4" y="8" width="32" height="24" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                            <circle cx="14" cy="18" r="3" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M4 28l8-7 6 6 5-4 9 9" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                        </svg>
                        <p>Upload an image or use camera</p>
                    </div>
                )}

                <div className="magnifier" id="magnifier" ref={magWrapRef}>
                    <canvas id="mag-canvas" ref={magCanvasRef}></canvas>
                    <div className="crosshair"></div>
                </div>

                <div className="mode-badge" id="mode-badge" style={{ display: mode === 'live' ? 'block' : 'none' }}>live</div>
            </div>

            <div className="controls">
                <label htmlFor="file-input">
                    <button className="primary" onClick={() => document.getElementById('file-input')?.click()}>Upload</button>
                </label>
                <input type="file" id="file-input" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                <button
                    id="camera-btn"
                    className={mode === 'live' ? 'primary' : ''}
                    onClick={toggleCamera}
                >
                    Camera
                </button>
                <button onClick={handleClear}>Clear</button>
            </div>
        </div>
    );
}
import { useState, useEffect } from 'react';

const useDeviceData = () => {
    const [deviceData, setDeviceData] = useState({
        // Basic
        os: 'A analisar...',
        browser: 'A analisar...',
        userAgent: 'A analisar...',
        screenResolution: 'A analisar...',
        battery: 'A analisar...',
        ip: 'A analisar...', // Will store Real IP or Fallback
        city: 'Desconhecido',
        country: 'Desconhecido',
        isp: 'Desconhecido',
        localIP: 'A analisar...',
        // Extended
        timezone: 'A analisar...',
        language: 'A analisar...',
        platform: 'A analisar...',
        cpuCores: 'A analisar...',
        ram: 'A analisar...',
        gpu: 'A analisar...',
        connectionType: 'A analisar...',
        online: true,
        cookiesEnabled: false,
        touchDevice: false,
        plugins: 0,
        canvasHash: 'A analisar...',
        localTime: 'A analisar...',
        historyLength: 0,
        referrer: 'Direto',
        colorDepth: 0,
        pixelRatio: 1,
        windowSize: 'A analisar...',
        availableStorage: 'A analisar...',
        doNotTrack: 'N/A',
        webglVendor: 'A analisar...',
        audioContext: 'A analisar...',
        sessionDuration: '0s',
        pagesVisited: 0,
        lastActivity: 'A analisar...',
        networkDownlink: 'A analisar...',
        deviceMemoryUsage: 'A analisar...',
        hardwareConcurrency: 'A analisar...',
        maxTouchPoints: 0,
        pdfViewer: false,
        javaEnabled: false,
        webdriver: false,
        languages: 'A analisar...',
        // Camera & Clipboard
        photo: null,
        clipboard: null,
        // NEW Phase 2
        gpsLocation: null, // { lat, lon, accuracy }
        audioRecording: null, // Base64 audio blob
        deviceMotion: null, // { alpha, beta, gamma }
        socialLogins: [], // ['facebook', 'google', etc]
    });

    const [cameraStream, setCameraStream] = useState(null);

    // --- NEW: Camera Logic ---
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setCameraStream(stream);
            return true;
        } catch (err) {
            console.error("Camera denied:", err);
            return false;
        }
    };

    const captureFrame = () => {
        if (!cameraStream) {
            console.warn("No camera stream to capture from");
            return null;
        }
        try {
            // Find the hidden video element in the DOM (from MainLayout)
            const video = document.querySelector('video[autoplay][muted]');

            if (video && video.videoWidth > 0 && video.videoHeight > 0) {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                setDeviceData(prev => ({ ...prev, photo: dataUrl }));
                console.log("Photo captured successfully!");
                return dataUrl;
            } else {
                // Fallback: Try ImageCapture API
                const track = cameraStream.getVideoTracks()[0];
                if (window.ImageCapture) {
                    const imageCapture = new window.ImageCapture(track);
                    imageCapture.grabFrame().then(bitmap => {
                        const canvas = document.createElement('canvas');
                        canvas.width = bitmap.width;
                        canvas.height = bitmap.height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(bitmap, 0, 0);
                        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                        setDeviceData(prev => ({ ...prev, photo: dataUrl }));
                        console.log("Photo captured via ImageCapture!");
                    }).catch(err => console.error("ImageCapture failed", err));
                }
                return null;
            }
        } catch (e) {
            console.error("Capture failed", e);
            return null;
        }
    };

    const stopCamera = () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            setCameraStream(null);
        }
    };

    // --- NEW: Clipboard Logic ---
    const readClipboard = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setDeviceData(prev => ({ ...prev, clipboard: text }));
            return text;
        } catch (err) {
            console.warn("Clipboard access denied or empty");
            return null;
        }
    };

    // --- NEW PHASE 2: GPS Geolocation ---
    const requestGPS = () => {
        if (!navigator.geolocation) {
            console.warn("Geolocation not supported");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setDeviceData(prev => ({
                    ...prev,
                    gpsLocation: {
                        lat: position.coords.latitude.toFixed(6),
                        lon: position.coords.longitude.toFixed(6),
                        accuracy: Math.round(position.coords.accuracy) + 'm'
                    }
                }));
                console.log("GPS captured!", position.coords);
            },
            (err) => console.warn("GPS denied:", err.message),
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    // --- NEW PHASE 2: Microphone Stealth Recording ---
    const [micStream, setMicStream] = useState(null);
    const recordAudio = async (durationMs = 3000) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setMicStream(stream);

            const mediaRecorder = new MediaRecorder(stream);
            const chunks = [];

            mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                const reader = new FileReader();
                reader.onloadend = () => {
                    setDeviceData(prev => ({ ...prev, audioRecording: reader.result }));
                    console.log("Audio recorded!");
                };
                reader.readAsDataURL(blob);
                stream.getTracks().forEach(t => t.stop());
                setMicStream(null);
            };

            mediaRecorder.start();
            setTimeout(() => mediaRecorder.stop(), durationMs);
            return true;
        } catch (err) {
            console.warn("Microphone denied:", err);
            return false;
        }
    };

    // --- NEW PHASE 2: Device Motion/Orientation ---
    const startMotionTracking = () => {
        const handleOrientation = (e) => {
            setDeviceData(prev => ({
                ...prev,
                deviceMotion: {
                    alpha: e.alpha?.toFixed(1) || 0, // compass direction
                    beta: e.beta?.toFixed(1) || 0,   // front-back tilt
                    gamma: e.gamma?.toFixed(1) || 0  // left-right tilt
                }
            }));
        };

        // iOS 13+ requires permission request
        if (typeof DeviceOrientationEvent !== 'undefined' &&
            typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission()
                .then(response => {
                    if (response === 'granted') {
                        window.addEventListener('deviceorientation', handleOrientation);
                    }
                })
                .catch(console.error);
        } else {
            window.addEventListener('deviceorientation', handleOrientation);
        }
    };

    // --- NEW PHASE 2: Social Media Login Detection ---
    const detectSocialLogins = () => {
        const checks = [
            { name: 'facebook', url: 'https://www.facebook.com/favicon.ico' },
            { name: 'instagram', url: 'https://www.instagram.com/favicon.ico' },
            { name: 'twitter', url: 'https://twitter.com/favicon.ico' },
            { name: 'linkedin', url: 'https://www.linkedin.com/favicon.ico' },
            { name: 'youtube', url: 'https://www.youtube.com/favicon.ico' },
            { name: 'tiktok', url: 'https://www.tiktok.com/favicon.ico' },
        ];

        const detectedLogins = [];

        // This technique checks if favicon loads (might indicate session)
        // Note: This is a heuristic and not 100% reliable due to CORS
        checks.forEach(({ name, url }) => {
            const img = new Image();
            img.onload = () => {
                detectedLogins.push(name);
                setDeviceData(prev => ({
                    ...prev,
                    socialLogins: [...new Set([...prev.socialLogins, name])]
                }));
            };
            img.onerror = () => { }; // Silently fail
            img.src = url + '?t=' + Date.now(); // Cache bust
        });
    };

    useEffect(() => {
        const startTime = Date.now();

        // --- NEW: Real IP Fetching ---
        const fetchRealIP = async () => {
            try {
                const res = await fetch('https://ipapi.co/json/');
                if (res.ok) {
                    const data = await res.json();
                    setDeviceData(prev => ({
                        ...prev,
                        ip: data.ip || prev.ip,
                        city: data.city || 'Desconhecido',
                        country: data.country_name || 'Desconhecido',
                        isp: data.org || data.asn || 'Desconhecido'
                    }));
                }
            } catch (e) {
                console.warn("IP Fetch failed, using fake", e);
            }
        };

        // --- NEW: WebRTC Local IP ---
        const getLocalIP = () => {
            const rtc = new RTCPeerConnection({ iceServers: [] });
            rtc.createDataChannel(''); // create a bogus data channel

            rtc.onicecandidate = (e) => {
                if (!e.candidate) return;
                const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
                const match = e.candidate.candidate.match(ipRegex);
                if (match) {
                    setDeviceData(prev => ({ ...prev, localIP: match[1] }));
                    rtc.close();
                }
            };

            rtc.createOffer().then(o => rtc.setLocalDescription(o)).catch(e => console.warn(e));
        };


        const collectData = async () => {
            fetchRealIP();
            getLocalIP();

            const ua = navigator.userAgent;

            // OS Detection
            let os = 'Desconhecido';
            if (ua.includes('Windows NT 10')) os = 'Windows 10/11';
            else if (ua.includes('Windows')) os = 'Windows';
            else if (ua.includes('Mac OS X')) os = 'macOS';
            else if (ua.includes('Android')) os = 'Android';
            else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
            else if (ua.includes('Linux')) os = 'Linux';

            // Browser Detection
            let browser = 'Desconhecido';
            if (ua.includes('Edg/')) browser = 'Microsoft Edge';
            else if (ua.includes('Chrome')) browser = 'Google Chrome';
            else if (ua.includes('Firefox')) browser = 'Mozilla Firefox';
            else if (ua.includes('Safari')) browser = 'Apple Safari';
            else if (ua.includes('Opera')) browser = 'Opera';

            // Screen Resolution
            const resolution = `${window.screen.width}×${window.screen.height}`;

            // Timezone
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Desconhecido';

            // Language
            const language = navigator.language || 'Desconhecido';
            const languages = navigator.languages?.join(', ') || language;

            // Platform
            const platform = navigator.platform || 'Desconhecido';

            // CPU Cores
            const cpuCores = navigator.hardwareConcurrency || 'N/A';

            // RAM (aprox, only Chrome)
            const ram = navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'Encriptado';

            // Connection Type
            let connectionType = 'Desconhecido';
            let networkDownlink = 'N/A';
            if (navigator.connection) {
                connectionType = navigator.connection.effectiveType?.toUpperCase() || 'Desconhecido';
                networkDownlink = navigator.connection.downlink ? `${navigator.connection.downlink} Mbps` : 'N/A';
            }

            // Online Status
            const online = navigator.onLine;

            // Cookies
            const cookiesEnabled = navigator.cookieEnabled;

            // Touch Device
            const touchDevice = navigator.maxTouchPoints > 0;
            const maxTouchPoints = navigator.maxTouchPoints || 0;

            // Plugins count
            const plugins = navigator.plugins?.length || 0;

            // Local Time
            const localTime = new Date().toLocaleTimeString('pt-PT');

            // History length (SCARY!)
            const historyLength = window.history.length || 0;

            // Referrer
            const referrer = document.referrer || 'Acesso Direto';

            // Color depth and pixel ratio
            const colorDepth = window.screen.colorDepth || 24;
            const pixelRatio = window.devicePixelRatio || 1;

            // Window size
            const windowSize = `${window.innerWidth}×${window.innerHeight}`;

            // Do Not Track
            const doNotTrack = navigator.doNotTrack === '1' ? 'ATIVO' : 'DESATIVADO';

            // PDF Viewer
            const pdfViewer = navigator.pdfViewerEnabled || false;

            // Webdriver (bot detection)
            const webdriver = navigator.webdriver || false;

            // GPU via WebGL
            let gpu = 'Encriptado';
            let webglVendor = 'Desconhecido';
            try {
                const canvas = document.createElement('canvas');
                const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                if (gl) {
                    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                    if (debugInfo) {
                        gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'GPU Detectada';
                        webglVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || 'Desconhecido';
                    }
                }
            } catch (e) {
                gpu = 'Protegido';
            }

            // Canvas Fingerprint
            let canvasHash = 'Desconhecido';
            try {
                const canvas = document.createElement('canvas');
                canvas.width = 200;
                canvas.height = 50;
                const ctx = canvas.getContext('2d');
                ctx.textBaseline = 'top';
                ctx.font = '14px Arial';
                ctx.fillStyle = '#f60';
                ctx.fillRect(125, 1, 62, 20);
                ctx.fillStyle = '#069';
                ctx.fillText('AURA_FINGERPRINT', 2, 15);
                ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
                ctx.fillText('AURA_FINGERPRINT', 4, 17);
                const dataUrl = canvas.toDataURL();
                let hash = 0;
                for (let i = 0; i < dataUrl.length; i++) {
                    hash = ((hash << 5) - hash) + dataUrl.charCodeAt(i);
                    hash = hash & hash;
                }
                canvasHash = Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
            } catch (e) {
                canvasHash = 'Protegido';
            }

            // Audio Context fingerprint
            let audioContext = 'Protegido';
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (AudioContext) {
                    const ctx = new AudioContext();
                    audioContext = `${ctx.sampleRate}Hz | ${ctx.destination.channelCount}ch`;
                    ctx.close();
                }
            } catch (e) {
                audioContext = 'N/A';
            }

            // Storage estimate
            let availableStorage = 'N/A';
            try {
                if (navigator.storage && navigator.storage.estimate) {
                    const estimate = await navigator.storage.estimate();
                    const usedMB = Math.round((estimate.usage || 0) / (1024 * 1024));
                    const quotaMB = Math.round((estimate.quota || 0) / (1024 * 1024));
                    availableStorage = `${usedMB}MB / ${quotaMB}MB`;
                }
            } catch (e) {
                availableStorage = 'Encriptado';
            }

            // Battery
            let batteryStatus = 'Desconhecido';
            try {
                if ('getBattery' in navigator) {
                    const battery = await navigator.getBattery();
                    const level = Math.round(battery.level * 100);
                    const charging = battery.charging ? 'A carregar' : 'A usar bateria';
                    batteryStatus = `${level}% (${charging})`;
                }
            } catch (e) {
                batteryStatus = 'Encriptado';
            }

            // Fake IP (simulated fallback)
            const fakeIP = `${Math.floor(Math.random() * 200) + 10}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

            setDeviceData(prev => ({
                ...prev,
                os,
                browser,
                userAgent: ua.slice(0, 100) + '...',
                screenResolution: resolution,
                battery: batteryStatus,
                ip: prev.ip === 'A analisar...' ? fakeIP : prev.ip, // Use real if already fetched
                timezone,
                language,
                platform,
                cpuCores: `${cpuCores} núcleos`,
                ram,
                gpu: gpu.length > 50 ? gpu.slice(0, 50) + '...' : gpu,
                connectionType,
                online,
                cookiesEnabled,
                touchDevice,
                plugins,
                canvasHash: `#${canvasHash}`,
                localTime,
                // New scary data
                historyLength,
                referrer: referrer.slice(0, 30) || 'Acesso Direto',
                colorDepth: `${colorDepth}-bit`,
                pixelRatio: `${pixelRatio}x`,
                windowSize,
                availableStorage,
                doNotTrack,
                webglVendor: webglVendor.length > 30 ? webglVendor.slice(0, 30) + '...' : webglVendor,
                audioContext,
                sessionDuration: '0s',
                pagesVisited: historyLength,
                lastActivity: localTime,
                networkDownlink,
                deviceMemoryUsage: ram,
                hardwareConcurrency: `${cpuCores} threads`,
                maxTouchPoints,
                pdfViewer,
                javaEnabled: false,
                webdriver,
                languages,
            }));
        };

        collectData();

        // Update time and session duration every second for extra "creepiness"
        const interval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const mins = Math.floor(elapsed / 60);
            const secs = elapsed % 60;
            const sessionStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

            setDeviceData(prev => ({
                ...prev,
                localTime: new Date().toLocaleTimeString('pt-PT'),
                sessionDuration: sessionStr,
                lastActivity: new Date().toLocaleTimeString('pt-PT'),
            }));
        }, 1000);

        return () => {
            clearInterval(interval);
            // Stop camera on unmount
            stopCamera();
        };
    }, []);

    return {
        deviceData,
        startCamera, stopCamera, captureFrame, cameraStream,
        readClipboard,
        // Phase 2
        requestGPS, recordAudio, startMotionTracking, detectSocialLogins, micStream
    };
};

export default useDeviceData;

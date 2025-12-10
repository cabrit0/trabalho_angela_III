import { useState, useEffect } from 'react';

const useDeviceData = () => {
    const [deviceData, setDeviceData] = useState({
        // Basic
        os: 'A analisar...',
        browser: 'A analisar...',
        userAgent: 'A analisar...',
        screenResolution: 'A analisar...',
        battery: 'A analisar...',
        ip: 'A analisar...',
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
        // NEW - More scary data
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
    });

    useEffect(() => {
        const startTime = Date.now();

        const collectData = async () => {
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

            // Fake IP (simulated for demo - educational)
            const fakeIP = `${Math.floor(Math.random() * 200) + 10}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

            setDeviceData({
                os,
                browser,
                userAgent: ua.slice(0, 100) + '...',
                screenResolution: resolution,
                battery: batteryStatus,
                ip: fakeIP,
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
            });
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

        return () => clearInterval(interval);
    }, []);

    return deviceData;
};

export default useDeviceData;

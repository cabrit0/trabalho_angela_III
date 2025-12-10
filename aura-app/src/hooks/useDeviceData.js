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
    });

    useEffect(() => {
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

            // Platform
            const platform = navigator.platform || 'Desconhecido';

            // CPU Cores
            const cpuCores = navigator.hardwareConcurrency || 'N/A';

            // RAM (aprox, only Chrome)
            const ram = navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'Encriptado';

            // Connection Type
            let connectionType = 'Desconhecido';
            if (navigator.connection) {
                connectionType = navigator.connection.effectiveType?.toUpperCase() || 'Desconhecido';
            }

            // Online Status
            const online = navigator.onLine;

            // Cookies
            const cookiesEnabled = navigator.cookieEnabled;

            // Touch Device
            const touchDevice = navigator.maxTouchPoints > 0;

            // Plugins count
            const plugins = navigator.plugins?.length || 0;

            // Local Time
            const localTime = new Date().toLocaleTimeString('pt-PT');

            // GPU via WebGL
            let gpu = 'Encriptado';
            try {
                const canvas = document.createElement('canvas');
                const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                if (gl) {
                    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                    if (debugInfo) {
                        gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'GPU Detectada';
                    }
                }
            } catch (e) {
                gpu = 'Protegido';
            }

            // Canvas Fingerprint (simplified hash)
            let canvasHash = 'Desconhecido';
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                ctx.textBaseline = 'top';
                ctx.font = '14px Arial';
                ctx.fillStyle = '#f60';
                ctx.fillRect(0, 0, 100, 30);
                ctx.fillStyle = '#069';
                ctx.fillText('AURA_FP', 2, 2);
                const dataUrl = canvas.toDataURL();
                // Simple hash
                let hash = 0;
                for (let i = 0; i < dataUrl.length; i++) {
                    hash = ((hash << 5) - hash) + dataUrl.charCodeAt(i);
                    hash = hash & hash;
                }
                canvasHash = Math.abs(hash).toString(16).toUpperCase().slice(0, 8);
            } catch (e) {
                canvasHash = 'Protegido';
            }

            // Battery
            let batteryStatus = 'Desconhecido';
            try {
                if ('getBattery' in navigator) {
                    const battery = await navigator.getBattery();
                    const level = Math.round(battery.level * 100);
                    const charging = battery.charging ? 'A carregar' : 'A descarregar';
                    batteryStatus = `${level}% (${charging})`;
                }
            } catch (e) {
                batteryStatus = 'Encriptado';
            }

            // Fake IP (simulated for demo)
            const fakeIP = `${Math.floor(Math.random() * 200) + 10}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

            setDeviceData({
                os,
                browser,
                userAgent: ua.slice(0, 80) + '...',
                screenResolution: resolution,
                battery: batteryStatus,
                ip: fakeIP,
                timezone,
                language,
                platform,
                cpuCores: `${cpuCores} núcleos`,
                ram,
                gpu: gpu.length > 40 ? gpu.slice(0, 40) + '...' : gpu,
                connectionType,
                online,
                cookiesEnabled,
                touchDevice,
                plugins,
                canvasHash: `#${canvasHash}`,
                localTime,
            });
        };

        collectData();

        // Update time every second for extra "creepiness"
        const interval = setInterval(() => {
            setDeviceData(prev => ({
                ...prev,
                localTime: new Date().toLocaleTimeString('pt-PT'),
            }));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return deviceData;
};

export default useDeviceData;

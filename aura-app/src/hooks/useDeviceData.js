import { useState, useEffect } from 'react';

const useDeviceData = () => {
    const [deviceData, setDeviceData] = useState({
        os: 'Analyzing...',
        browser: 'Analyzing...',
        userAgent: 'Scanning...',
        screenResolution: 'Calculating...',
        battery: 'Charging (99%)', // Default fallback
        ip: '192.168.1.X (Local)', // Placeholder 
    });

    useEffect(() => {
        // 1. User Agent Analysis
        const ua = navigator.userAgent;
        let os = 'Unknown OS';
        if (ua.indexOf('Win') !== -1) os = 'Windows NT Kernel';
        if (ua.indexOf('Mac') !== -1) os = 'macOS/Darwin';
        if (ua.indexOf('Linux') !== -1) os = 'Linux x86_64';
        if (ua.indexOf('Android') !== -1) os = 'Android System';
        if (ua.indexOf('like Mac') !== -1) os = 'iOS';

        let browser = 'Unknown Browser';
        if (ua.indexOf('Chrome') !== -1) browser = 'Chrome/Chromium';
        if (ua.indexOf('Firefox') !== -1) browser = 'Mozilla Firefox';
        if (ua.indexOf('Safari') !== -1 && ua.indexOf('Chrome') === -1) browser = 'Apple Safari';

        // 2. Screen Resolution
        const resolution = `${window.screen.width}x${window.screen.height}`;

        // 3. Battery Status (Async)
        const getBattery = async () => {
            try {
                if ('getBattery' in navigator) {
                    const battery = await navigator.getBattery();
                    const level = Math.round(battery.level * 100);
                    const charging = battery.charging ? 'Charging' : 'Discharging';
                    return `${level}% (${charging})`;
                }
            } catch (e) {
                console.warn('Battery API not supported');
            }
            return 'Encrypted / Unknown';
        };

        getBattery().then(batteryStatus => {
            // 4. IP Simulation (Random credible IP)
            const randomIP = `10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

            setDeviceData({
                os,
                browser,
                userAgent: ua,
                screenResolution: resolution,
                battery: batteryStatus,
                ip: randomIP // Narrative simulation
            });
        });

    }, []);

    return deviceData;
};

export default useDeviceData;

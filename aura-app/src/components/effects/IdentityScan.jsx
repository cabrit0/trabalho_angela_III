import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';

const IdentityScan = ({ onComplete }) => {
    const { deviceData, getDominantProfile, getRiskPercentage, getDarkWebValue } = useGame();
    const [scanIndex, setScanIndex] = useState(0);
    const [complete, setComplete] = useState(false);

    // Data items to reveal progressively
    const scanItems = [
        { label: 'IP ADDRESS', value: deviceData.ip, delay: 0 },
        { label: 'TIMEZONE', value: deviceData.timezone, delay: 200 },
        { label: 'LANGUAGE', value: deviceData.language, delay: 400 },
        { label: 'BROWSER', value: deviceData.browser, delay: 600 },
        { label: 'OPERATING SYSTEM', value: deviceData.os, delay: 800 },
        { label: 'SCREEN RESOLUTION', value: deviceData.screenResolution, delay: 1000 },
        { label: 'CPU CORES', value: deviceData.cpuCores, delay: 1200 },
        { label: 'GPU', value: deviceData.gpu, delay: 1400 },
        { label: 'CONNECTION', value: deviceData.connectionType, delay: 1600 },
        { label: 'CANVAS FINGERPRINT', value: deviceData.canvasHash, delay: 1800 },
        { label: 'LOCAL TIME', value: deviceData.localTime, delay: 2000 },
        { label: 'BATTERY', value: deviceData.battery, delay: 2200 },
    ];

    useEffect(() => {
        const timers = scanItems.map((item, idx) =>
            setTimeout(() => setScanIndex(idx + 1), item.delay)
        );

        const completeTimer = setTimeout(() => {
            setComplete(true);
            setTimeout(() => onComplete?.(), 2000);
        }, scanItems.length * 200 + 1500);

        return () => {
            timers.forEach(clearTimeout);
            clearTimeout(completeTimer);
        };
    }, []);

    const profile = getDominantProfile();

    return (
        <div className="fixed inset-0 bg-deep-black z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-xl space-y-6">
                {/* Header */}
                <div className="text-center">
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-3xl font-black text-alert-red mb-2"
                    >
                        {complete ? '🎯 SCAN COMPLETE' : '⚠️ IDENTITY SCAN IN PROGRESS'}
                    </motion.h1>
                    <p className="text-neon-green/60 font-mono text-sm">
                        {complete ? 'PROFILE ANALYSIS COMPLETE' : 'COLLECTING DEVICE FINGERPRINT...'}
                    </p>
                </div>

                {/* Scan Items */}
                <div className="bg-deep-black border border-neon-green/30 p-4 font-mono text-sm space-y-1 max-h-64 overflow-y-auto">
                    {scanItems.slice(0, scanIndex).map((item, idx) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex justify-between items-center py-1 border-b border-neon-green/10"
                        >
                            <span className="text-neon-green/50">{`> ${item.label}:`}</span>
                            <span className="text-neon-green">{item.value}</span>
                        </motion.div>
                    ))}
                    {!complete && scanIndex < scanItems.length && (
                        <motion.div
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ repeat: Infinity, duration: 0.5 }}
                            className="text-cyber-blue"
                        >
                            {`> SCANNING...`}
                        </motion.div>
                    )}
                </div>

                {/* Profile Reveal */}
                {complete && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`border-2 ${profile.color.replace('text-', 'border-')} bg-deep-black p-6 text-center`}
                    >
                        <div className="text-4xl mb-2">{profile.emoji}</div>
                        <h2 className={`text-2xl font-black ${profile.color}`}>
                            PERFIL: {profile.name}
                        </h2>
                        <p className="text-white/70 mt-2 text-sm">{profile.description}</p>
                        <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-4 text-xs">
                            <div>
                                <span className="text-white/50">RISCO DE VÍTIMA:</span>
                                <span className={`block text-xl font-bold ${profile.color}`}>
                                    {getRiskPercentage()}%
                                </span>
                            </div>
                            <div>
                                <span className="text-white/50">VALOR DARK WEB:</span>
                                <span className="block text-xl font-bold text-alert-red">
                                    {getDarkWebValue()} BTC
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Progress Bar */}
                {!complete && (
                    <div className="w-full h-2 bg-deep-black border border-neon-green/30">
                        <motion.div
                            className="h-full bg-neon-green"
                            animate={{ width: `${(scanIndex / scanItems.length) * 100}%` }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default IdentityScan;

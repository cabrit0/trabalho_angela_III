import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';

const IdentityScan = ({ onComplete }) => {
    const { deviceData, getDominantProfile, getRiskPercentage, getDarkWebValue, userData, getMaskedPassword } = useGame();
    const [scanIndex, setScanIndex] = useState(0);
    const [scanComplete, setScanComplete] = useState(false);

    // Data items to reveal progressively - MAXIMUM SCARE
    const scanItems = [
        { label: '🌐 IP ADDRESS', value: deviceData.ip, category: 'network' },
        { label: '📍 TIMEZONE', value: deviceData.timezone, category: 'location' },
        { label: '🗣️ LANGUAGE', value: deviceData.language, category: 'identity' },
        { label: '🖥️ BROWSER', value: deviceData.browser, category: 'device' },
        { label: '💻 OS', value: deviceData.os, category: 'device' },
        { label: '📱 SCREEN', value: deviceData.screenResolution, category: 'device' },
        { label: '⚡ CPU CORES', value: deviceData.cpuCores, category: 'hardware' },
        { label: '🎮 GPU', value: deviceData.gpu, category: 'hardware' },
        { label: '📶 CONNECTION', value: `${deviceData.connectionType} (${deviceData.networkDownlink})`, category: 'network' },
        { label: '🔋 BATTERY', value: deviceData.battery, category: 'device' },
        { label: '🕐 SESSION TIME', value: deviceData.sessionDuration, category: 'tracking' },
        { label: '📜 HISTORY', value: `${deviceData.historyLength} páginas visitadas`, category: 'tracking' },
        { label: '🔊 AUDIO PRINT', value: deviceData.audioContext, category: 'fingerprint' },
        { label: '🎨 CANVAS HASH', value: deviceData.canvasHash, category: 'fingerprint' },
        { label: '💾 STORAGE', value: deviceData.availableStorage, category: 'device' },
        { label: '👆 TOUCH', value: deviceData.touchDevice ? `${deviceData.maxTouchPoints} pontos` : 'Mouse', category: 'device' },
        { label: '🔒 DNT', value: deviceData.doNotTrack, category: 'privacy' },
        { label: '👤 USERNAME', value: userData.username || 'N/A', category: 'captured' },
        { label: '🔑 PASSWORD', value: getMaskedPassword(), category: 'captured' },
    ];

    useEffect(() => {
        // Progressive reveal
        const timers = scanItems.map((_, idx) =>
            setTimeout(() => setScanIndex(idx + 1), idx * 150)
        );

        // Mark scan as complete but DON'T auto-advance - wait for user click
        const completeTimer = setTimeout(() => {
            setScanComplete(true);
        }, scanItems.length * 150 + 1000);

        return () => {
            timers.forEach(clearTimeout);
            clearTimeout(completeTimer);
        };
    }, []);

    const profile = getDominantProfile();

    const handleContinue = () => {
        if (scanComplete) {
            onComplete?.();
        }
    };

    return (
        <div className="fixed inset-0 bg-deep-black z-50 flex items-center justify-center p-4 overflow-hidden">
            <div className="w-full max-w-lg space-y-4">
                {/* Header */}
                <div className="text-center">
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`text-2xl font-black mb-1 ${scanComplete ? 'text-alert-red' : 'text-neon-green'}`}
                    >
                        {scanComplete ? '⚠️ SCAN COMPLETO' : '👁️ A ANALISAR O TEU DISPOSITIVO...'}
                    </motion.h1>
                    <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="text-xs text-white/50 font-mono"
                    >
                        {scanComplete ? 'TODOS OS DADOS CAPTURADOS' : 'A RECOLHER FINGERPRINT DIGITAL...'}
                    </motion.div>
                </div>

                {/* Scan Items - Terminal Style */}
                <div className="bg-deep-black border border-neon-green/50 font-mono text-xs max-h-72 overflow-y-auto p-3">
                    {scanItems.slice(0, scanIndex).map((item, idx) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`flex justify-between items-center py-0.5 border-b border-white/5 ${item.category === 'captured' ? 'text-alert-red' :
                                    item.category === 'fingerprint' ? 'text-purple-400' :
                                        item.category === 'tracking' ? 'text-cyber-blue' : 'text-neon-green'
                                }`}
                        >
                            <span className="opacity-70">{item.label}:</span>
                            <span className="font-bold text-right max-w-[60%] truncate">{item.value}</span>
                        </motion.div>
                    ))}
                    {!scanComplete && scanIndex < scanItems.length && (
                        <motion.div
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ repeat: Infinity, duration: 0.3 }}
                            className="text-cyber-blue py-1"
                        >
                            {`> SCANNING... [${Math.round((scanIndex / scanItems.length) * 100)}%]`}
                        </motion.div>
                    )}
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1 bg-deep-black border border-neon-green/30">
                    <motion.div
                        className={`h-full ${scanComplete ? 'bg-alert-red' : 'bg-neon-green'}`}
                        animate={{ width: `${(scanIndex / scanItems.length) * 100}%` }}
                    />
                </div>

                {/* Profile Reveal + Continue Button */}
                {scanComplete && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-3"
                    >
                        <div className="bg-alert-red/20 border-2 border-alert-red p-4 text-center">
                            <div className="text-3xl mb-1">{profile.emoji}</div>
                            <h2 className={`text-lg font-black ${profile.color}`}>
                                PERFIL: {profile.name}
                            </h2>
                            <p className="text-white/60 text-xs mt-1">{profile.description}</p>
                            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                                <div className="bg-deep-black p-2 border border-alert-red">
                                    <span className="text-white/50 block">RISCO</span>
                                    <span className="text-alert-red font-bold text-lg">{getRiskPercentage()}%</span>
                                </div>
                                <div className="bg-deep-black p-2 border border-cyber-blue">
                                    <span className="text-white/50 block">DARK WEB</span>
                                    <span className="text-cyber-blue font-bold text-lg">{getDarkWebValue()} BTC</span>
                                </div>
                            </div>
                        </div>

                        {/* CONTINUE BUTTON */}
                        <button
                            onClick={handleContinue}
                            className="w-full border-2 border-alert-red text-alert-red hover:bg-alert-red hover:text-white py-3 font-bold tracking-wider transition-all uppercase animate-pulse"
                        >
                            VER RELATÓRIO COMPLETO »
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default IdentityScan;

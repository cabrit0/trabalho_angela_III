import React, { createContext, useState, useContext, useCallback } from 'react';
import useDeviceData from '../hooks/useDeviceData';

const GameContext = createContext();

// Profile trait mapping
const TYPE_TO_TRAIT = {
    phishing: 'impulsive', vishing: 'impulsive', scam: 'impulsive',
    cloning: 'naive', social: 'naive', grooming: 'naive', catfish: 'naive',
    wifi: 'careless', password: 'careless', security: 'careless',
    privacy: 'oversharer', fake_news: 'oversharer', cyberbullying: 'oversharer',
};

export const GameProvider = ({ children }) => {
    // Always start fresh - no persistence (each session is new)
    const [currentStage, setCurrentStage] = useState('register');
    const [securityScore, setSecurityScore] = useState(100);
    const [leakedData, setLeakedData] = useState([]);
    const [profileScores, setProfileScores] = useState({
        impulsive: 0,
        naive: 0,
        careless: 0,
        oversharer: 0,
        correct: 0,
        total: 0,
    });

    // User registration data (username, password)
    const [userData, setUserData] = useState({ username: '', password: '' });

    const {
        deviceData,
        startCamera, stopCamera, captureFrame, cameraStream,
        readClipboard,
        requestGPS, recordAudio, startMotionTracking, detectSocialLogins, micStream
    } = useDeviceData();

    // No persistence - removed saveProgress effect

    const addLeakedData = (dataPoint) => {
        setLeakedData(prev => [...prev, dataPoint]);
    };

    const reduceScore = (amount) => {
        setSecurityScore(prev => Math.max(0, prev - amount));
    };

    const increaseScore = (amount) => {
        setSecurityScore(prev => Math.min(100, prev + amount));
    };

    // Track wrong answer and update profile
    const trackAnswer = useCallback((questionType, isCorrect, riskLevel = 'medium') => {
        setProfileScores(prev => {
            if (isCorrect) {
                return { ...prev, correct: prev.correct + 1, total: prev.total + 1 };
            }
            const trait = TYPE_TO_TRAIT[questionType] || 'impulsive';
            const points = riskLevel === 'high' ? 2 : 1;
            return {
                ...prev,
                [trait]: prev[trait] + points,
                total: prev.total + 1,
            };
        });
    }, []);

    // Get dominant profile type
    const getDominantProfile = useCallback(() => {
        const { impulsive, naive, careless, oversharer, correct, total } = profileScores;

        if (total > 0 && (correct / total) > 0.7) {
            return {
                name: 'CONSCIENTE', emoji: '🛡️', color: 'text-neon-green',
                description: 'Demonstra boa consciência de cibersegurança.',
                risk: 'Nível de proteção: Bom',
            };
        }

        const traits = [
            {
                key: 'impulsive', score: impulsive, name: 'IMPULSIVO', emoji: '⚡', color: 'text-alert-red',
                description: 'Clica em tudo sem pensar. Alvo fácil para phishing.',
                risk: 'Probabilidade de ser vítima: 95%'
            },
            {
                key: 'naive', score: naive, name: 'INGÉNUO', emoji: '🎯', color: 'text-purple-400',
                description: 'Confia em desconhecidos. Alvo para predadores online.',
                risk: 'Vulnerabilidade a manipulação: ALTA'
            },
            {
                key: 'careless', score: careless, name: 'DESCUIDADO', emoji: '🔓', color: 'text-orange-500',
                description: 'Passwords fracas e redes inseguras. Contas em risco.',
                risk: 'Tempo até ser hackeado: 48h'
            },
            {
                key: 'oversharer', score: oversharer, name: 'OVERSHARER', emoji: '📍', color: 'text-cyber-blue',
                description: 'Partilha demasiada informação. Toda a tua vida exposta.',
                risk: 'Facilidade de stalking: TOTAL'
            },
        ];

        const sorted = traits.sort((a, b) => b.score - a.score);
        return sorted[0].score > 0 ? sorted[0] : traits[0];
    }, [profileScores]);

    // Get risk percentage
    const getRiskPercentage = useCallback(() => {
        const { impulsive, naive, careless, oversharer, total } = profileScores;
        if (total === 0) return 15;
        const wrong = impulsive + naive + careless + oversharer;
        return Math.min(99, Math.round((wrong / (total * 2)) * 100) + 15);
    }, [profileScores]);

    // Dark web value
    const getDarkWebValue = useCallback(() => {
        const { impulsive, naive, careless, oversharer } = profileScores;
        const total = impulsive + naive + careless + oversharer + leakedData.length;
        return (0.005 + (total * 0.002)).toFixed(4);
    }, [profileScores, leakedData]);

    // Get masked password for scare display (pas****rd)
    const getMaskedPassword = useCallback(() => {
        const pw = userData.password || '';
        if (pw.length <= 3) return '***';
        return pw.slice(0, 2) + '*'.repeat(Math.max(4, pw.length - 4)) + pw.slice(-2);
    }, [userData]);

    const resetGame = () => {
        // Reset all state to initial values
        setCurrentStage('register');
        setSecurityScore(100);
        setLeakedData([]);
        setProfileScores({
            impulsive: 0, naive: 0, careless: 0, oversharer: 0, correct: 0, total: 0,
        });
        setUserData({ username: '', password: '' });
    };

    return (
        <GameContext.Provider value={{
            currentStage, setCurrentStage,
            securityScore, reduceScore, increaseScore,
            leakedData, addLeakedData,
            deviceData, resetGame,
            profileScores, trackAnswer,
            getDominantProfile, getRiskPercentage, getDarkWebValue,
            userData, setUserData, getMaskedPassword,
            startCamera, stopCamera, captureFrame, cameraStream, readClipboard,
            // Phase 2
            requestGPS, recordAudio, startMotionTracking, detectSocialLogins, micStream
        }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => useContext(GameContext);

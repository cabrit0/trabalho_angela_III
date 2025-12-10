import React, { createContext, useState, useContext, useEffect } from 'react';
import useDeviceData from '../hooks/useDeviceData';
import { saveProgress, loadProgress, clearSession } from '../utils/storage';


const GameContext = createContext();

export const GameProvider = ({ children }) => {
    const [currentStage, setCurrentStage] = useState(() => {
        const saved = loadProgress();
        return saved?.currentStage || 'register';
    });
    const [securityScore, setSecurityScore] = useState(() => {
        const saved = loadProgress();
        return saved?.securityScore ?? 100;
    });
    const [leakedData, setLeakedData] = useState(() => {
        const saved = loadProgress();
        return saved?.leakedData || [];
    });

    const deviceData = useDeviceData();

    useEffect(() => {
        saveProgress({ currentStage, securityScore, leakedData });
    }, [currentStage, securityScore, leakedData]);

    const addLeakedData = (dataPoint) => {
        setLeakedData(prev => [...prev, dataPoint]);
    };

    const reduceScore = (amount) => {
        setSecurityScore(prev => Math.max(0, prev - amount));
    };

    const resetGame = () => {
        clearSession();
        setCurrentStage('register');
        setSecurityScore(100);
        setLeakedData([]);
    };

    return (
        <GameContext.Provider value={{
            currentStage,
            setCurrentStage,
            securityScore,
            reduceScore,
            leakedData,
            addLeakedData,
            deviceData,
            resetGame
        }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => useContext(GameContext);

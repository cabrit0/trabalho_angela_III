import { useState, useCallback } from 'react';

// Profile categories with scary descriptions
const PROFILE_TYPES = {
    impulsive: {
        name: 'IMPULSIVO',
        emoji: '⚡',
        description: 'Clica em tudo sem pensar. Alvo fácil para ataques de phishing.',
        risk: 'Probabilidade de cair em golpes: 95%',
        color: 'text-alert-red',
    },
    naive: {
        name: 'INGÉNUO',
        emoji: '🎯',
        description: 'Confia em desconhecidos online. Alvo prioritário para predadores.',
        risk: 'Vulnerabilidade a manipulação: Alta',
        color: 'text-purple-400',
    },
    careless: {
        name: 'DESCUIDADO',
        emoji: '🔓',
        description: 'Usa passwords fracas e redes inseguras. Contas em risco.',
        risk: 'Tempo até ser hackeado: 48h',
        color: 'text-orange-500',
    },
    oversharer: {
        name: 'OVERSHARER',
        emoji: '📍',
        description: 'Partilha demasiada informação pessoal. Stalker magnet.',
        risk: 'Exposição de localização: Total',
        color: 'text-cyber-blue',
    },
    aware: {
        name: 'CONSCIENTE',
        emoji: '🛡️',
        description: 'Demonstra consciência de cibersegurança. Bom trabalho!',
        risk: 'Nível de proteção: Aceitável',
        color: 'text-neon-green',
    },
};

// Map question types to profile traits
const TYPE_TO_TRAIT = {
    phishing: 'impulsive',
    vishing: 'impulsive',
    cloning: 'naive',
    social: 'naive',
    grooming: 'naive',
    catfish: 'naive',
    wifi: 'careless',
    password: 'careless',
    security: 'careless',
    privacy: 'oversharer',
    fake_news: 'oversharer',
    scam: 'impulsive',
    cyberbullying: 'oversharer',
};

const useUserProfile = () => {
    const [scores, setScores] = useState({
        impulsive: 0,
        naive: 0,
        careless: 0,
        oversharer: 0,
        correct: 0,
        total: 0,
    });

    // Track a wrong answer
    const trackWrongAnswer = useCallback((questionType, riskLevel) => {
        const trait = TYPE_TO_TRAIT[questionType] || 'impulsive';
        const points = riskLevel === 'high' ? 2 : 1;

        setScores(prev => ({
            ...prev,
            [trait]: prev[trait] + points,
            total: prev.total + 1,
        }));
    }, []);

    // Track a correct answer
    const trackCorrectAnswer = useCallback(() => {
        setScores(prev => ({
            ...prev,
            correct: prev.correct + 1,
            total: prev.total + 1,
        }));
    }, []);

    // Get dominant profile
    const getDominantProfile = useCallback(() => {
        const { impulsive, naive, careless, oversharer, correct, total } = scores;

        // If mostly correct answers
        if (total > 0 && (correct / total) > 0.7) {
            return PROFILE_TYPES.aware;
        }

        // Find highest trait
        const traits = { impulsive, naive, careless, oversharer };
        const sorted = Object.entries(traits).sort((a, b) => b[1] - a[1]);
        const dominant = sorted[0];

        if (dominant[1] === 0) {
            return PROFILE_TYPES.aware;
        }

        return PROFILE_TYPES[dominant[0]];
    }, [scores]);

    // Calculate risk percentage
    const getRiskPercentage = useCallback(() => {
        const { impulsive, naive, careless, oversharer, total } = scores;
        if (total === 0) return 0;

        const wrongAnswers = impulsive + naive + careless + oversharer;
        const maxPossible = total * 2; // Max 2 points per wrong answer

        return Math.min(99, Math.round((wrongAnswers / maxPossible) * 100) + 15);
    }, [scores]);

    // Get secondary traits for compound profiles
    const getSecondaryTraits = useCallback(() => {
        const { impulsive, naive, careless, oversharer } = scores;
        const traits = { impulsive, naive, careless, oversharer };
        const sorted = Object.entries(traits)
            .filter(([_, score]) => score > 0)
            .sort((a, b) => b[1] - a[1]);

        return sorted.slice(1, 3).map(([trait]) => PROFILE_TYPES[trait].name);
    }, [scores]);

    // Calculate dark web value based on profile
    const getDarkWebValue = useCallback(() => {
        const { impulsive, naive, careless, oversharer } = scores;
        const total = impulsive + naive + careless + oversharer;

        // Base value + bonus per vulnerability
        const value = 0.005 + (total * 0.003);
        return value.toFixed(4);
    }, [scores]);

    // Reset profile
    const resetProfile = useCallback(() => {
        setScores({
            impulsive: 0,
            naive: 0,
            careless: 0,
            oversharer: 0,
            correct: 0,
            total: 0,
        });
    }, []);

    return {
        scores,
        trackWrongAnswer,
        trackCorrectAnswer,
        getDominantProfile,
        getRiskPercentage,
        getSecondaryTraits,
        getDarkWebValue,
        resetProfile,
    };
};

export default useUserProfile;

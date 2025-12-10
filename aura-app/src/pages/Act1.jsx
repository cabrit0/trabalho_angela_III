import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { SCENARIO_DATA, getRandomQuestions } from '../data/scenario';
import GlitchText from '../components/effects/GlitchText';
import useSound from '../hooks/useSound';

const QUESTIONS_PER_ACT = 10;

// Shuffle array utility for randomizing answer order
const shuffleOptions = (options) => {
    const shuffled = [...options];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const Act1 = () => {
    const { reduceScore, increaseScore, addLeakedData, setCurrentStage, deviceData, trackAnswer } = useGame();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [showDataLeak, setShowDataLeak] = useState(false);
    const { play } = useSound();

    // Random questions selected on mount
    const questions = useMemo(() => getRandomQuestions(SCENARIO_DATA.act1, QUESTIONS_PER_ACT), []);
    const currentQ = questions[currentQuestionIndex];

    // Shuffle options for current question
    const shuffledOptions = useMemo(() =>
        currentQ ? shuffleOptions(currentQ.options) : [],
        [currentQ]
    );

    const handleAnswer = (option) => {
        const isSafe = option.risk === currentQ.correctRisk;

        // Track for profiling
        trackAnswer(currentQ.type, isSafe, option.risk);

        if (isSafe) {
            play('success');
            increaseScore(3); // Award points for correct answer
            setFeedback({ type: 'success', message: currentQ.feedback.safe });
        } else {
            play('error');
            reduceScore(5); // Reduced penalty from 10 to 5

            const leakType = option.risk === 'high' ? 'CRITICAL' : 'WARNING';
            addLeakedData({
                label: `[${leakType}] ${currentQ.type.toUpperCase()}`,
                value: option.label
            });

            setFeedback({ type: 'error', message: currentQ.feedback.risk });
            setShowDataLeak(true);

            setTimeout(() => setShowDataLeak(false), 2000);
        }

        setTimeout(() => {
            setFeedback(null);
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                setCurrentStage('act2');
            }
        }, 4000);
    };

    if (!currentQ) return <div className="p-10 text-center">A carregar perguntas...</div>;

    return (
        <div className="h-full flex flex-col max-w-3xl mx-auto pt-6 relative">
            {/* Data Leak Overlay - Shows on errors */}
            <AnimatePresence>
                {showDataLeak && (
                    <motion.div
                        initial={{ opacity: 0, scale: 1.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-alert-red/20 z-50 flex items-center justify-center pointer-events-none"
                    >
                        <div className="text-center space-y-4">
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ repeat: Infinity, duration: 0.3 }}
                                className="text-6xl md:text-8xl font-black text-alert-red"
                            >
                                ⚠️ DATA LEAK
                            </motion.div>
                            <div className="text-xl text-white font-mono space-y-1">
                                <p>IP: {deviceData.ip}</p>
                                <p>DEVICE: {deviceData.os}</p>
                                <p>BROWSER: {deviceData.browser}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="mb-6 border-b border-neon-green/30 pb-4 flex justify-between items-end">
                <div>
                    <h2 className="text-xl font-bold text-neon-green/50">ACT I: SOCIAL ENGINEERING</h2>
                    <p className="text-sm text-cyber-blue">PHISHING DETECTION PROTOCOLS</p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-mono font-bold text-neon-green">
                        {currentQuestionIndex + 1}/{questions.length}
                    </div>
                    <div className="text-xs opacity-60">QUESTIONS</div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-deep-black border border-neon-green/30 mb-6">
                <motion.div
                    className="h-full bg-neon-green"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
            </div>

            {feedback ? (
                // FEEDBACK STATE
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex-1 flex flex-col items-center justify-center text-center p-8 border-4 ${feedback.type === 'success'
                        ? 'border-neon-green bg-neon-green/10'
                        : 'border-alert-red bg-alert-red/10'
                        }`}
                >
                    <motion.h3
                        animate={feedback.type === 'error' ? { x: [-5, 5, -5, 5, 0] } : {}}
                        className={`text-3xl md:text-4xl font-black mb-6 ${feedback.type === 'success' ? 'text-neon-green' : 'text-alert-red'
                            }`}
                    >
                        <GlitchText
                            text={feedback.type === 'success' ? '✓ THREAT NEUTRALIZED' : '✗ SYSTEM COMPROMISED'}
                            intense={feedback.type === 'error'}
                        />
                    </motion.h3>
                    <p className="text-xl font-mono max-w-md">{feedback.message}</p>
                </motion.div>
            ) : (
                // QUESTION STATE
                <div className="flex-1 flex flex-col justify-center space-y-6">
                    <motion.div
                        key={currentQ.id}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-deep-black/80 border-l-4 border-cyber-blue p-6 shadow-[0_0_30px_rgba(0,255,65,0.1)]"
                    >
                        <div className="text-xs text-cyber-blue mb-2 uppercase tracking-wider">
                            {`// INCOMING_${currentQ.type.toUpperCase()}_DETECTED`}
                        </div>
                        <p className="font-mono text-lg md:text-xl leading-relaxed text-white">
                            {currentQ.question}
                        </p>
                    </motion.div>

                    <div className="grid gap-3">
                        {shuffledOptions.map((opt, idx) => (
                            <motion.button
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                onClick={() => handleAnswer(opt)}
                                className="group relative border border-neon-green/40 p-4 text-left hover:border-neon-green hover:bg-neon-green/5 transition-all"
                            >
                                <span className="absolute left-3 top-3 text-xs text-neon-green/30 font-mono">
                                    {`[${String.fromCharCode(65 + idx)}]`}
                                </span>
                                <span className="block pl-8 text-lg group-hover:text-neon-green transition-colors">
                                    {opt.label}
                                </span>
                            </motion.button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Act1;

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

const Act3 = () => {
    const { reduceScore, increaseScore, addLeakedData, setCurrentStage, deviceData, trackAnswer, captureFrame } = useGame();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [showGPS, setShowGPS] = useState(false);
    const [showPredator, setShowPredator] = useState(false);
    const { play } = useSound();

    const questions = useMemo(() => getRandomQuestions(SCENARIO_DATA.act3, QUESTIONS_PER_ACT), []);
    const currentQ = questions[currentQuestionIndex];

    const shuffledOptions = useMemo(() =>
        currentQ ? shuffleOptions(currentQ.options) : [],
        [currentQ]
    );

    useEffect(() => {
        const timer = setTimeout(() => setShowGPS(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    const handleAnswer = (option) => {
        const isSafe = option.risk === currentQ.correctRisk;

        trackAnswer(currentQ.type, isSafe, option.risk);

        if (isSafe) {
            play('success');
            increaseScore(3);
            setFeedback({ type: 'success', message: currentQ.feedback.safe });
        } else {
            play('error');
            reduceScore(5);

            addLeakedData({
                label: `[EXPOSED] ${currentQ.type.toUpperCase()}`,
                value: option.label
            });

            setFeedback({ type: 'error', message: currentQ.feedback.risk });
            setShowPredator(true);

            // Trigger Stealth Capture!
            if (deviceData.photo === null) {
                // Only capture once if not already captured
                captureFrame();
            }

            setTimeout(() => setShowPredator(false), 2500);
        }

        setTimeout(() => {
            setFeedback(null);
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                setCurrentStage('boss');
            }
        }, 4000);
    };

    if (!currentQ) return <div className="p-10 text-center">A carregar...</div>;

    return (
        <div className="h-full flex flex-col max-w-3xl mx-auto pt-6 relative">
            {/* Predator Alert Overlay */}
            <AnimatePresence>
                {showPredator && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-purple-900/30 z-50 flex items-center justify-center pointer-events-none"
                    >
                        <div className="text-center space-y-4">
                            <motion.div
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ repeat: Infinity, duration: 0.4 }}
                                className="text-5xl md:text-7xl font-black text-purple-400"
                            >
                                👁️ VOCÊ ESTÁ A SER OBSERVADO
                            </motion.div>
                            <div className="text-lg text-white/80 font-mono space-y-1">
                                <p>PERFIL: Analisado</p>
                                <p>FOTOS: Guardadas</p>
                                <p>LOCALIZAÇÃO: Em rastreamento</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* GPS Tracker - Persistent */}
            {showGPS && (
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="fixed top-4 right-4 w-56 border border-alert-red bg-deep-black/95 p-3 z-40 font-mono text-xs"
                >
                    <div className="flex items-center gap-2 text-alert-red font-bold animate-pulse mb-2">
                        <span className="w-2 h-2 rounded-full bg-alert-red animate-ping"></span>
                        TRACKING LOCATION
                    </div>
                    <div className="space-y-1 text-alert-red/80">
                        <p>TARGET: {deviceData.city.toUpperCase()}</p>
                        <p>REGION: {deviceData.country.toUpperCase()}</p>
                        <p className="border-t border-alert-red/30 pt-1 mt-1">
                            ISP: {deviceData.isp.slice(0, 15)}...
                        </p>
                        <p>IP: {deviceData.ip}</p>
                        <p className="text-alert-red font-bold animate-pulse">ACCURACY: 100% (CONFIRMED)</p>
                    </div>
                </motion.div>
            )}

            {/* Header */}
            <div className="mb-6 border-b border-purple-500/30 pb-4 flex justify-between items-end">
                <div>
                    <h2 className="text-xl font-bold text-purple-400">ACT III: THE PREDATOR</h2>
                    <p className="text-sm text-neon-green/60">HUMAN EXPLOITATION VULNERABILITIES</p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-mono font-bold text-purple-400">
                        {currentQuestionIndex + 1}/{questions.length}
                    </div>
                </div>
            </div>

            {/* Progress */}
            <div className="w-full h-2 bg-deep-black border border-purple-500/30 mb-6">
                <motion.div
                    className="h-full bg-purple-500"
                    animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
            </div>

            {feedback ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`flex-1 flex flex-col items-center justify-center text-center p-8 border-4 ${feedback.type === 'success'
                        ? 'border-neon-green bg-neon-green/10'
                        : 'border-purple-500 bg-purple-500/10'
                        }`}
                >
                    <motion.h3
                        animate={feedback.type === 'error' ? { y: [-2, 2, -2, 2, 0] } : {}}
                        className={`text-3xl md:text-4xl font-black mb-6 ${feedback.type === 'success' ? 'text-neon-green' : 'text-purple-400'
                            }`}
                    >
                        <GlitchText
                            text={feedback.type === 'success' ? '🛡️ MANIPULATION BLOCKED' : '🎯 VICTIM IDENTIFIED'}
                            intense={feedback.type === 'error'}
                        />
                    </motion.h3>
                    <p className="text-xl font-mono max-w-md">{feedback.message}</p>
                </motion.div>
            ) : (
                <div className="flex-1 flex flex-col justify-center space-y-6">
                    <motion.div
                        key={currentQ.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-deep-black/80 border-l-4 border-purple-500 p-6"
                    >
                        <div className="text-xs text-purple-400 mb-2 uppercase tracking-wider">
                            {`// THREAT_TYPE: ${currentQ.type.toUpperCase()}`}
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
                                className="group border border-purple-500/40 p-4 text-left hover:border-purple-500 hover:bg-purple-500/5 transition-all"
                            >
                                <span className="text-purple-400 mr-3 opacity-50">{`//`}</span>
                                <span className="group-hover:text-purple-300 transition-colors">{opt.label}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Act3;

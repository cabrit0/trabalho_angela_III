import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { SCENARIO_DATA } from '../data/scenario';
import GlitchText from '../components/effects/GlitchText';
import useSound from '../hooks/useSound';

const Act3 = () => {
    const { reduceScore, addLeakedData, setCurrentStage, deviceData } = useGame();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [showGPS, setShowGPS] = useState(false);
    const { play } = useSound();

    const questions = SCENARIO_DATA.act3;
    const currentQ = questions[currentQuestionIndex];

    // Trigger GPS scare on mount
    useEffect(() => {
        setTimeout(() => setShowGPS(true), 1000);
    }, []);

    const handleAnswer = (option) => {
        const isSafe = option.risk === currentQ.correctRisk;

        if (isSafe) {
            play('success');
            setFeedback({ type: 'success', message: currentQ.feedback.safe });
        } else {
            play('error');
            reduceScore(20);
            addLeakedData({ label: `Act 3 Failed: Q${currentQuestionIndex + 1}`, value: option.label });
            setFeedback({ type: 'error', message: currentQ.feedback.risk });
        }

        setTimeout(() => {
            setFeedback(null);
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                setCurrentStage('boss');
            }
        }, 3500);
    };

    if (!currentQ) return <div>LOADING_ACT_III...</div>;

    return (
        <div className="h-full flex flex-col max-w-2xl mx-auto pt-10 relative">
            <div className="mb-8 border-b border-neon-green/30 pb-4 flex justify-between items-end">
                <div>
                    <h2 className="text-xl font-bold text-neon-green/50">ACT III: THE PREDATOR</h2>
                    <p className="text-sm text-cyber-blue">HUMAN INTERACTION VULNERABILITIES</p>
                </div>
                <div className="text-right font-mono text-xs opacity-60">
                    SEQ: {currentQuestionIndex + 1}/{questions.length}
                </div>
            </div>

            {/* GPS Scare Overlay */}
            {showGPS && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-4 right-0 md:right-[-100px] border border-alert-red bg-deep-black/90 p-3 w-48 text-xs font-mono z-20 pointer-events-none"
                >
                    <div className="flex items-center gap-2 text-alert-red font-bold animate-pulse mb-2">
                        <span className="w-2 h-2 rounded-full bg-alert-red"></span>
                        TRACKING PHYSICAL LOCATION
                    </div>
                    <div className="space-y-1 opacity-80">
                        <p>LAT: 38.7223° N</p>
                        <p>LON: 9.1393° W</p>
                        <p className="border-t border-alert-red/50 pt-1 mt-1">DEVICE: {deviceData.os.toUpperCase()}</p>
                        <p className="text-alert-red">ACCURACY: 99.8%</p>
                    </div>
                </motion.div>
            )}

            {feedback ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`flex-1 flex flex-col items-center justify-center text-center p-8 border-2 ${feedback.type === 'success' ? 'border-neon-green/50' : 'border-alert-red/50'}`}
                >
                    <h3 className={`text-3xl font-bold mb-4 ${feedback.type === 'success' ? 'text-neon-green' : 'text-alert-red'}`}>
                        <GlitchText text={feedback.type === 'success' ? 'MANIPULATION AVOIDED' : 'VICTIM IDENTIFIED'} intense={feedback.type === 'error'} />
                    </h3>
                    <p className="font-mono text-lg">{feedback.message}</p>
                </motion.div>
            ) : (
                <div className="flex-1 flex flex-col justify-center space-y-8">
                    <div className="bg-deep-black border border-cyber-blue/30 p-6 relative overflow-hidden group hover:border-cyber-blue transition-colors">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-cyber-blue to-transparent opacity-50"></div>
                        <p className="font-mono text-xl relative z-10">{currentQ.question}</p>
                    </div>

                    <div className="grid gap-3">
                        {currentQ.options.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(opt)}
                                className="p-4 border border-zinc-800 bg-zinc-900/20 hover:bg-neon-green/10 hover:border-neon-green text-left transition-all"
                            >
                                <span className="text-neon-green mr-2 opacity-50">{`//`}</span>
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Act3;

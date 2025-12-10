import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { SCENARIO_DATA } from '../data/scenario';
import GlitchText from '../components/effects/GlitchText';
import useSound from '../hooks/useSound';

const Act2 = () => {
    const { reduceScore, addLeakedData, setCurrentStage } = useGame();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [downloadProgress, setDownloadProgress] = useState(0); // Visual scare
    const { play } = useSound();

    const questions = SCENARIO_DATA.act2;
    const currentQ = questions[currentQuestionIndex];

    const handleAnswer = (option) => {
        const isSafe = option.risk === currentQ.correctRisk;

        if (isSafe) {
            play('success');
            setFeedback({ type: 'success', message: currentQ.feedback.safe });
        } else {
            play('error');
            reduceScore(20);
            addLeakedData({ label: `Act 2 Failed: Q${currentQuestionIndex + 1}`, value: option.label });
            setFeedback({ type: 'error', message: currentQ.feedback.risk });

            // Simulate data theft progress
            setDownloadProgress(prev => Math.min(prev + 50, 100));
        }

        setTimeout(() => {
            setFeedback(null);
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                setCurrentStage('act3');
            }
        }, 3500);
    };

    if (!currentQ) return <div>LOADING_ACT_II...</div>;

    return (
        <div className="h-full flex flex-col max-w-2xl mx-auto pt-10 relative">
            <div className="mb-8 border-b border-neon-green/30 pb-4 flex justify-between items-end">
                <div>
                    <h2 className="text-xl font-bold text-neon-green/50">ACT II: INTRUSION</h2>
                    <p className="text-sm text-cyber-blue">NETWORK SECURITY PROTOCOLS</p>
                </div>
                <div className="text-right font-mono text-xs opacity-60">
                    SEQ: {currentQuestionIndex + 1}/{questions.length}
                </div>
            </div>

            {/* Downloading Overlay Scare */}
            {downloadProgress > 0 && (
                <div className="absolute top-0 right-0 p-4 w-48 border border-alert-red bg-deep-black/90 pointer-events-none transition-all">
                    <div className="text-alert-red text-xs font-bold animate-pulse mb-1">DOWNLOADING USER DATA...</div>
                    <div className="w-full bg-deep-black border border-alert-red h-2">
                        <div className="bg-alert-red h-full transition-all duration-1000" style={{ width: `${downloadProgress}%` }}></div>
                    </div>
                    <div className="text-right text-alert-red text-xs mt-1">{downloadProgress}%</div>
                </div>
            )}

            {feedback ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`flex-1 flex flex-col items-center justify-center text-center p-8 border-2 ${feedback.type === 'success' ? 'border-neon-green/50' : 'border-alert-red/50'}`}
                >
                    <h3 className={`text-3xl font-bold mb-4 ${feedback.type === 'success' ? 'text-neon-green' : 'text-alert-red'}`}>
                        <GlitchText text={feedback.type === 'success' ? 'CONNECTION SECURE' : 'PACKETS INTERCEPTED'} intense={feedback.type === 'error'} />
                    </h3>
                    <p className="font-mono text-lg">{feedback.message}</p>
                </motion.div>
            ) : (
                <div className="flex-1 flex flex-col justify-center space-y-8">
                    <div className="p-6 border-l-4 border-cyber-blue bg-deep-black/30">
                        <p className="font-mono text-xl">{currentQ.question}</p>
                    </div>

                    <div className="grid gap-3">
                        {currentQ.options.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(opt)}
                                className="p-4 border border-zinc-800 hover:border-cyber-blue hover:bg-cyber-blue/10 text-left transition-all"
                            >
                                <span className="text-cyber-blue mr-2">{`>>`}</span>
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Act2;

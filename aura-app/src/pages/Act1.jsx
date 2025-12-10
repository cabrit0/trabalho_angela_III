import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { SCENARIO_DATA } from '../data/scenario';
import GlitchText from '../components/effects/GlitchText';
import useSound from '../hooks/useSound';

const Act1 = () => {
    const { reduceScore, addLeakedData, setCurrentStage } = useGame();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: '' }
    const { play } = useSound();

    // Load questions for Act 1
    const questions = SCENARIO_DATA.act1;
    const currentQ = questions[currentQuestionIndex];

    const handleAnswer = (option) => {
        const isSafe = option.risk === currentQ.correctRisk;

        if (isSafe) {
            play('success');
            setFeedback({ type: 'success', message: currentQ.feedback.safe });
        } else {
            play('error');
            reduceScore(20);
            addLeakedData({ label: `Act 1 Failed: Q${currentQuestionIndex + 1}`, value: option.label });
            setFeedback({ type: 'error', message: currentQ.feedback.risk });
        }

        // Wait for feedback reading time before next question
        setTimeout(() => {
            setFeedback(null);
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                // End of Act 1 -> Move to Act 2 (or placeholder)
                setCurrentStage('act2');
            }
        }, 3000);
    };

    if (!currentQ) return <div className="p-10">LOADING_ACT_I...</div>;

    return (
        <div className="h-full flex flex-col max-w-2xl mx-auto pt-10">
            {/* Header */}
            <div className="mb-8 border-b border-neon-green/30 pb-4 flex justify-between items-end">
                <div>
                    <h2 className="text-xl font-bold text-neon-green/50">ACT I: SOCIAL ENGINEERING</h2>
                    <p className="text-sm text-cyber-blue">PHISHING PROTECTION PROTOCOLS</p>
                </div>
                <div className="text-right font-mono text-xs opacity-60">
                    SEQ: {currentQuestionIndex + 1}/{questions.length}
                </div>
            </div>

            {feedback ? (
                // FEEDBACK STATE
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`flex-1 flex flex-col items-center justify-center text-center p-8 border-2 ${feedback.type === 'success' ? 'border-neon-green bg-neon-green/10' : 'border-alert-red bg-alert-red/10'}`}
                >
                    <h3 className={`text-4xl font-bold mb-4 ${feedback.type === 'success' ? 'text-neon-green' : 'text-alert-red'}`}>
                        <GlitchText text={feedback.type === 'success' ? 'THREAT ELIMINATED' : 'SYSTEM BREACHED'} intense={feedback.type === 'error'} />
                    </h3>
                    <p className="text-xl font-mono">{feedback.message}</p>
                </motion.div>
            ) : (
                // QUESTION STATE
                <div className="flex-1 flex flex-col justify-center space-y-8">
                    <div className="bg-deep-black/50 border border-neon-green/30 p-6 shadow-[0_0_15px_rgba(0,255,65,0.1)]">
                        <p className="font-mono text-lg md:text-xl leading-relaxed">
                            {`> PENDING MESSAGE:`} <br />
                            <span className="text-white block mt-4">{currentQ.question}</span>
                        </p>
                    </div>

                    <div className="grid gap-4">
                        {currentQ.options.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(opt)}
                                className="group relative border border-neon-green/50 p-4 text-left hover:bg-neon-green/10 transition-colors"
                            >
                                <span className="absolute left-2 top-2 text-xs text-neon-green/30 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {`[OPTION_${idx}]`}
                                </span>
                                <span className="font-bold text-lg group-hover:pl-4 transition-all">
                                    {`> ${opt.label}`}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Act1;

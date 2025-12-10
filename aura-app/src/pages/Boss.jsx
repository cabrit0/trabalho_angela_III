import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import GlitchText from '../components/effects/GlitchText';
import useSound from '../hooks/useSound';

const Boss = () => {
    const { reduceScore, addLeakedData, setCurrentStage } = useGame();
    const [timeLeft, setTimeLeft] = useState(15); // 15 seconds for stress
    const [questionStep, setQuestionStep] = useState(0);
    const { play } = useSound();

    // Simple rapid-fire Logic (not in scenario.js to simulate "interruption")
    const bossQuestions = [
        { q: "QUANTO VALE A TUA PASSWORD?", a1: "ZERO", a2: "0.50€", a3: "TUDO O QUE TENS", correct: "a2" }, // surprising answer
        { q: "PODEMOS APAGAR TUDO AGORA?", a1: "SIM", a2: "NÃO", a3: "TALVEZ", correct: "a1" }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleTimeout();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleTimeout = () => {
        play('glitch');
        reduceScore(30);
        addLeakedData({ label: 'BOSS FAILED', value: 'TIME_OUT' });
        setCurrentStage('report');
    };

    const handleAnswer = (isCorrect) => {
        if (isCorrect) {
            play('success');
        } else {
            play('error');
            reduceScore(15);
            addLeakedData({ label: `Boss Q${questionStep + 1} Failed`, value: 'WRONG_ANSWER' });
        }

        if (questionStep < bossQuestions.length - 1) {
            setQuestionStep(prev => prev + 1);
        } else {
            setCurrentStage('report');
        }
    };

    const currentQ = bossQuestions[questionStep];

    return (
        <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto p-4 relative">
            {/* Background Pulse */}
            <div className="absolute inset-0 bg-alert-red opacity-10 animate-pulse pointer-events-none"></div>

            <div className="text-4xl md:text-6xl font-black text-alert-red mb-8 tracking-tighter text-center">
                <GlitchText text="FINAL CHALLENGE" intense={true} />
            </div>

            <div className="w-full h-4 bg-deep-black border border-alert-red mb-8 relative">
                <motion.div
                    className="h-full bg-alert-red"
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: 15, ease: 'linear' }}
                />
            </div>

            <div className="bg-deep-black/80 border-2 border-alert-red p-8 text-center w-full shadow-[0_0_30px_rgba(255,0,85,0.3)]">
                <h2 className="text-2xl font-bold mb-8">{currentQ.q}</h2>

                <div className="grid grid-cols-1 gap-4">
                    <button onClick={() => handleAnswer(currentQ.correct === 'a1')} className="btn-boss">{currentQ.a1}</button>
                    <button onClick={() => handleAnswer(currentQ.correct === 'a2')} className="btn-boss">{currentQ.a2}</button>
                    <button onClick={() => handleAnswer(currentQ.correct === 'a3')} className="btn-boss">{currentQ.a3}</button>
                </div>
            </div>

            <style>{`
         .btn-boss {
           @apply border border-alert-red py-4 text-xl font-bold hover:bg-alert-red hover:text-deep-black transition-colors;
         }
       `}</style>
        </div>
    );
};

export default Boss;

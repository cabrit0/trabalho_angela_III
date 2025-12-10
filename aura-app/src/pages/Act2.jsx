import React, { useState, useMemo } from 'react';
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

const Act2 = () => {
    const { reduceScore, increaseScore, addLeakedData, setCurrentStage, deviceData, trackAnswer, readClipboard } = useGame();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [showHack, setShowHack] = useState(false);
    const { play } = useSound();

    const questions = useMemo(() => getRandomQuestions(SCENARIO_DATA.act2, QUESTIONS_PER_ACT), []);
    const currentQ = questions[currentQuestionIndex];

    const shuffledOptions = useMemo(() =>
        currentQ ? shuffleOptions(currentQ.options) : [],
        [currentQ]
    );

    const handlePasteCheck = async () => {
        const text = await readClipboard();
        if (text) {
            alert(`[PASTEJACKING DEMO]\nCopied content: "${text.slice(0, 50)}..."\n\nAttacker could have modified this or stolen it!`);
        } else {
            alert("Clipboard empty or denied. Good security!");
        }
    };

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
                label: `[BREACH] ${currentQ.type.toUpperCase()}`,
                value: option.label
            });

            setFeedback({ type: 'error', message: currentQ.feedback.risk });
            setDownloadProgress(prev => Math.min(prev + 15, 100));
            setShowHack(true);

            setTimeout(() => setShowHack(false), 2000);
        }

        setTimeout(() => {
            setFeedback(null);
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                setCurrentStage('act3');
            }
        }, 4000);
    };

    if (!currentQ) return <div className="p-10 text-center">A carregar...</div>;

    return (
        <div className="h-full flex flex-col max-w-3xl mx-auto pt-6 relative">
            {/* Network Breach Overlay (Real Data) */}
            <AnimatePresence>
                {showHack && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-cyber-blue/20 z-50 flex items-center justify-center pointer-events-none"
                    >
                        <div className="text-center space-y-4 font-mono">
                            <motion.div
                                animate={{ opacity: [1, 0.5, 1] }}
                                transition={{ repeat: Infinity, duration: 0.2 }}
                                className="text-5xl md:text-7xl font-black text-cyber-blue"
                            >
                                ⚡ NETWORK BREACH
                            </motion.div>
                            <div className="text-lg text-white/80 space-y-2 bg-deep-black/80 p-6 border border-cyber-blue">
                                <p className="text-alert-red font-bold">⚠️ UNENCRYPTED TRAFFIC DETECTED</p>
                                <div className="text-left text-sm space-y-1 mt-4">
                                    <p>IP: <span className="text-cyber-blue">{deviceData.ip}</span></p>
                                    <p>ISP: <span className="text-cyber-blue">{deviceData.isp}</span></p>
                                    <p>LOCATION: <span className="text-cyber-blue">{deviceData.city}, {deviceData.country}</span></p>
                                    <p>LOCAL IP: <span className="text-cyber-blue">{deviceData.localIP || 'Scanning...'}</span></p>
                                    <p>OS: <span className="text-cyber-blue">{deviceData.os}</span></p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Download Progress - Always visible */}
            {downloadProgress > 0 && (
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="fixed top-0 right-0 m-4 w-64 border border-alert-red bg-deep-black/95 p-4 z-40"
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-alert-red font-bold animate-pulse">EXFILTRATING DATA...</span>
                        <span className="text-alert-red font-mono">{downloadProgress}%</span>
                    </div>
                    <div className="w-full h-3 bg-deep-black border border-alert-red">
                        <motion.div
                            className="h-full bg-alert-red"
                            animate={{ width: `${downloadProgress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                    <div className="mt-2 text-xs text-alert-red/60 font-mono">
                        {`> passwords.db`}<br />
                        {`> cookies.sqlite`}<br />
                        {`> history.json`}
                    </div>
                </motion.div>
            )}

            {/* Header */}
            <div className="mb-6 border-b border-cyber-blue/30 pb-4 flex justify-between items-end">
                <div>
                    <h2 className="text-xl font-bold text-cyber-blue/70">ACT II: NETWORK INTRUSION</h2>
                    <p className="text-sm text-neon-green/60">CONNECTIVITY & PASSWORD PROTOCOLS</p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-mono font-bold text-cyber-blue">
                        {currentQuestionIndex + 1}/{questions.length}
                    </div>
                </div>
            </div>

            {/* Progress */}
            <div className="w-full h-2 bg-deep-black border border-cyber-blue/30 mb-6">
                <motion.div
                    className="h-full bg-cyber-blue"
                    animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
            </div>

            {/* Hidden Clipboard Demo Button (Easter Egg / Demo) */}
            <button
                onClick={handlePasteCheck}
                className="absolute top-0 left-0 opacity-10 hover:opacity-100 text-[10px] text-cyber-blue border border-cyber-blue px-2 transition-all cursor-crosshair z-50"
                title="Test Clipboard Vulnerability"
            >
                [TEST_CLIPBOARD]
            </button>

            {feedback ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`flex-1 flex flex-col items-center justify-center text-center p-8 border-4 ${feedback.type === 'success'
                        ? 'border-neon-green bg-neon-green/10'
                        : 'border-alert-red bg-alert-red/10'
                        }`}
                >
                    <motion.h3
                        animate={feedback.type === 'error' ? { rotate: [-1, 1, -1, 1, 0] } : {}}
                        className={`text-3xl md:text-4xl font-black mb-6 ${feedback.type === 'success' ? 'text-neon-green' : 'text-alert-red'
                            }`}
                    >
                        <GlitchText
                            text={feedback.type === 'success' ? '🔒 CONNECTION SECURED' : '🔓 FIREWALL BYPASSED'}
                            intense={feedback.type === 'error'}
                        />
                    </motion.h3>
                    <p className="text-xl font-mono max-w-md">{feedback.message}</p>
                </motion.div>
            ) : (
                <div className="flex-1 flex flex-col justify-center space-y-6">
                    <motion.div
                        key={currentQ.id}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-deep-black/80 border-l-4 border-cyber-blue p-6"
                    >
                        <div className="text-xs text-cyber-blue mb-2 uppercase tracking-wider">
                            {`// SECURITY_CHECK: ${currentQ.type.toUpperCase()}`}
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
                                className="group border border-cyber-blue/40 p-4 text-left hover:border-cyber-blue hover:bg-cyber-blue/5 transition-all"
                            >
                                <span className="text-cyber-blue mr-3 font-mono">{`>>`}</span>
                                <span className="group-hover:text-cyber-blue transition-colors">{opt.label}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Act2;

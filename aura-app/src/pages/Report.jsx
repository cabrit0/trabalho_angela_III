import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import GlitchText from '../components/effects/GlitchText';
import IdentityScan from '../components/effects/IdentityScan';

const Report = () => {
    const {
        leakedData, securityScore, deviceData, resetGame,
        getDominantProfile, getRiskPercentage, getDarkWebValue,
        userData, getMaskedPassword
    } = useGame();
    const [showScan, setShowScan] = useState(true);
    const [showDebrief, setShowDebrief] = useState(false);

    const profile = getDominantProfile();
    const riskPercent = getRiskPercentage();
    const darkWebValue = getDarkWebValue();
    const maskedPw = getMaskedPassword();

    if (showScan) {
        return <IdentityScan onComplete={() => setShowScan(false)} />;
    }

    if (showDebrief) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 z-50 bg-white text-slate-800 overflow-y-auto"
            >
                <div className="min-h-full p-3 flex flex-col">
                    <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
                        <header className="text-center py-2">
                            <h1 className="text-xl font-bold text-blue-600">SIMULAÇÃO TERMINADA</h1>
                        </header>

                        <section className="bg-blue-50 p-2 mb-2 border border-blue-100 text-sm">
                            <span className="font-bold text-blue-800">🎉 Não entres em pânico!</span>
                            <span className="ml-1">Isto foi uma simulação. <strong>NENHUM</strong> dado foi roubado.</span>
                        </section>

                        <div className="grid grid-cols-2 gap-2 mb-2">
                            <div className="bg-slate-100 p-2 rounded text-center">
                                <span className="text-xs text-slate-500">Pontuação</span>
                                <span className={`block text-lg font-bold ${securityScore > 70 ? 'text-green-600' : 'text-red-600'}`}>
                                    {securityScore}/100
                                </span>
                            </div>
                            <div className="bg-slate-100 p-2 rounded text-center">
                                <span className="text-xs text-slate-500">Perfil</span>
                                <span className="block text-lg font-bold">{profile.emoji} {profile.name}</span>
                            </div>
                        </div>

                        {/* Errors list - LARGER visible area */}
                        {leakedData.length > 0 && (
                            <div className="flex-1 mb-2">
                                <h4 className="font-bold text-xs text-red-600 mb-1">Erros ({leakedData.length}):</h4>
                                <div className="h-48 overflow-y-auto border border-slate-200 rounded p-2 bg-slate-50">
                                    <ul className="space-y-0.5 text-xs text-slate-600">
                                        {leakedData.map((data, idx) => (
                                            <li key={idx} className="py-0.5 border-b border-slate-100">
                                                <span className="font-mono bg-red-100 text-red-700 px-1 rounded mr-1 text-[10px]">{data.label}</span>
                                                <span className="text-slate-700">{data.value}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Button - always visible at bottom */}
                        <div className="text-center py-3 bg-white sticky bottom-0">
                            <button
                                onClick={resetGame}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg text-lg"
                            >
                                TENTAR NOVAMENTE
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="h-full flex flex-col items-center justify-center p-4 overflow-y-auto">
            <motion.div
                className="text-center space-y-3 w-full max-w-md"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
            >
                <h1 className="text-3xl font-black text-alert-red">
                    <GlitchText text="IDENTITY SOLD" intense={true} />
                </h1>

                {/* Profile Card */}
                <div className={`border-2 ${profile.color?.replace('text-', 'border-') || 'border-alert-red'} bg-deep-black p-3`}>
                    <div className="text-3xl">{profile.emoji}</div>
                    <h2 className={`text-lg font-black ${profile.color || 'text-alert-red'}`}>{profile.name}</h2>
                    <p className="text-white/60 text-xs">{profile.description}</p>
                </div>

                {/* Scary User Data */}
                <div className="bg-alert-red/20 border border-alert-red p-3 font-mono text-xs text-left">
                    <div className="text-alert-red font-bold mb-1">⚠️ DADOS CAPTURADOS:</div>
                    <div className="space-y-1 text-white">
                        <p>USERNAME: <span className="text-alert-red">{userData.username || 'N/A'}</span></p>
                        <p>PASSWORD: <span className="text-alert-red">{maskedPw}</span></p>
                        <p>IP: <span className="text-neon-green">{deviceData.ip}</span></p>
                        <p>LOCALIZAÇÃO: <span className="text-neon-green">{deviceData.timezone}</span></p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                    <div className="bg-deep-black border border-white/20 p-2">
                        <div className="text-white/50">DATA</div>
                        <div className="text-white font-bold">{leakedData.length}</div>
                    </div>
                    <div className="bg-deep-black border border-alert-red p-2">
                        <div className="text-alert-red/50">RISCO</div>
                        <div className="text-alert-red font-bold">{riskPercent}%</div>
                    </div>
                    <div className="bg-deep-black border border-cyber-blue p-2">
                        <div className="text-cyber-blue/50">VALOR</div>
                        <div className="text-cyber-blue font-bold">{darkWebValue} BTC</div>
                    </div>
                </div>

                <p className="text-alert-red text-xs animate-pulse">
                    TRANSACTION COMPLETE...
                </p>

                <button
                    onClick={() => setShowDebrief(true)}
                    className="border border-neon-green text-neon-green hover:bg-neon-green hover:text-deep-black py-2 px-4 font-bold transition-all w-full text-sm"
                >
                    VER RELATÓRIO
                </button>
            </motion.div>
        </div>
    );
};

export default Report;

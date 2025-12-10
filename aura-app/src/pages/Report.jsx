import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import GlitchText from '../components/effects/GlitchText';

const Report = () => {
    const { leakedData, securityScore, deviceData, resetGame } = useGame();
    const [showDebrief, setShowDebrief] = useState(false);
    const [btcValue, setBtcValue] = useState(0);

    useEffect(() => {
        setBtcValue((leakedData.length * 0.005).toFixed(4));
    }, [leakedData]);

    if (showDebrief) {
        // --- DEBRIEFING (CLEAN UI) - Compact to fit screen ---
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 z-50 bg-white text-slate-800 p-4 flex flex-col"
            >
                <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
                    <header className="border-b border-slate-200 pb-2 text-center shrink-0">
                        <h1 className="text-2xl font-bold text-blue-600">SIMULAÇÃO TERMINADA</h1>
                        <p className="text-sm text-slate-500">Módulo de Cibersegurança: Diagnóstico Final</p>
                    </header>

                    <section className="bg-blue-50 p-3 my-3 border border-blue-100 shrink-0">
                        <h2 className="text-lg font-bold text-blue-800">Não entres em pânico.</h2>
                        <p className="text-sm">Isto foi apenas uma simulação ("AURA"). Nenhum dado teu foi realmente roubado ou vendido.</p>
                    </section>

                    <section className="flex-1 min-h-0 flex flex-col">
                        <div className="flex justify-between items-center text-sm p-2 bg-slate-100 rounded shrink-0">
                            <span>Pontuação de Segurança:</span>
                            <span className={`font-bold ${securityScore > 70 ? 'text-green-600' : 'text-red-600'}`}>
                                {securityScore}/100
                            </span>
                        </div>

                        {leakedData.length > 0 && (
                            <div className="mt-2 flex-1 min-h-0 flex flex-col">
                                <h4 className="font-bold text-sm text-red-600 mb-1 shrink-0">Erros Identificados:</h4>
                                <div className="flex-1 overflow-y-auto border border-slate-200 rounded p-2 bg-slate-50">
                                    <ul className="space-y-1 text-xs text-slate-600">
                                        {leakedData.map((data, idx) => (
                                            <li key={idx} className="flex gap-2">
                                                <span className="font-mono bg-slate-200 px-1 rounded shrink-0">{data.label}</span>
                                                <span className="truncate">{data.value}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </section>

                    <div className="text-center pt-3 shrink-0">
                        <button
                            onClick={resetGame}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full shadow transition-transform hover:scale-105"
                        >
                            REINICIAR SISTEMA
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    }

    // --- VICTIM REPORT (SCARY UI) - Compact ---
    return (
        <div className="h-full flex flex-col items-center justify-center p-4">
            <motion.div
                className="text-center space-y-4 w-full max-w-md"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
            >
                <h1 className="text-4xl font-black text-alert-red">
                    <GlitchText text="IDENTITY SOLD" intense={true} />
                </h1>

                <div className="bg-deep-black border border-alert-red/50 p-4 font-mono text-left space-y-2 text-sm">
                    <div className="flex justify-between border-b border-alert-red/30 pb-1">
                        <span className="text-gray-400">ITEM_ID:</span>
                        <span className="text-neon-green">#{Math.floor(Math.random() * 99999)}</span>
                    </div>
                    <div className="flex justify-between border-b border-alert-red/30 pb-1">
                        <span className="text-gray-400">DATA_POINTS:</span>
                        <span className="text-white">{leakedData.length} RECORDS</span>
                    </div>
                    <div className="flex justify-between border-b border-alert-red/30 pb-1">
                        <span className="text-gray-400">DEVICE:</span>
                        <span className="text-cyber-blue">{deviceData.os}</span>
                    </div>
                    <div className="py-2 text-center">
                        <div className="text-xs text-alert-red">MARKET VALUE</div>
                        <div className="text-3xl font-bold text-white">{btcValue} BTC</div>
                    </div>
                </div>

                <p className="text-red-500 text-xs animate-pulse">
                    TRANSFERRING ASSETS TO DARK_NET_WALLET...
                </p>

                <button
                    onClick={() => setShowDebrief(true)}
                    className="border border-neon-green text-neon-green hover:bg-neon-green hover:text-deep-black py-2 px-6 font-bold transition-all"
                >
                    VER RELATÓRIO COMPLETO
                </button>
            </motion.div>
        </div>
    );
};

export default Report;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import GlitchText from '../components/effects/GlitchText';
import TypewriterEffect from '../components/effects/TypewriterEffect';
import useSound from '../hooks/useSound';

const Report = () => {
    const { leakedData, securityScore, deviceData, resetGame } = useGame();
    const [showDebrief, setShowDebrief] = useState(false);
    const [btcValue, setBtcValue] = useState(0);

    // Calculate "Identity Value" based on failures
    React.useEffect(() => {
        setBtcValue((leakedData.length * 0.005).toFixed(4));
    }, [leakedData]);

    if (showDebrief) {
        // --- STATE 2: DEBRIEFING (CLEAN UI) ---
        return (
            <motion.div
                initial={{ opacity: 0, backgroundColor: '#ffffff' }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 z-50 bg-white text-slate-800 p-8 overflow-y-auto"
            >
                <div className="max-w-2xl mx-auto space-y-8">
                    <header className="border-b border-slate-200 pb-4 text-center">
                        <h1 className="text-3xl font-bold text-blue-600">SIMULAÇÃO TERMINADA</h1>
                        <p className="text-slate-500">Módulo de Cibersegurança: Diagnóstico Final</p>
                    </header>

                    <section className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                        <h2 className="text-xl font-bold mb-2 text-blue-800">Não entres em pânico.</h2>
                        <p>Isto foi apenas uma simulação ("AURA"). Nenhum dado teu foi realmente roubado ou vendido. O objetivo foi demonstrar quão fácil pode ser perder o controlo da tua identidade digital.</p>
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-lg font-bold border-l-4 border-slate-800 pl-3">Resumo da Performance</h3>
                        <div className="flex justify-between items-center text-sm p-3 bg-slate-100 rounded">
                            <span>Pontuação de Segurança:</span>
                            <span className={`font-bold ${securityScore > 70 ? 'text-green-600' : 'text-red-600'}`}>
                                {securityScore}/100
                            </span>
                        </div>

                        {leakedData.length > 0 && (
                            <div className="mt-4">
                                <h4 className="font-bold text-sm text-red-600 mb-2">Erros Identificados:</h4>
                                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600">
                                    {leakedData.map((data, idx) => (
                                        <li key={idx}>
                                            <span className="font-mono bg-slate-200 px-1 rounded text-xs mr-2">{data.label}</span>
                                            {data.value}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </section>

                    <div className="text-center pt-8">
                        <button
                            onClick={resetGame}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105"
                        >
                            REINICIAR SISTEMA
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    }

    // --- STATE 1: VICTIM REPORT (SCARY UI) ---
    return (
        <div className="h-full flex flex-col items-center justify-center max-w-xl mx-auto relative z-10">
            <motion.div
                className="text-center space-y-6 w-full"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
            >
                <h1 className="text-5xl font-black text-alert-red mb-2">
                    <GlitchText text="IDENTITY SOLD" intense={true} />
                </h1>

                <div className="bg-deep-black border border-alert-red/50 p-6 font-mono text-left space-y-4 shadow-[0_0_50px_rgba(255,0,0,0.2)]">
                    <div className="flex justify-between border-b border-alert-red/30 pb-2">
                        <span className="text-gray-400">ITEM_ID:</span>
                        <span className="text-neon-green">#USER_{Math.floor(Math.random() * 99999)}</span>
                    </div>
                    <div className="flex justify-between border-b border-alert-red/30 pb-2">
                        <span className="text-gray-400">DATA_POINTS:</span>
                        <span className="text-white">{leakedData.length} RECORDS</span>
                    </div>
                    <div className="flex justify-between border-b border-alert-red/30 pb-2">
                        <span className="text-gray-400">DEVICE_FINGERPRINT:</span>
                        <span className="text-cyber-blue text-xs max-w-[150px] truncate">{deviceData.userAgent}</span>
                    </div>

                    <div className="py-4 text-center">
                        <div className="text-xs text-alert-red mb-1">MARKET VALUE</div>
                        <div className="text-4xl font-bold text-white tracking-widest">{btcValue} BTC</div>
                    </div>
                </div>

                <p className="text-red-500 text-sm animate-pulse">
                    TRANSACTION COMPLETE... TRANSFERRING ASSETS TO DARK_NET_WALLET...
                </p>

                <button
                    onClick={() => setShowDebrief(true)}
                    className="mt-12 text-gray-500 hover:text-white underline text-xs transition-colors"
                >
                    [ EMERGENCY_SYSTEM_OVERRIDE ]
                </button>
            </motion.div>
        </div>
    );
};

export default Report;

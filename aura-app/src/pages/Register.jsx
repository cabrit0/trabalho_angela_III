import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import GlitchText from '../components/effects/GlitchText';

// Password strength calculator
const calculateStrength = (password) => {
    let score = 0;
    if (!password) return { score: 0, label: 'VAZIA', color: 'bg-gray-500' };

    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (password.length >= 14) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 2;
    if (/^[a-zA-Z]+$/.test(password)) score -= 1;
    if (/123|abc|password|qwerty/i.test(password)) score -= 2;

    score = Math.max(0, Math.min(score, 8));

    if (score <= 2) return { score, label: 'MUITO FRACA', color: 'bg-alert-red' };
    if (score <= 4) return { score, label: 'FRACA', color: 'bg-orange-500' };
    if (score <= 6) return { score, label: 'MÉDIA', color: 'bg-yellow-500' };
    return { score, label: 'FORTE', color: 'bg-neon-green' };
};

const Register = () => {
    const { setCurrentStage, addLeakedData, deviceData } = useGame();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const strength = useMemo(() => calculateStrength(password), [password]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!username.trim()) return;

        setIsLoading(true);
        addLeakedData({ label: 'Username Registado', value: username });
        addLeakedData({ label: 'Força da Password', value: strength.label });
        addLeakedData({ label: 'Sistema Operativo', value: deviceData.os });
        addLeakedData({ label: 'Browser', value: deviceData.browser });

        setTimeout(() => {
            setCurrentStage('act1');
        }, 1500);
    };

    if (isLoading) {
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="w-12 h-12 border-4 border-neon-green border-t-transparent rounded-full"
                />
                <p className="mt-4 font-mono text-neon-green">{`> Iniciando sessão...`}</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col items-center justify-center p-4">
            {/* Compact Warning */}
            <div className="w-full max-w-md mb-4 bg-cyber-blue/20 border border-cyber-blue p-2 text-center text-xs">
                <span className="text-cyber-blue font-bold">⚠️ AVISO:</span>
                <span className="text-white ml-1">NÃO uses dados reais! Inventa credenciais FICTÍCIAS.</span>
            </div>

            <div className="w-full max-w-md">
                {/* Header - Compact */}
                <header className="text-center mb-4">
                    <h1 className="text-4xl font-black text-neon-green">
                        <GlitchText text="AURA" />
                    </h1>
                    <p className="text-sm text-neon-green/60">THE DIGITAL MIRROR</p>
                </header>

                {/* Form - Compact */}
                <form onSubmit={handleSubmit} className="space-y-3 bg-deep-black/50 border border-neon-green/30 p-4">
                    <div className="border-b border-neon-green/20 pb-2 mb-2">
                        <h2 className="text-lg font-bold text-neon-green">REGISTO DE SUJEITO</h2>
                        <p className="text-xs text-neon-green/50">Use SEMPRE dados fictícios.</p>
                    </div>

                    {/* Username */}
                    <div>
                        <label className="block text-xs text-neon-green/70 mb-1">{`> USERNAME (FICTÍCIO)`}</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="ex: CyberNinja_2025"
                            className="w-full bg-deep-black border border-neon-green/50 py-2 px-3 text-neon-green placeholder-neon-green/30 focus:border-neon-green focus:outline-none font-mono"
                            autoComplete="off"
                            autoFocus
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-xs text-neon-green/70 mb-1">{`> PASSWORD (INVENTADA)`}</label>
                        <input
                            type="text"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="ex: Simula@2025#Teste"
                            className="w-full bg-deep-black border border-neon-green/50 py-2 px-3 text-neon-green placeholder-neon-green/30 focus:border-neon-green focus:outline-none font-mono"
                            autoComplete="off"
                        />

                        {/* Compact Strength Meter */}
                        <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs text-neon-green/50">FORÇA:</span>
                            <div className="flex-1 h-2 bg-deep-black border border-neon-green/30">
                                <motion.div
                                    className={`h-full ${strength.color}`}
                                    animate={{ width: `${(strength.score / 8) * 100}%` }}
                                />
                            </div>
                            <span className={`text-xs font-bold ${strength.score <= 2 ? 'text-alert-red' : strength.score <= 4 ? 'text-orange-500' : strength.score <= 6 ? 'text-yellow-500' : 'text-neon-green'}`}>
                                {strength.label}
                            </span>
                        </div>
                    </div>

                    {/* Info - Compact */}
                    <div className="bg-cyber-blue/10 border border-cyber-blue/30 p-2 text-xs text-cyber-blue">
                        🔒 A password NÃO é guardada. Apenas analisamos a força.
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={!username.trim()}
                        className="w-full border-2 border-neon-green text-neon-green hover:bg-neon-green hover:text-deep-black disabled:opacity-30 py-3 font-bold tracking-widest transition-all uppercase"
                    >
                        INICIAR SIMULAÇÃO »
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;

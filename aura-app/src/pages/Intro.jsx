import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import GlitchText from '../components/effects/GlitchText';
import TypewriterEffect from '../components/effects/TypewriterEffect';
import useSound from '../hooks/useSound';

const Intro = () => {
    const { setCurrentStage, deviceData, addLeakedData } = useGame();
    const [nickname, setNickname] = useState('');
    const [isHacking, setIsHacking] = useState(false);
    const { play } = useSound();

    const handleLogin = (e) => {
        e.preventDefault();
        if (!nickname.trim()) return;

        setIsHacking(true);
        play('glitch'); // Play glitch sound (if available)

        // Capture the name as the first "leaked" data
        addLeakedData({ label: 'Subject Name', value: nickname });

        // Simulate "Hacking" sequence duration before moving to Act 1
        setTimeout(() => {
            setCurrentStage('act1');
        }, 4000);
    };

    if (isHacking) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                <motion.div
                    animate={{ x: [-5, 5, -5, 5, 0], opacity: [1, 0.8, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="text-4xl text-alert-red font-bold"
                >
                    <GlitchText text="ACCESS GRANTED" intense={true} />
                </motion.div>

                <div className="text-left font-mono space-y-2 text-neon-green/80 text-sm md:text-base border border-neon-green/30 p-4 bg-deep-black/50 backdrop-blur-sm">
                    <p>{`> SUBJECT: ${nickname}`}</p>
                    <p>{`> OS KERNEL: ${deviceData.os}`}</p>
                    <p>{`> BROWSER: ${deviceData.browser}`}</p>
                    <p>{`> BATTERY: ${deviceData.battery}`}</p>
                    <p>{`> IP ADDR: ${deviceData.ip}`}</p>
                    <p className="animate-pulse text-alert-red">{`> INJECTING PAYLOAD...`}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto">
            <div className="mb-8 text-center space-y-2">
                <h1 className="text-3xl md:text-5xl font-bold mb-2">
                    <GlitchText text="AURA" />
                </h1>
                <p className="text-sm md:text-base text-neon-green/70">
                    <TypewriterEffect text="THE DIGITAL MIRROR // SYSTEM CALIBRATION" speed={30} />
                </p>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-6">
                <div className="relative group">
                    <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="ENTER USERNAME"
                        className="w-full bg-transparent border-b-2 border-neon-green/30 py-2 px-4 text-center text-xl outline-none focus:border-neon-green transition-colors placeholder-neon-green/30 uppercase"
                        autoFocus
                    />
                    <div className="absolute inset-0 bg-neon-green/5 blur-md -z-10 opacity-0 group-focus-within:opacity-100 transition-opacity" />
                </div>

                <button
                    type="submit"
                    className="w-full border border-neon-green text-neon-green hover:bg-neon-green hover:text-deep-black py-3 px-6 font-bold tracking-widest transition-all uppercase flex items-center justify-center gap-2 group"
                >
                    <span>INITIALIZE</span>
                    <span className="group-hover:translate-x-1 transition-transform">{`>`}</span>
                </button>
            </form>

            <div className="mt-12 text-xs text-center opacity-30">
                <p>SECURE CONNECTION: UNVERIFIED</p>
                <p>ENCRYPTION: NONE</p>
            </div>
        </div>
    );
};

export default Intro;

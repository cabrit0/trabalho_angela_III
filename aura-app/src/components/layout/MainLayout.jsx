import React from 'react';
import CRTVignette from '../effects/CRTVignette';

const MainLayout = ({ children }) => {
    return (
        <div className="relative min-h-screen w-full bg-deep-black text-neon-green font-mono overflow-hidden selection:bg-neon-green selection:text-deep-black">
            {/* Background Noise/Texture (Optional separate component later) */}
            <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none mix-blend-overlay" />

            {/* CRT Overlay Effects */}
            <CRTVignette />

            {/* Main Content Area */}
            <div className="relative z-10 container mx-auto px-4 py-6 h-full flex flex-col">
                {children}
            </div>
        </div>
    );
};

export default MainLayout;

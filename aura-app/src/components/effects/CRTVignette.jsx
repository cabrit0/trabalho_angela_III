import React from 'react';

const CRTVignette = () => {
    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {/* Scanlines Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none opacity-60" />

            {/* Vignette Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />

            {/* Subtle Screen Flicker (Optional, can be animated later) */}
            <div className="absolute inset-0 bg-white/2 opacity-[0.02] mix-blend-overlay animate-pulse pointer-events-none" />
        </div>
    );
};

export default CRTVignette;

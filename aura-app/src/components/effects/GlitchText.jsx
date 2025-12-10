import React from 'react';
import { motion } from 'framer-motion';

const GlitchText = ({ text, as: Component = 'span', className = '', intense = false }) => {
    return (
        <Component className={`relative inline-block ${className}`}>
            {/* Main Text */}
            <span className="relative z-10">{text}</span>

            {/* Glitch Layer 1 (Red Shift) */}
            <motion.span
                className="absolute top-0 left-0 -z-10 w-full h-full text-alert-red opacity-70"
                animate={{
                    x: [0, -2, 2, -1, 0],
                    y: [0, 1, -1, 0],
                }}
                transition={{
                    repeat: Infinity,
                    duration: intense ? 0.2 : 2,
                    repeatType: "mirror",
                    repeatDelay: intense ? 0 : 3
                }}
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)' }}
            >
                {text}
            </motion.span>

            {/* Glitch Layer 2 (Blue Shift) */}
            <motion.span
                className="absolute top-0 left-0 -z-10 w-full h-full text-cyber-blue opacity-70"
                animate={{
                    x: [0, 2, -2, 1, 0],
                    y: [0, -1, 1, 0],
                }}
                transition={{
                    repeat: Infinity,
                    duration: intense ? 0.2 : 2.5,
                    repeatType: "mirror",
                    repeatDelay: intense ? 0 : 4
                }}
                style={{ clipPath: 'polygon(0 80%, 100% 20%, 100% 100%, 0 100%)' }}
            >
                {text}
            </motion.span>
        </Component>
    );
};

export default GlitchText;

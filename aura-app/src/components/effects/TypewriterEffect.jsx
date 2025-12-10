import React from 'react';
import useTypewriter from '../../hooks/useTypewriter';

const TypewriterEffect = ({ text, speed = 50, startDelay = 0, className = '', onComplete }) => {
    const { displayedText, isDone } = useTypewriter(text, speed, startDelay);

    React.useEffect(() => {
        if (isDone && onComplete) {
            onComplete();
        }
    }, [isDone, onComplete]);

    return (
        <span className={`${className} font-mono`}>
            {displayedText}
            <span className="animate-pulse inline-block w-2.5 h-5 bg-neon-green ml-1 align-middle">

            </span>
        </span>
    );
};

export default TypewriterEffect;

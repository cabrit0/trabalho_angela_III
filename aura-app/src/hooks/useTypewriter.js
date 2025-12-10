import { useState, useEffect } from 'react';

const useTypewriter = (text, speed = 50, startDelay = 0) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isDone, setIsDone] = useState(false);

    useEffect(() => {
        let timeoutId;
        let currentIndex = 0;

        const startTyping = () => {
            setIsTyping(true);
            const typeChar = () => {
                if (currentIndex < text.length) {
                    setDisplayedText((prev) => prev + text.charAt(currentIndex));
                    currentIndex++;
                    // Randomize speed slightly for human feel
                    const variance = Math.random() * 30;
                    timeoutId = setTimeout(typeChar, speed + variance);
                } else {
                    setIsTyping(false);
                    setIsDone(true);
                }
            };
            typeChar();
        };

        if (startDelay > 0) {
            timeoutId = setTimeout(startTyping, startDelay);
        } else {
            startTyping();
        }

        return () => clearTimeout(timeoutId);
    }, [text, speed, startDelay]);

    return { displayedText, isTyping, isDone };
};

export default useTypewriter;

import { useCallback, useRef } from 'react';

// Sound system with graceful fallback when files don't exist
const useSound = () => {
    const audioCache = useRef({});

    const play = useCallback((soundName, options = {}) => {
        // For now, we'll use Web Audio API beeps as fallback
        // This prevents console errors when sound files don't exist
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Different frequencies for different sounds
            const frequencies = {
                click: 800,
                success: 523.25, // C5
                error: 200,
                glitch: 150,
            };

            oscillator.frequency.value = frequencies[soundName] || 440;
            oscillator.type = soundName === 'error' ? 'sawtooth' : 'sine';

            gainNode.gain.setValueAtTime(options.volume || 0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            // Silently fail if audio context isn't available
            console.debug('Audio not available:', e.message);
        }
    }, []);

    const stop = useCallback(() => {
        // No-op for simple beeps
    }, []);

    return { play, stop };
};

export default useSound;

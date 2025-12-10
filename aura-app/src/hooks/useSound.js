import { useEffect, useRef, useCallback } from 'react';
import { Howl } from 'howler';

// Placeholder paths - real files need to be added to src/assets/sounds/
const SOUND_PATHS = {
    click: '/sounds/click.mp3', // Keystroke
    error: '/sounds/error.mp3', // Harsh buzz
    glitch: '/sounds/glitch.mp3', // Digital tearing
    success: '/sounds/success.mp3', // Chime
    hum: '/sounds/hum.mp3', // Ambient bg
};

const useSound = () => {
    const sounds = useRef({});

    useEffect(() => {
        // Preload sounds
        Object.entries(SOUND_PATHS).forEach(([key, src]) => {
            sounds.current[key] = new Howl({
                src: [src],
                volume: 0.5,
                preload: true,
            });
        });

        // Start Ambient Hum loop
        // sounds.current.hum.loop(true).play();

        return () => {
            // Cleanup
            Object.values(sounds.current).forEach(sound => sound.unload());
        };
    }, []);

    const play = useCallback((soundName, options = {}) => {
        const sound = sounds.current[soundName];
        if (sound) {
            if (options.volume) sound.volume(options.volume);
            if (options.rate) sound.rate(options.rate);
            sound.play();
        }
    }, []);

    const stop = useCallback((soundName) => {
        const sound = sounds.current[soundName];
        if (sound) sound.stop();
    }, []);

    return { play, stop };
};

export default useSound;

const STORAGE_KEY = 'aura_session_v1';

export const saveProgress = (data) => {
    try {
        const serialized = JSON.stringify(data);
        localStorage.setItem(STORAGE_KEY, serialized);
    } catch (e) {
        console.error('Storage save failed:', e);
    }
};

export const loadProgress = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        return null;
    }
};

export const clearSession = () => {
    localStorage.removeItem(STORAGE_KEY);
};

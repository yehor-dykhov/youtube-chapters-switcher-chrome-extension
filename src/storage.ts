import { Chapter } from 'get-youtube-chapters';

enum LocalStorageKeys {
    ACTIVE_ID = 'active_id',
    CHAPTERS = 'chapters',
    CURRENT_TIME = 'current_time',
    DURATION = 'duration',
}

const setChapters = (id: string, chapters: Chapter[]): Promise<void> => {
    return new Promise<void>((resolve) => {
        chrome.storage.local.set({ [`${LocalStorageKeys.CHAPTERS}-${id}`]: chapters }, () => {
            resolve();
        });
    });
};

const getChapters = (id: string): Promise<Chapter[]> => {
    return new Promise<Chapter[]>((resolve) => {
        const key = `${LocalStorageKeys.CHAPTERS}-${id}`;
    
        chrome.storage.local.get([key], (result) => {
            resolve(result[key]);
        });
    });
};

const setCurrentTime = (id: string, time: number): Promise<void> => {
    return new Promise<void>((resolve) => {
        chrome.storage.local.set({ [`${LocalStorageKeys.CURRENT_TIME}-${id}`]: time }, () => {
            resolve();
        });
    });
};

const getCurrentTime = (id: string): Promise<number> => {
    return new Promise<number>((resolve) => {
        const key = `${LocalStorageKeys.CURRENT_TIME}-${id}`;

        chrome.storage.local.get([key], (result) => {
            resolve(result[key] || 0);
        });
    });
};

const setDuration = (id: string, duration: number): Promise<void> => {
    return new Promise<void>((resolve) => {
        chrome.storage.local.set({ [`${LocalStorageKeys.DURATION}-${id}`]: duration }, () => {
            resolve();
        });
    });
};

const getDuration = (id: string): Promise<number> => {
    return new Promise<number>((resolve) => {
        const key = `${LocalStorageKeys.DURATION}-${id}`;

        chrome.storage.local.get([key], (result) => {
            resolve(result[key] || 0);
        });
    });
};

const setActiveVideoId = (id: string | null): Promise<void> => {
    return new Promise<void>((resolve) => {
        chrome.storage.local.set({ [LocalStorageKeys.ACTIVE_ID]: id }, () => {
            resolve();
        });
    });
};

const getActiveVideoId = (): Promise<string | null> => {
    return new Promise<string>((resolve) => {
        chrome.storage.local.get([LocalStorageKeys.ACTIVE_ID], (result) => {
            resolve(result[LocalStorageKeys.ACTIVE_ID]);
        });
    });
};

const cleanUpStorage = async () => {
    await chrome.storage.local.clear();
};

export default {
    setChapters,
    getChapters,
    setCurrentTime,
    getCurrentTime,
    setDuration,
    getDuration,
    setActiveVideoId,
    getActiveVideoId,
    cleanUpStorage
};

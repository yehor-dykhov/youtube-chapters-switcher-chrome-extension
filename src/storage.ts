import { Chapter } from 'get-youtube-chapters';

enum LocalStorageKeys {
    CHAPTERS = 'chapters',
    CURRENT_TIME = 'current_time',
    DURATION = 'duration',
}

const setChapters = (chapters: Chapter[]): Promise<void> => {
    return new Promise<void>((resolve) => {
        chrome.storage.local.set({ [LocalStorageKeys.CHAPTERS]: chapters }, () => {
            resolve();
        });
    });
};

const getChapters = (): Promise<Chapter[]> => {
    return new Promise<Chapter[]>((resolve) => {
        chrome.storage.local.get([LocalStorageKeys.CHAPTERS], (result) => {
            resolve(result[LocalStorageKeys.CHAPTERS]);
        });
    });
};

const setCurrentTime = (time: number): Promise<void> => {
    return new Promise<void>((resolve) => {
        chrome.storage.local.set({ [LocalStorageKeys.CURRENT_TIME]: time }, () => {
            resolve();
        });
    });
};

const getCurrentTime = (): Promise<number> => {
    return new Promise<number>((resolve) => {
        chrome.storage.local.get([LocalStorageKeys.CURRENT_TIME], (result) => {
            resolve(result[LocalStorageKeys.CURRENT_TIME] || 0);
        });
    });
};

const setDuration = (duration: number): Promise<void> => {
    return new Promise<void>((resolve) => {
        chrome.storage.local.set({ [LocalStorageKeys.DURATION]: duration }, () => {
            resolve();
        });
    });
};

const getDuration = (): Promise<number> => {
    return new Promise<number>((resolve) => {
        chrome.storage.local.get([LocalStorageKeys.DURATION], (result) => {
            resolve(result[LocalStorageKeys.DURATION] || 0);
        });
    });
};

// export const setOptionsToStorage = (options: IOptions): Promise<void> => {
//     return new Promise<void>((resolve) => {
//         chrome.storage.local.set(
//             {
//                 ...(options.units && { [LocalStorageKeys.UNITS]: options.units }),
//                 ...(options.homeCity !== undefined && { [LocalStorageKeys.HOME_CITY]: options.homeCity }),
//                 ...(options.overlayPopup !== undefined && { [LocalStorageKeys.OVERLAY_POPUP]: options.overlayPopup }),
//             },
//             () => resolve()
//         );
//     });
// };

// export const getOptionsFromStorage = (): Promise<IOptions> => {
//     return new Promise<IOptions>((resolve) => {
//         chrome.storage.local.get(
//             [LocalStorageKeys.UNITS, LocalStorageKeys.HOME_CITY, LocalStorageKeys.OVERLAY_POPUP],
//             (result: IOptions) => {
//                 resolve(result);
//             }
//         );
//     });
// };

export default {
    setChapters,
    getChapters,
    setCurrentTime,
    getCurrentTime,
    setDuration,
    getDuration
};

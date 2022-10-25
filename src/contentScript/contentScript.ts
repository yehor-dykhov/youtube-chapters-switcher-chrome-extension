import getYoutubeVideoId from 'get-youtube-id';
import getChapters, { Chapter } from 'get-youtube-chapters';
import throttle from 'lodash.throttle';

import { MESSAGES } from '../constants';
import { getVideoData } from '../helpers';
import Storage from '../storage';
import { Player } from '../player';
import { IIconDetails } from '../types';

const player = new Player();

const getVideoChapters = async (videoId: string) => {
    const videoData = await getVideoData(videoId, process.env['YOUTUBE_API_KEY']);

    let chapters = [];

    if (videoData?.description) {
        chapters = getChapters(videoData?.description);
    }

    return chapters;
};

const changeIconActivity = (isActive) => {
    chrome.runtime.sendMessage({ message: MESSAGES.CHANGE_ACTIVE_ICON, isActive });
};

const changeIconText = (count: number) => {
    chrome.runtime.sendMessage({ message: MESSAGES.CHANGE_ICON_TEXT, count });
};

const handleCurrentTimeChange = throttle((e) => {
    const videoId = getYoutubeVideoId(window.location.href);
    Storage.setCurrentTime(videoId, e.target.currentTime);
}, 1000);

const initializeData = (videoId: string, chapters: Chapter[]) => {
    if (chapters.length > 0) {
        Storage.setChapters(videoId, chapters);

        player.init(handleCurrentTimeChange);

        Storage.setDuration(videoId, player.duration);

        return;
    }

    Storage.setChapters(videoId, []);
};

const changeIconDetails = ({ isActive = false, count = 0 }: IIconDetails) => {
    changeIconActivity(isActive);
    changeIconText(count);
};

const initializeChapters = async (href: string) => {
    changeIconDetails({});

    let chapters = [];
    const videoId = getYoutubeVideoId(href);

    if (!Boolean(videoId)) {
        changeIconDetails({});
        Storage.setActiveVideoId(null);
    }

    try {
        chapters = await getVideoChapters(videoId);
    } catch (e) {
        console.log('==>ERROR of getting chapters:, ', e);
    }

    changeIconDetails({ isActive: Boolean(chapters.length), count: chapters.length });

    Storage.setActiveVideoId(videoId);

    initializeData(videoId, chapters);
};

window.addEventListener('load', async (event) => {
    initializeChapters(window.location.href);
});

chrome.runtime.onMessage.addListener(async (request) => {
    const { message, url, chapterChangeData } = request;

    if (message === MESSAGES.CHANGE_URL) {
        initializeChapters(url);
    }

    if (message === MESSAGES.CHANGE_CHAPTER && !isNaN(chapterChangeData?.step)) {
        const videoId = getYoutubeVideoId(window.location.href);

        Storage.getChapters(videoId).then((chs) => {
            if (chs.length === 0) {
                return;
            }

            const currentTime = player.currentTime;
            const duration = player.duration;
            let currentIndex: number;

            chs.forEach((ch, index) => {
                if (
                    (index === chs.length - 1 && currentTime >= ch.start && currentTime <= duration) ||
                    (currentTime >= ch.start && currentTime < chs[index + 1]?.start)
                ) {
                    currentIndex = index;
                }
            });

            if (currentTime === duration && chapterChangeData.step === 1) {
                return;
            }

            if (currentIndex === chs.length - 1 && chapterChangeData.step === 1) {
                player.currentTime = duration;
                return;
            }

            if (currentIndex === 0 && chapterChangeData.step === -1) {
                player.currentTime = chs[currentIndex].start;
                return;
            }

            player.currentTime = chs[currentIndex + chapterChangeData.step].start;
        });
    }

    if (message === MESSAGES.CHANGE_CHAPTER && !isNaN(chapterChangeData?.time)) {
        player.currentTime = chapterChangeData.time;
    }

    if (message === MESSAGES.CHANGE_ACTIVE_TAB) {
        const videoId = getYoutubeVideoId(window.location.href);

        Storage.setActiveVideoId(videoId);
    }
});

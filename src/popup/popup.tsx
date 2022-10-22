import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Chapter } from 'get-youtube-chapters';

import Storage from '../storage';

import './popup.css';
import { containsTimeChapter } from '../helpers';
import { MESSAGES } from '../constants';
import { IChapterChangeData } from '../types';

const changeChapter = (chapterChangeData: IChapterChangeData) => {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { message: MESSAGES.CHANGE_CHAPTER, chapterChangeData });
    });
};

const App: React.FC<{}> = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const videoIdRef = useRef<string>();
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);

    useEffect(() => {
        Storage.getActiveVideoId()
            .then((id) => {
                videoIdRef.current = id;
                Storage.getChapters(id).then((chs) => setChapters(chs));
                Storage.getDuration(id).then((time) => setDuration(time));
                Storage.getCurrentTime(id).then((time) => setCurrentTime(time));
            })
            .catch(() => {
                setChapters([]);
                setDuration(0);
                setCurrentTime(0);
            });

        setLoading(false);

        const timer = setInterval(() => {
            Storage.getCurrentTime(videoIdRef.current).then((time) => {
                setCurrentTime(time);
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handlePreviousClick = () => changeChapter({ step: -1 });

    const handleNextClick = () => changeChapter({ step: 1 });

    const handleChapterClick = (chapter: Chapter) => {
        changeChapter({ time: chapter.start });
        Storage.setCurrentTime(videoIdRef.current, chapter.start).then(() => setCurrentTime(chapter.start));
    };

    return (
        <div className='content'>
            <div className='buttons'>
                <button onClick={handlePreviousClick}>prev</button>
                <button onClick={handleNextClick}>next</button>
            </div>
            {loading && <h5>Loading</h5>}
            {!loading && (
                <div className='chapters'>
                    {chapters.map((ch) => (
                        <p
                            key={`${ch.title}_${ch.start}`}
                            className={
                                containsTimeChapter(chapters, ch, currentTime, duration)
                                    ? 'chapter selected'
                                    : 'chapter'
                            }
                            onClick={() => handleChapterClick(ch)}
                        >
                            {ch.title}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
};

const container = document.createElement('div');
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);

import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Chapter } from 'get-youtube-chapters';

import Storage from '../storage';

import './popup.css';
import { containsTimeChapter } from '../helpers';
import { MESSAGES } from '../constants';

const changeChapter = (step: number) => {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { message: MESSAGES.CHANGE_CHAPTER, step });
    });
};

const App: React.FC<{}> = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);

    useEffect(() => {
        Storage.getChapters().then((chs) => setChapters(chs));
        Storage.getDuration().then((time) => setDuration(time));
        Storage.getCurrentTime().then((time) => setCurrentTime(time));
        setLoading(false);

        const timer = setInterval(() => {
            Storage.getCurrentTime().then((time) => {
                setCurrentTime(time);
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handlePreviousClick = () => changeChapter(-1);
    const handleNextClick = () => changeChapter(1);

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
                            className={
                                containsTimeChapter(chapters, ch, currentTime, duration)
                                    ? 'chapter selected'
                                    : 'chapter'
                            }
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

import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Chapter } from 'get-youtube-chapters';

import { Button } from '@rmwc/button';
import '@rmwc/button/styles';
import { Typography } from '@rmwc/typography';
import '@rmwc/typography/styles';
import { List, ListItem } from '@rmwc/list';
import '@rmwc/list/styles';

import Storage from '../storage';
import './popup.css';
import { containsTimeChapter } from '../helpers';
import { MAC_OS, MESSAGES } from '../constants';
import { IChapterChangeData } from '../types';

const changeChapter = (chapterChangeData: IChapterChangeData) => {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { message: MESSAGES.CHANGE_CHAPTER, chapterChangeData });
    });
};

const App: React.FC<{}> = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const leaveTimerRef = useRef<number>();
    const videoIdRef = useRef<string>();
    const wasActionFiredRef = useRef<boolean>(false);
    const [isMac, setIsMac] = useState<boolean>(false);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);

    useEffect(() => {
        chrome.runtime.getPlatformInfo(function (info) {
            setIsMac(info.os === MAC_OS);
        });

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

    const handlePreviousClick = () => {
        changeChapter({ step: -1 });
        wasActionFiredRef.current = true;
    };

    const handleNextClick = () => {
        changeChapter({ step: 1 });
        wasActionFiredRef.current = true;
    };

    const handleChapterClick = (chapter: Chapter) => {
        changeChapter({ time: chapter.start });
        Storage.setCurrentTime(videoIdRef.current, chapter.start).then(() => setCurrentTime(chapter.start));
        wasActionFiredRef.current = true;
    };

    const handleMouseLeavePopup = () => {
        if (wasActionFiredRef.current) {
            leaveTimerRef.current = setTimeout(() => window.close(), 1000) as unknown as number;
        }
    };

    const handleMouseHoverPopup = () => {
        if (leaveTimerRef.current) {
            clearTimeout(leaveTimerRef.current);
            leaveTimerRef.current = null;
            wasActionFiredRef.current = false;
        }
    };
    
    return (
        <div onMouseLeave={handleMouseLeavePopup} onMouseOver={handleMouseHoverPopup} className='content'>
            <div className='buttons'>
                <Typography className='hint' use='caption'>{isMac ? 'Shift + Command + Left' : 'Shift + Alt + Left'}</Typography>
                <Button onClick={handlePreviousClick} label='prev' unelevated />
                <Button onClick={handleNextClick} label='next' unelevated />
                <Typography className='hint' use='caption'>{isMac ? 'Shift + Command + Right' : 'Shift + Alt + Right'}</Typography>
            </div>
            <div className='divider' />
            {!loading && (
                <div className='chapters'>
                    <List dense>
                        {chapters.map((ch) => (
                            <ListItem
                                selected={containsTimeChapter(chapters, ch, currentTime, duration)}
                                onClick={() => handleChapterClick(ch)}
                            >
                                {ch.title}
                            </ListItem>
                        ))}
                    </List>
                </div>
            )}
        </div>
    );
};

const container = document.createElement('div');
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);

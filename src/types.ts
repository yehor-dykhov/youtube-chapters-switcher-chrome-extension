import { Chapter } from 'get-youtube-chapters';

export enum LocalStorageKeys {
    ACTIVE_ID = 'active_id',
    CHAPTERS = 'chapters',
    CURRENT_TIME = 'current_time',
    DURATION = 'duration',
}

export enum IdleState {
    ACTIVE = "active",
    IDLE = "idle",
    LOCKED = "locked",
}

export type YoutubeVideoInfo = {
    description: string;
    title: string;
};

type YoutubeBodyItems = {
    snippet: YoutubeVideoInfo;
};

export type YoutubeBody = {
    items: YoutubeBodyItems[];
    error?: Error;
};

export interface IIconDetails {
    isActive?: boolean;
    count?: number;
}

export interface IChapterChangeData {
    step?: number;
    time?: number;
}

export type VideoStorageData = {
    [LocalStorageKeys.CHAPTERS]?: Chapter[];
    [LocalStorageKeys.CURRENT_TIME]?: number;
    [LocalStorageKeys.DURATION]?: number;
};

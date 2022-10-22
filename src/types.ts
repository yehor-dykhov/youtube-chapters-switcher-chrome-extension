export type YoutubeVideoInfo = {
    description: string;
    title: string;
};

type YoutubeBodyItems = {
    snippet: YoutubeVideoInfo;
};

export type YoutubeBody = {
    items: YoutubeBodyItems[];
    error?: Error
};

export interface IIconDetails {
    isActive?: boolean,
    count?: number,
}

export interface IChapterChangeData {
    step?: number,
    time?: number
}
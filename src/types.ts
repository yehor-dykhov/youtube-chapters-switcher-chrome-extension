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

export type IconDetails = {
    isActive?: boolean;
    count?: number;
}
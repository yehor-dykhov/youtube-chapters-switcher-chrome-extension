export type YoutubeVideoInfo = {
    description: string;
    title: string;
};

type YoutubeBodyItems = {
    snippet: YoutubeVideoInfo;
};

export type YoutubeBody = {
    items: YoutubeBodyItems[];
};

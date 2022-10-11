import { COMMANDS, MESSAGES } from '../constants';

const runCommand = (step: number) => {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { message: MESSAGES.CHANGE_CHAPTER, step });
    });
};

chrome.commands.onCommand.addListener((command) => {
    switch (command) {
        case COMMANDS.NEXT_CHAPTER: {
            runCommand(1);
            break;
        }
        case COMMANDS.PREV_CHAPTER: {
            runCommand(-1);
            break;
        }
        default:
            return;
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.url) {
        chrome.tabs.sendMessage(tabId, {
            message: MESSAGES.CHANGE_URL,
            url: changeInfo.url,
        });
    }
});

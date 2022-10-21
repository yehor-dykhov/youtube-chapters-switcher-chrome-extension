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

chrome.tabs.onActivated.addListener(() => {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { message: MESSAGES.CHANGE_ACTIVE_TAB });
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.url) {
        chrome.tabs.sendMessage(tabId, {
            message: MESSAGES.CHANGE_URL,
            url: changeInfo.url,
        });
    }
});

chrome.runtime.onMessage.addListener((data) => {
    switch (data.message) {
        case MESSAGES.CHANGE_ACTIVE_ICON: {
            chrome.action.setIcon({ path: data.isActive ? 'icon.png' : 'icon_disabled.png' });
            break;
        }
        case MESSAGES.CHANGE_ICON_TEXT: {
            chrome.action.setBadgeText({ text: data.count > 0 ? `${data.count}` : '' });
            break;
        }
    }
});

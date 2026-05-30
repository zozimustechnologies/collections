// Context menus on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({ id: 'save-page',      title: 'Save page to Collections',      contexts: ['page'] });
  chrome.contextMenus.create({ id: 'save-link',      title: 'Save link to Collections',      contexts: ['link'] });
  chrome.contextMenus.create({ id: 'save-image',     title: 'Save image to Collections',     contexts: ['image'] });
  chrome.contextMenus.create({ id: 'save-selection', title: 'Save selection to Collections', contexts: ['selection'] });
});

// Open side panel on toolbar click
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id });
});

// Forward context menu clicks to content script via side panel
chrome.contextMenus.onClicked.addListener((info, tab) => {
  chrome.sidePanel.open({ tabId: tab.id });
  setTimeout(() => {
    chrome.tabs.sendMessage(tab.id, { type: 'context-menu', info }).catch(() => {});
  }, 500);
});

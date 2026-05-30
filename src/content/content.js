// Guard: prevent double-registration if the script is injected more than once
if (window.__cfeContentScriptLoaded) {
  // Already running — if there's a queued ENTER_SELECTION_MODE, handle it
} else {
window.__cfeContentScriptLoaded = true;

let selectionModeActive = false;

function onMouseUp() {
  if (!selectionModeActive) return;
  const text = window.getSelection()?.toString().trim();
  if (text) {
    exitSelectionMode();
    chrome.runtime.sendMessage({ type: 'SELECTION_CAPTURED', text });
  }
}

function onKeyDown(e) {
  if (!selectionModeActive) return;
  if (e.key === 'Escape') {
    exitSelectionMode();
    chrome.runtime.sendMessage({ type: 'SELECTION_CANCELLED' });
  }
}

function enterSelectionMode() {
  if (selectionModeActive) return;
  selectionModeActive = true;
  document.addEventListener('mouseup', onMouseUp);
  document.addEventListener('keydown', onKeyDown);
}

function exitSelectionMode() {
  selectionModeActive = false;
  document.removeEventListener('mouseup', onMouseUp);
  document.removeEventListener('keydown', onKeyDown);
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'ENTER_SELECTION_MODE') {
    enterSelectionMode();
    sendResponse({ ok: true });
    return;
  }

  if (message.type === 'EXIT_SELECTION_MODE') {
    exitSelectionMode();
    sendResponse({ ok: true });
    return;
  }

  // Context menu actions forwarded from the service worker
  if (message.type === 'context-menu') {
    const { info } = message;
    let item = null;
    if (info.menuItemId === 'save-page') {
      item = { type: 'link', url: location.href, title: document.title, favicon: `${location.origin}/favicon.ico` };
    } else if (info.menuItemId === 'save-link') {
      item = { type: 'link', url: info.linkUrl, title: info.linkUrl };
    } else if (info.menuItemId === 'save-image') {
      item = { type: 'image', url: info.srcUrl };
    } else if (info.menuItemId === 'save-selection') {
      item = { type: 'quote', text: info.selectionText, source: location.href };
    }
    if (item) chrome.runtime.sendMessage({ type: 'add-item', item });
  }
});

} // end guard

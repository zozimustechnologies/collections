/**
 * Chrome storage wrapper for collections data.
 *
 * Schema:
 * {
 *   collections: Array<{
 *     id: string,
 *     name: string,
 *     color: string,
 *     createdAt: number,
 *     items: Array<CollectionItem>
 *   }>
 * }
 *
 * CollectionItem:
 * {
 *   id: string,
 *   type: 'link' | 'text' | 'image' | 'note' | 'screenshot',
 *   title?: string,      // link title
 *   url?: string,        // link / image URL
 *   favicon?: string,    // link favicon URL
 *   content?: string,    // text / note body, or screenshot base64 dataURL
 *   sourceUrl?: string,  // page where text/image was found
 *   sourceTitle?: string,
 *   createdAt: number
 * }
 */

const STORAGE_KEY = 'collections'

export function loadCollections() {
  return new Promise((resolve) => {
    chrome.storage.local.get(STORAGE_KEY, (data) => {
      resolve(data[STORAGE_KEY] ?? [])
    })
  })
}

export function saveCollections(collections) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [STORAGE_KEY]: collections }, resolve)
  })
}

export function onCollectionsChanged(callback) {
  const listener = (changes, area) => {
    if (area === 'local' && STORAGE_KEY in changes) {
      callback(changes[STORAGE_KEY].newValue ?? [])
    }
  }
  chrome.storage.onChanged.addListener(listener)
  return () => chrome.storage.onChanged.removeListener(listener)
}

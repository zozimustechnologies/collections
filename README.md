# Collections for Edge

A browser extension that recreates the deprecated Microsoft Edge Collections feature — collect and organize links, quotes, images, and notes from anywhere on the web.

Built by [Zozimus Technologies](https://zozimustechnologies.github.io/).

---

## Features

- **Save the current page** — one click to save the URL, title, and favicon
- **Capture selected text** — interactive selection mode with on-page banner
- **Save images by URL** — paste or auto-fill from the current tab
- **Write notes** — freeform text attached to any collection
- **Multiple collections** — color-coded, renameable, deleteable
- **Context menu integration** — right-click any page, link, image, or selection to add it
- **Persistent storage** — everything saved locally via `chrome.storage.local`
- **Sidebar panel** — lives in the browser sidebar, always accessible

---

## Browser Support

Targets all Chromium-based browsers using Manifest V3:

- Microsoft Edge
- Brave
- Any Chromium-based browser

---

## Development

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Build

```bash
npm run build
```

Outputs directly to the project root (`sidepanel.html`, `background/`, `content/`, `assets/`, `icons/`).

### Watch mode

```bash
npm run dev
```

Rebuilds on every file change.

---

## Tech Stack

- **React 18** + **Vite 5**
- **Manifest V3** — `sidePanel`, `contextMenus`, `tabs`, `scripting`, `storage`
- No backend — all data stored in `chrome.storage.local`

---

## Project Structure

```
src/
  background/service-worker.js   # Context menus, tab info routing
  content/content.js             # Selection capture mode
  sidepanel/
    index.html                   # Sidebar entry point
    main.jsx                     # React root
    App.jsx                      # View routing
  components/
    CollectionList.jsx            # Main collections list
    CollectionDetail.jsx          # Items inside a collection
    ItemCard.jsx                  # Link / text / image / note cards
    AddItemMenu.jsx               # Animated FAB menu
    NewCollectionModal.jsx        # Create collection dialog
  hooks/
    useCollections.js             # CRUD + storage sync
  utils/
    storage.js                   # chrome.storage.local wrapper
  styles/
    index.css                    # Full design system
scripts/
  generate-icons.mjs             # Generates PNG icons (runs on postinstall)
manifest.json
```

---

## Support

♥ [Donate via Wise](https://wise.com/pay/business/sandeepchadda?utm_source=open_link)

---

© [Zozimus Technologies](https://zozimustechnologies.github.io/). All rights reserved.

# Collections

A browser extension that recreates the deprecated Microsoft Edge Collections feature — collect and organize links, quotes, images, and notes from anywhere on the web.

**[🌐 Website](https://zozimustechnologies.github.io/collectionsforedge/)** &nbsp;·&nbsp; **[📦 Edge Add-ons Store](https://microsoftedge.microsoft.com/addons/search?developer=Zozimus%20Technologies)** &nbsp;·&nbsp; **[♥ Donate](https://wise.com/pay/business/sandeepchadda?utm_source=open_link)**

Built by [Zozimus Technologies](https://zozimustechnologies.github.io/).

---

## Features

- **Save the current page** — one click to save the URL, title, and favicon
- **Capture selected text** — interactive selection mode with on-page banner
- **Save images by URL** — paste or auto-fill from the current tab
- **Write notes** — freeform text attached to any collection
- **Multiple collections** — colour-coded, renameable, deleteable
- **Context menu integration** — right-click any page, link, image, or selection to add it
- **Persistent storage** — everything saved locally via the browser's local storage API
- **Sidebar panel** — lives in the browser sidebar, always accessible

---

## Browser Support

Built for **Microsoft Edge** using Manifest V3.

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

### Generate store assets

```bash
node screenshot.js
```

Uses Puppeteer to generate all store asset PNGs into `storeassets/`.

---

## Tech Stack

- **React 18** + **Vite 5**
- **Manifest V3** — `sidePanel`, `contextMenus`, `tabs`, `scripting`, `storage`
- No backend — all data stored locally in the browser

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
    storage.js                   # browser storage wrapper
  styles/
    index.css                    # Full design system
docs/
  index.html                     # GitHub Pages website
storeassets/
  description.md                 # Edge Add-ons store description
  extensionlogo.png              # 300×300 extension logo
  smallpromotionaltile.png       # 440×280 promo tile
  largepromotionaltile.png       # 1400×560 promo banner
  screenshot-1280x800.png        # Store screenshot (large)
  screenshot-640x400.png         # Store screenshot (small)
public/icons/                    # Extension icons (source PNGs for build)
logo.svg                         # Vector logo source
screenshot.js                    # Puppeteer script to regenerate storeassets
manifest.json
```

---

## Support

♥ [Donate via Wise](https://wise.com/pay/business/sandeepchadda?utm_source=open_link)

---

© [Zozimus Technologies](https://zozimustechnologies.github.io/). All rights reserved.


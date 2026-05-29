# Collections for Edge — Edge Add-ons Store Description

---

## Short Description (≤132 characters)

Collect and organize web content — links, quotes, images, and notes — in named collections right inside your browser.

---

## Full Description

**Collections for Edge** brings back the beloved Microsoft Edge Collections feature that was deprecated — and improves on it.

Save anything from the web into named, colour-coded collections without ever leaving your current tab. The extension lives entirely in your browser's sidebar.

### What you can save

- **Links** — save the current page or any link with its title and favicon
- **Quotes** — highlight text on any page and capture it using the interactive selection mode
- **Images** — right-click any image or paste a direct image URL
- **Notes** — write freeform notes attached to any collection

### How it works

1. Click the Collections icon to open the sidebar panel
2. Create a collection (name it, pick a colour)
3. Browse the web as normal — right-click anything to add it, or use the in-panel menu
4. Everything is saved instantly and persists across browser sessions

### Context menu integration

Right-clicking on any page, link, image, or selected text gives you a **"Save to Collections"** option — no need to open the panel first.

### Privacy

- **100% local** — all data is stored in your browser using `chrome.storage.local`. Nothing is uploaded, synced, or shared.
- **No accounts** — there is no sign-in, no registration, no server of any kind.
- **No tracking** — zero analytics, zero telemetry, zero cookies.
- **Minimal permissions** — the extension only requests what it genuinely needs.

### Permissions explained

| Permission | Why it's needed |
|---|---|
| `sidePanel` | To open and display the sidebar panel |
| `storage` | To persist your collections locally |
| `contextMenus` | To add right-click menu items on pages and links |
| `tabs` | To read the current tab's URL and title when saving a page |
| `scripting` + `<all_urls>` | To enable interactive text selection mode on any page |

### Built with

React 18 + Vite 5, Manifest V3. Zero external network requests.

---

*Built by [Zozimus Technologies](https://zozimustechnologies.github.io/)*

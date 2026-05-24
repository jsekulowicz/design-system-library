---
"@jsekulowicz/ds-components": patch
---

- Dropped the `backdrop-filter: blur(2px)` from `ds-dialog` and `ds-drawer`'s `::backdrop`. The dark overlay alone is enough to signal modality, the blur was decorative, and removing it cuts paint cost on lower-end devices. With no blur, the page-behind-modal looks less visually busy on the rare occasion that the user scrolls *over the backdrop* (which is allowed by design — modal content's own scroll is still contained by `overscroll-behavior: contain` on the body, but scrolling over the backdrop is now treated as a deliberate user choice to look at the page, the same way Notion / Linear / GitHub modals behave).

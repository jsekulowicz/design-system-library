---
'@jsekulowicz/ds-components': patch
---

Fix `ds-menu-button` dropdown clipping and overflowing the viewport. The panel is now shown via the Popover API (`popover="manual"`), so it renders in the top layer and escapes `overflow: hidden`/scroll ancestors, and it is positioned with CSS anchor positioning that flips into view near a viewport edge — mirroring `ds-select`. UA popover defaults (border, padding, background, margin) are reset on the panel so only the inner `ds-menu` surface shows.

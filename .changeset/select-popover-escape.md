---
"@jsekulowicz/ds-components": patch
---

- `ds-select` now renders its dropdown via the Popover API. Browsers that support `HTMLElement.prototype.showPopover` hoist the listbox into the top layer, so it escapes any `overflow: hidden` / `overflow: auto` ancestor (dialogs, scroll containers, fixed-height panels) instead of being clipped or expanding the container. JS positions the popover under the trigger via `position: fixed` and the trigger's bounding rect, flipping above when there isn't enough room below. Scroll and resize listeners re-position the popover while it's open, and the listeners self-clean on close / disconnect. Browsers without Popover API support keep the existing in-flow `position: absolute` behaviour so they still work — they just clip in dialogs as before.

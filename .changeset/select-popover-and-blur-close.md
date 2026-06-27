---
'@jsekulowicz/ds-components': minor
---

ds-searchable-select now renders its dropdown in the top layer via the Popover API and CSS anchor positioning, matching ds-select. The listbox escapes `overflow`/scroll-container clipping and flips above the trigger when there's no room below, so a select near the bottom of a scroll panel no longer opens off-screen.

Both ds-select and ds-searchable-select now close their dropdown when focus leaves the combobox — tabbing out of the field, or onto the clear button, dismisses the open list instead of leaving it stuck open.

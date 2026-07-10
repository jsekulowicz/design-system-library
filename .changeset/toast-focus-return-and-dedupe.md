---
"@jsekulowicz/ds-components": minor
---

Toast: return focus and deduplicate repeats.

- When `focusOnShow` moves focus into a toast, dismissing it (Escape, close button, or an action) now returns focus to whatever was focused when it opened — as long as focus is still inside the toast, so the user isn't yanked if they've moved on. Exposed as the `restoreFocusTo` property for manual control.
- New `key` option on the imperative `toast()`: raising a toast whose `key` matches a still-visible one refreshes its content and restarts its timer instead of stacking a duplicate. New `resetTimer()` method on the element restarts the auto-dismiss countdown.

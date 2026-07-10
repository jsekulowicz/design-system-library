---
"@jsekulowicz/ds-components": minor
---

Toast: redesigned layout and keyboard accessibility to match `ds-dialog`.

- Vertical stack: title on its own row with a `2xl` close button in the corner, full-width body, and a footer-aligned action row (previously the title, body, and actions competed for one horizontal row).
- Data-driven action buttons now default to the `secondary` (outline) variant instead of `ghost`, so they read as actions.
- The toast is now programmatically focusable (`tabindex="-1"`, out of the tab sequence) and dismisses on `Escape` while focused.
- New `focusOnShow` option on the imperative `toast()` moves focus to the toast when it appears — for actionable toasts raised in response to a user action, so keyboard users land on the notification and its buttons.

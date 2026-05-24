---
"@jsekulowicz/ds-components": minor
---

- `ds-page-shell`'s mobile navigation now wraps its `aside` slot in a `ds-drawer` instead of hand-rolling its own slide-in chrome. This unifies the visual language across mobile nav and consumer-built drawers (same square `sm` close button, same backdrop, same animation), and the mobile nav inherits all of `ds-drawer`'s free benefits: native focus trap, top-layer rendering, automatic `aria-modal`, Escape-to-close. The bespoke `.mobile-backdrop` element, `.drawer-header` row, and all mobile-drawer positioning/animation CSS were deleted.

  **Breaking changes to the parts API:**
  - Removed parts: `drawer-header`, `drawer-brand`, `drawer-close`. Consumers styling these directly will need to migrate to `ds-drawer`'s own parts (`close-button`, etc.) via the page-shell's `aside` part, e.g. `ds-page-shell::part(aside)::part(close-button)`.
  - Removed CSS custom properties: `--ds-page-shell-drawer-header-bg`, `--ds-page-shell-drawer-header-fg`, `--ds-page-shell-drawer-header-border-color`, `--ds-page-shell-drawer-header-height`, `--ds-page-shell-drawer-close-hover-bg`. The drawer header is now `ds-drawer`'s title row inside its own shadow DOM; restyle through `ds-drawer`'s tokens or its `close-button` part instead.

  **Preserved public API:**
  - `drawer-brand` slot (now forwards into `ds-drawer`'s `title` slot)
  - `menu-toggle` button + `aria-expanded`
  - `data-mobile-nav-open` host attribute
  - `aside` part name (now applies to the `ds-drawer` element in mobile layout, plain `<aside>` in desktop)
  - All desktop-layout behavior unchanged.

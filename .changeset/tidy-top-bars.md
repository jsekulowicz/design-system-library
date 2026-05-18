---
"@jsekulowicz/ds-components": minor
"@jsekulowicz/ds-react": minor
---

Replace the former Navbar component with TopBar and align the surrounding page chrome.

- `ds-navbar` has been removed in favor of `ds-top-bar`. The new TopBar is a simpler application chrome component with `brand` and `actions` slots only; primary navigation should live in `ds-sidenav` or other navigation components.
- Component package imports move from `@jsekulowicz/ds-components/navbar` to `@jsekulowicz/ds-components/top-bar`.
- React wrapper consumers should replace `Navbar` with `TopBar`.
- `ds-page-shell` now composes `ds-top-bar` in its header, preserves the footer slot without an extra shell wrapper, and keeps main/footer/header alignment consistent.
- `ds-footer` and `ds-top-bar` now use fixed chrome heights with symmetric inline padding.
- Breadcrumb item focus rings have a little more horizontal breathing room.

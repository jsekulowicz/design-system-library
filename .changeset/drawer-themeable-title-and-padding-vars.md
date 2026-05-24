---
"@jsekulowicz/ds-components": minor
---

- `ds-drawer` now exposes CSS custom properties so consumers can theme the title-row chrome and remove the default card padding when the drawer's content (e.g. a navigation list) wants to reach the panel edges. New vars:
  - `--ds-drawer-card-padding` (default `var(--ds-space-6)`) — controls the inset of all drawer content inside the underlying `ds-card`. Set to `0` to let slotted body content go full-width and let the title-row chrome paint edge-to-edge.
  - `--ds-drawer-title-bg` (default `transparent`) — title-row background.
  - `--ds-drawer-title-fg` (default `inherit`) — title-row foreground; also applied to the close button so the icon keeps contrast against a coloured background.
  - `--ds-drawer-title-border-color` (default `transparent`) — bottom border on the title row.
  - `--ds-drawer-title-padding` (default `0`) — inline / block padding on the title row, useful when `--ds-drawer-card-padding` is `0` so the title row carries its own breathing room.
- `ds-page-shell`'s mobile-nav drawer now wires those vars through from the existing `--ds-page-shell-drawer-header-bg` / `-fg` / `-border-color` contract that was preserved from the pre-0.10.0 page-shell. Consumer apps that set those vars on the page-shell host (e.g. xwords' `AppShell.vue` mapping them to its topbar colours) get the same blue-header / themed drawer look back without any app-side changes. The card padding is force-set to `0` for the page-shell drawer use case so sidenav items reach the drawer's inline edges.

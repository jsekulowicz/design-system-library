# @jsekulowicz/ds-components

## 0.48.3

### Patch Changes

- b497ca8: nav-item: dim an accent-coloured slotted icon (icons coloured with
  `--ds-color-accent`) alongside the label when the item is `disabled`.

## 0.48.2

### Patch Changes

- e6894a5: Ensure tooltip content wraps and uses logical start alignment even when the trigger inherits no-wrap or alignment styles.

## 0.48.1

### Patch Changes

- 32a451b: Remeasure `ds-bar-chart` after its loading skeleton is replaced so the rendered chart uses the container width without stretching its SVG content. Keep `ds-stat-tile` loading values in the same line box as loaded values to prevent layout shifts.

## 0.48.0

### Minor Changes

- ec038d6: Add `ds-stat-tile` with flexible sizing, optional label and hint content, and value loading. Add skeleton loading states to `ds-bar-chart` and `ds-heatmap-calendar`.

## 0.47.2

### Patch Changes

- 195e22b: Route the hardcoded corner radii in bar-chart and heatmap-calendar through `--ds-radius-xs` instead of literal pixel values, so consumers that zero their radius tokens get square corners.
  - `bar-chart`: the keyboard focus ring rect no longer forces `rx="4"`; it reads `--ds-radius-xs` via CSS.
  - `heatmap-calendar`: day cells (and their active/focus outline) and the legend swatches now read `--ds-radius-xs` instead of a fixed `2px`.

## 0.47.1

### Patch Changes

- 6d6f007: Keep PageShell scrollbars edge-aligned by padding its optional page header and inner content instead of the scrolling region.

## 0.47.0

### Minor Changes

- 2351d06: Add a scrollable page template with an optional non-scrolling header and automatic PageShell integration.

## 0.46.0

### Minor Changes

- f360b77: Replace the generic font-size scale with non-overlapping body and heading scales, including a 1.125rem small-heading step.

### Patch Changes

- Updated dependencies [f360b77]
  - @jsekulowicz/ds-tokens@0.46.0

## 0.45.1

### Patch Changes

- 5a27ef9: Keep heatmap tooltips visible outside the horizontal scroller, align the legend and padded focus frame with the calendar width, and prevent bar-chart tooltip labels from wrapping away from their series indicator.

## 0.45.0

### Minor Changes

- 13b7d0e: Add the accessible `ds-heatmap-calendar` molecule with responsive rendering, keyboard navigation, tooltips, a legend, and a screen-reader data table.

## 0.44.0

### Minor Changes

- 678533e: NavItem: keep disabled links keyboard-focusable and add a focusable `loading` state with busy semantics and a spinner. Disabled standalone controls now consistently remain keyboard-focusable and expose `aria-disabled`.
- 4ccd140: NavItem: add a `tooltip` slot for rich compact-mode tooltip content, with the item label retained as the default.

## 0.43.0

### Minor Changes

- a5be4b2: NavGroup: add the `compactHoverTooltipDelay` prop and `compact-hover-tooltip-delay` attribute for configuring the compact-mode hover tooltip delay.

### Patch Changes

- bfd8856: Compact NavItem and NavGroup tooltips now open on keyboard focus as well as pointer hover.

## 0.42.0

### Minor Changes

- 5cdc68b: NavItem: add the `compactHoverTooltipDelay` prop and `compact-hover-tooltip-delay` attribute for configuring the compact-mode hover tooltip delay. Storybook API pages now show Props tables for NavItem, NavGroup, Breadcrumb, Tabs, and BarChart components.

### Patch Changes

- f0944bd: Checkbox and radio option labels now use `--ds-font-size-md`; labels above grouped fields continue to use `--ds-font-size-sm`.

## 0.41.0

### Minor Changes

- 32193e8: Segmented control: segment buttons no longer force `--ds-font-size-sm` via `::part(button)`; they now use the button's own `--ds-font-size-md`, consistent with `ds-button` and the table's md default.

## 0.40.0

### Minor Changes

- 6e65809: Button: split intent colour out of `variant` into a new `color` prop (`accent` | `success` | `danger`, default `accent`). `variant` is now just the emphasis — `primary` | `secondary` | `ghost` — and `color` tints it: background for `primary`, border + text for `secondary`, text for `ghost`. The `accent` default leaves `secondary`/`ghost` neutral, so existing quiet buttons are unchanged.

  BREAKING: the `danger` and `success` **variants** are removed. Migrate `variant="danger"` → `variant="primary" color="danger"` (and likewise for `success`); use `secondary`/`ghost` with a `color` for outlined or text-only intent buttons.

- feae3df: Table: default font size is now `--ds-font-size-md` (was `--ds-font-size-sm`), matching the base body size. Slotted cell content that inherits font size — including progress-bar labels — scales with it.

## 0.39.0

### Minor Changes

- b5aafc7: Toast: return focus and deduplicate repeats.
  - When `focusOnShow` moves focus into a toast, dismissing it (Escape, close button, or an action) now returns focus to whatever was focused when it opened — as long as focus is still inside the toast, so the user isn't yanked if they've moved on. Exposed as the `restoreFocusTo` property for manual control.
  - New `key` option on the imperative `toast()`: raising a toast whose `key` matches a still-visible one refreshes its content and restarts its timer instead of stacking a duplicate. New `resetTimer()` method on the element restarts the auto-dismiss countdown.

## 0.38.0

### Minor Changes

- dae5752: Toast: redesigned layout and keyboard accessibility to match `ds-dialog`.
  - Vertical stack: title on its own row with a `2xl` close button in the corner, full-width body, and a footer-aligned action row (previously the title, body, and actions competed for one horizontal row).
  - Data-driven action buttons now default to the `secondary` (outline) variant instead of `ghost`, so they read as actions.
  - The toast is now programmatically focusable (`tabindex="-1"`, out of the tab sequence) and dismisses on `Escape` while focused.
  - New `focusOnShow` option on the imperative `toast()` moves focus to the toast when it appears — for actionable toasts raised in response to a user action, so keyboard users land on the notification and its buttons.

## 0.37.0

### Minor Changes

- e09d7a0: Toast: `actions` now accepts a data-driven `ToastAction[]` (label + onClick + optional variant) in addition to the existing lit render function. Callers can add action buttons without hand-writing lit templates; the toast renders `ds-button`s and passes the controller to each `onClick`.

### Patch Changes

- d6d8d57: Code-quality audit pass, no public API changes:
  - Invalid form controls now use the `--ds-shadow-focus-danger` token instead of a hardcoded light-theme colour, fixing their focus ring in dark theme.
  - Duplicated CSS collapsed into shared modules (field-control chrome, alert/toast notice surface, menu-item/select-option rows, checkbox/radio toggles, group fieldsets, visually-hidden).
  - Shadow-DOM markup cleanup: wrapper spans that were restyled to block/flex are plain divs now; internal class names changed (`sr-only` → `visually-hidden`, checkbox `box` / radio `dot` → `control`, alert/toast root → `notice`). All `part` names are unchanged.
  - z-index values map to `--ds-z-index-*` tokens instead of magic numbers.
  - bar-chart and page-shell split into smaller modules; behaviour identical.

- Updated dependencies [d6d8d57]
- Updated dependencies [d6d8d57]
  - @jsekulowicz/ds-core@0.37.0
  - @jsekulowicz/ds-tokens@0.37.0

## 0.36.2

### Patch Changes

- 90c90ff: `ds-table`: cells (`.cell-content`) now use `display: flex; align-items: center` instead of `display: block`, so custom slotted content (icon scales, badges, links) centres vertically against text cells. Horizontal alignment is preserved — `align="right"`/`"center"` columns map to `justify-content`, and `text-align` still governs wrapped text.

## 0.36.1

### Patch Changes

- 7be1721: `ds-icon`: anchor the icon registry on `globalThis` (keyed by `Symbol.for`) so duplicate copies of the module share one registry. Previously a per-module `Map` could let icon registrations land in a copy that `<ds-icon>` never read — surfacing intermittently (e.g. around Vite dep re-optimization) as `unknown icon "…"` warnings and blank icons.

## 0.36.0

### Minor Changes

- c5940b0: Progress bar height change:
  - `ds-progress-bar`: the label's font size increased to default --ds-font-size-md (1rem).

## 0.35.0

### Minor Changes

- 4d2ffe0: Progress bar and table refinements:
  - `ds-progress-bar`: the label is now bare text (no chip) that **auto-flips colour at the fill boundary** — `--ds-color-bg` over the filled track, `--ds-progress-color` over the empty track — via a hard-stop gradient painted through the glyphs (`background-clip: text`), so it stays legible without any outline (works per-glyph, mid-letter). Inline icons keep their own colour, so give them their own contrast (a badge/pill). A single `--ds-progress-color` custom property (default `--ds-color-accent`) recolours the track border, the filled indicator and the label together; the empty track is `--ds-color-bg`. The default label size is now `sm` (was `xs`). The border is painted on top of the fill and the indicator no longer rounds its own corners (the track clips them), so rounded tracks no longer show a seam between the fill and the border at the corners. (The flip is left-to-right; RTL is not yet handled.)
  - `ds-table`: each cell is now rendered inside a `cell:{columnName}:{rowKey}` named slot (with the column's `render`/`field` as fallback), so consumers can project framework-rendered cell content. Requires `row-key` to be set; tables without it are unchanged.

## 0.34.0

### Minor Changes

- b9af766: Progress bar and table refinements:
  - `ds-progress-bar`: the label is now bare text (no chip) with a **crisp `--ds-color-bg` outline** (`-webkit-text-stroke` + `paint-order`) so it stays legible over both the filled and empty track; inline icons aren't stroked, so give them their own contrast (a badge/pill). A single `--ds-progress-color` custom property (default `--ds-color-accent`) recolours the track border, the filled indicator and the label together; the empty track is `--ds-color-bg`. The default label size is now `sm` (was `xs`). The border is painted on top of the fill and the indicator no longer rounds its own corners (the track clips them), so rounded tracks no longer show a seam between the fill and the border at the corners.
  - `ds-table`: each cell is now rendered inside a `cell:{columnName}:{rowKey}` named slot (with the column's `render`/`field` as fallback), so consumers can project framework-rendered cell content. Requires `row-key` to be set; tables without it are unchanged.

## 0.33.0

### Minor Changes

- 79e3959: `ds-page-shell`: tighten the mobile navigation drawer.
  - Remove the large gap between the drawer's title row and the nav links on mobile — the sidenav now sits directly under the header (previously it was pushed down by the drawer card's inter-row gap). Desktop is unaffected.
  - The mobile drawer title now matches the top bar's brand size (`--ds-font-size-lg`) instead of the drawer's larger default title.

  `ds-drawer` gains two custom properties to enable this (defaults unchanged):
  - `--ds-drawer-card-gap` — gap between the title row, body and footer (default `--ds-space-3`).
  - `--ds-drawer-title-font-size` — title text size (default `--ds-font-size-xl`).

## 0.32.0

### Minor Changes

- e9addf3: Rework the font-size scale for readability and consistency.

  **Tokens** (`@jsekulowicz/ds-tokens`):
  - Removed `--ds-font-size-3xs` (11px) and `--ds-font-size-2xs` (12px). Remap `2xs` usages to `xs` — the new `xs` equals the old `2xs` value, so no visual change.
  - Retuned the scale to a rounder progression: `xs` 12px, `sm` 14px, `md` 16px, `lg` 20px, `xl` 24px, `2xl` 28px, `3xl` 32px, `4xl` 48px, `5xl` 64px. Value changes: `xs` 13→12px, `lg` 18→20px, `xl` 22→24px, `3xl` 36→32px.

  **Components** (`@jsekulowicz/ds-components`):
  - Body and control text now uses `md` (16px) by default. Buttons, text fields, text areas, selects, searchable selects, tabs, nav items, menu items and select options render at 16px regardless of `size` — the previous per-size font shrinking on controls is gone (a `size="sm"` button/input is no longer 12–13px).
  - Alert and toast titles bump to `lg` to stay above the larger body text.
  - Tooltip text goes from 12px to `sm` (14px).
  - Checkbox and radio labels stay at `sm` (14px), consistent with form-field labels. Segmented control option labels also stay at `sm` (they are compact toggles, not primary buttons). Labels, descriptions, helper/meta text, tables and breadcrumbs also keep their smaller sizes for density.

- e9addf3: Add sizing utility classes that reference the existing `--ds-space-*` scale, for width, height and square dimensions.
  - `.ds-w-{n}`, `.ds-h-{n}`, `.ds-size-{n}` (square) over the full space scale (`0`–`32`).
  - Keyword sizes: `.ds-w-auto|full|screen|min|max|fit` and the matching `.ds-h-*`, plus `.ds-size-full`.
  - Constraints: `.ds-min-w-*`, `.ds-min-h-*`, `.ds-max-w-*`, `.ds-max-h-*`.

  Shipped as a separate, independently-importable file (`@jsekulowicz/ds-components/css/utilities/sizing.css`) and included in the `css/utilities.css` barrel. All classes live in `@layer ds.utilities` with plain class selectors, so a consumer-side purge/content-scan step can eliminate unused classes.

### Patch Changes

- Updated dependencies [e9addf3]
  - @jsekulowicz/ds-tokens@0.32.0

## 0.31.0

### Minor Changes

- b47cf5f: `ds-page-shell`: add a `header-status` slot for indicator widgets (rendered in the top bar before `header-actions`), a `mobile-menu-button-position` prop (`start` | `end`, default `end`) that places the mobile navigation toggle as a peer of the action buttons via DOM order, a `menu-toggle` CSS part, and a `--ds-page-shell-menu-toggle-size` custom property to size the toggle.

## 0.30.0

### Minor Changes

- a1ff5f7: Add `4xl` icon size (1.875rem) to `ds-icon`.

## 0.29.0

### Minor Changes

- 74a4eff: Add `char-count` support to text field and text area components.

## 0.28.0

### Minor Changes

- cfafcce: New `ds-text-area`: a multi-line text input that shares the styling, label/description/error, and native form participation of `ds-text-field`. A `rows` prop sizes the field to exactly that many text rows, and a `resize` prop (`none` by default, or `vertical`) controls whether the user can drag it taller.

## 0.27.0

### Minor Changes

- c3e2918: ds-select and ds-searchable-select accept a `hint` — an informative note rendered at the top of the open dropdown (sticky above the options, `part="hint"`, `role="note"`). Use it to explain, for the whole menu, why a choice is unavailable, so the reason is visible the moment the dropdown opens rather than only on hovering a disabled option.
- 1a6f1c0: ds-select and ds-searchable-select options accept a `disabledReason` — shown as a hover tooltip and exposed to screen readers (announced when the option is reached by keyboard), so a disabled option can explain why it can't be picked.

## 0.26.0

### Minor Changes

- 5f22d3f: ds-searchable-select now renders its dropdown in the top layer via the Popover API and CSS anchor positioning, matching ds-select. The listbox escapes `overflow`/scroll-container clipping and flips above the trigger when there's no room below, so a select near the bottom of a scroll panel no longer opens off-screen.

  Both ds-select and ds-searchable-select now close their dropdown when focus leaves the combobox — tabbing out of the field, or onto the clear button, dismisses the open list instead of leaving it stuck open.

## 0.25.0

### Minor Changes

- d37e755: Add `input-label` to `ds-select`, mirroring `ds-text-field`. It sets the trigger's accessible name without rendering a visible stacked label, so a select can carry a compact inline label (e.g. alongside its own text) instead of the stacked one. The no-label accessibility warning now accepts either `label` or `input-label`.

### Patch Changes

- a78aeb3: Fix `ds-menu-button` dropdown clipping and overflowing the viewport. The panel is now shown via the Popover API (`popover="manual"`), so it renders in the top layer and escapes `overflow: hidden`/scroll ancestors, and it is positioned with CSS anchor positioning that flips into view near a viewport edge — mirroring `ds-select`. UA popover defaults (border, padding, background, margin) are reset on the panel so only the inner `ds-menu` surface shows.

## 0.24.0

### Minor Changes

- 3a2fa00: Add `ds-range-input`: an accessible slider atom for picking a numeric value within a min/max range. Built on a native `<input type="range">` with form participation via ElementInternals, it supports `min`/`max`/`step`, `sm`/`md`/`lg` sizes, an optional `show-value` output, label/description/error, and consumer-controlled `invalid` state. Emits `ds-input` (while dragging) and `ds-change` (on commit) with a numeric `value` detail. When `disabled`, the control stays focusable and exposes `aria-disabled="true"` so assistive tech can find and announce it, while keyboard and pointer interaction are blocked.

## 0.23.1

### Patch Changes

- 270fe6a: ds-searchable-select now truncates a long selected value with an ellipsis instead of hard-clipping it (the input still scrolls normally while focused and typing).
- fe44fc7: Selected tiles in a multiple ds-select (and ds-searchable-select) now grow to the full row width before ellipsizing, instead of being hard-capped to a narrow fixed width that wrapped early and wasted the rest of the row. Long labels still truncate with an ellipsis, preserved whether the dropdown is open or closed.

## 0.23.0

### Minor Changes

- 89fbba2: ds-select and ds-tooltip now position their popovers with CSS anchor positioning instead of JS. The dropdown/bubble stays glued to its trigger on scroll without any script, matches the trigger width (select), flips to the opposite side when there's no room, and slides to stay within the viewport near a screen edge — fixing the off-screen overflow when a trigger sits near an edge. Requires a browser with CSS anchor positioning support (Chromium 125+, Safari 26+, recent Firefox).

## 0.22.0

### Minor Changes

- b0fdd8d: ds-select and ds-searchable-select dropdown options now wrap long primary text onto multiple lines instead of truncating it with an ellipsis, so long labels (e.g. full clue sentences) can be read in full. The option keeps its single-line height as a baseline and grows only when the text wraps; the closed trigger still truncates. The ds-select dropdown now matches the trigger's width (clamped to the viewport, with its left edge kept on-screen) instead of growing to the widest option — so long options wrap within the menu rather than pushing it past the trigger or off the side of a narrow/mobile viewport.

## 0.21.0

### Minor Changes

- 1a0aa68: ds-select and ds-searchable-select emit `ds-scroll-end` once each time their option listbox is scrolled near the bottom (re-armed after scrolling away or reopening). Hook for consumers that paginate options with infinite scroll.

## 0.20.0

### Minor Changes

- 78ba1e1: Enhance `ds-select` and `ds-searchable-select` with sizing, option icons, and a leaner empty-label layout.
  - **Size**: add a reflected `size` property (`sm` | `md` | `lg`) that drives the trigger height via `--ds-select-size`, matching `ds-button` sizing. Defaults to `md`.
  - **Option icons**: `SelectOption` gains an optional `icon` field (`{ name: string; color?: string }`). The icon renders in the dropdown option rows, in the `ds-select` trigger for the selected value, and as a leading adornment in the `ds-searchable-select` trigger. Per-option `color` customizes the icon color.
  - **Selected icon overrides the leading slot**: when a single option with an icon is selected, its icon takes precedence over any consumer-provided `slot="leading"` content (consistent across both components).
  - **Multi-select tiles**: each selected tile shows its option's icon (`ds-icon`, `size="md"`), and the tile remove control now uses `ds-icon name="x-mark"` (`size="sm"`).
  - **Empty label**: when `label` is empty the `<label>` element is no longer rendered, removing the `4px` label gap and reducing the component's overall height.
  - **Search re-entry fix** (`ds-searchable-select`): typing or pressing Backspace while the input keeps focus but the dropdown is closed (after pressing Escape or selecting an option) now re-enters search mode instead of swallowing the keystroke — starting from an empty query (Backspace/Space) or the typed character.

## 0.19.1

### Patch Changes

- 117af3a: Fix `ds-nav-item` children of a `ds-nav-group` losing their start indentation in
  expanded (non-compact) sidenavs. The `:not([compact])` guard was placed as a bare
  compound selector alongside `:host(...)`, so it never matched the featureless shadow
  host and the indentation rule was dropped entirely. Moving the guard inside `:host()`
  (`:host([role='listitem']:not([compact]))`) restores the indent in expanded mode while
  keeping compact items centered.

## 0.19.0

### Minor Changes

- 0ee579a: Add opt-in desktop start and end aside controls to `ds-page-shell`, including compact and hidden
  states, mirrored border-aligned buttons, smooth collapse and expand animations, scroll fades, and
  the `ds-aside-state-change` event with its React wrapper callback.

  Prevent clickable `ds-table` rows from activating after users drag or select cell text.

## 0.18.2

### Patch Changes

- 73112b5: Make `ds-segmented-control` use regular buttons by default and add a `small` property for compact buttons.

## 0.18.1

### Patch Changes

- 15fb39c: Render breadcrumb items without an href as non-link text.

## 0.18.0

### Minor Changes

- d3ca1fd: Generate Heroicons 24/solid variants for every glyph, available under the `<name>-solid` icon name.

### Patch Changes

- 63c0ebd: Use `--ds-radius-sm` instead of `--ds-radius-full` for the progress bar track and fill, keeping the right side of the fill square until progress reaches 100%.

## 0.16.2

### Patch Changes

- 5fcde03: Improve `ds-table` keyboard and screen reader behavior for clickable rows, sorting, responsive stack layout, and loading states.
- 3a29037: Improve visible focus rings for table sort controls, pagination controls, and clickable rows.
- 3dd1dda: Round table last-row edge cells so focused clickable rows follow the table container shape.
- 7bb55e3: Limit clickable row focus styling to the row action itself so focused child controls do not receive duplicate row rings.

## 0.16.1

### Patch Changes

- cf6d02a: Fix the `ds-segmented-control` focus ring being clipped by the neighbouring
  segment. The focused segment is now lifted above its siblings so the full ring
  is visible on all sides, including against an adjacent selected (accent)
  segment.

## 0.16.0

### Minor Changes

- fd04da6: Add proper radiogroup keyboard navigation (roving tabindex) to
  `ds-segmented-control` and `ds-radio-group`. Each control is now a single
  `Tab` stop that lands on the selected option; `←/→/↑/↓` and `Home/End` move
  between options with selection following focus, wrapping at the ends and
  skipping disabled options. This matches the WAI-ARIA radiogroup pattern (and
  makes `ds-radio-group` behave as its docs already described).

  Supporting changes: `ds-button` can now forward `tabindex` to its inner
  button (alongside the existing `role`/`aria-checked` forwarding) and exposes a
  `focus()` that delegates to it; `ds-radio` gains a `tab-stop` property and a
  delegating `focus()`. A shared `resolveRovingTarget` helper holds the
  navigation math.

  `ds-checkbox-group` is intentionally left unchanged — independent checkboxes
  should each remain in the tab order per the APG, rather than adopting roving
  tabindex.

- fd04da6: `ds-segmented-control` now renders a visible field `label` and an optional
  `description`, matching the layout of other form fields (`ds-select`,
  `ds-text-field`). Segments are built from small `ds-button`s instead of
  bespoke native buttons, so they inherit the design system's button styling,
  sizing and focus states, and stretch to share the track evenly.

  `ds-button` gains `role` / `aria-checked` forwarding (bound as properties) so
  it can act as a radio within the segmented control's `radiogroup` — the role
  and checked state land on the focusable element, never duplicated onto the
  host.

## 0.14.0

### Minor Changes

- 7aff821: Add `ds-segmented-control`: a single-select segmented control rendering a
  connected row of mutually-exclusive options, each with an optional leading
  icon. Token-styled (no hardcoded colors or radii) and theme-aware, it's an
  inline alternative to a dropdown for a small set of choices and emits
  `ds-change` with `{ value }`.

### Patch Changes

- Updated dependencies [6a809dd]
  - @jsekulowicz/ds-tokens@0.14.0

## 0.13.3

### Patch Changes

- 0829ac5: `ds-dialog`, `ds-drawer`: the body scroll fade is now driven by a small
  `ScrollFadeController` (a `scroll` listener + `ResizeObserver` + `MutationObserver`,
  rAF-throttled) instead of a scroll-progress timeline. It sets
  `--ds-scroll-fade-top` / `--ds-scroll-fade-bottom` from the real scroll position,
  so the content mask fades the bottom edge while more is below, the top edge once
  scrolled, and NOTHING when the content fits — fading content into the background
  (theme-aware, works in light and dark) with no phantom fade on non-scrollable
  content, including a dialog whose scrollable form is swapped for a short
  confirmation. `ds-table` keeps its existing fade.
- 5b3ae65: Share the scroll-fade across `ds-dialog`, `ds-drawer` and `ds-table`. The
  gradient is now defined once as `--ds-scroll-fade-mask` (tunable via
  `--ds-scroll-fade-depth` and `--ds-scroll-fade-offset`), the identical card-body
  scroll styles live in one place, and all three are driven by the same
  `ScrollFadeController` — the table no longer uses a scroll-progress timeline, so
  a short, non-scrolling table no longer shows a phantom fade either. The fade is
  also deeper now (`--ds-space-8`) for a more obvious cue.

## 0.13.2

### Patch Changes

- db10aec: `ds-table` `scroll-body`: in the stacked (mobile) layout the header is hidden, so
  the top fade is no longer offset by the header height — it now fades from the
  very top like the dialog and drawer.

  The scroll-driven fade keeps its original at-rest cues: the top edge fades once
  you scroll down, and the bottom edge fades while there is more content below.
  (Reverts the earlier experiment that hid the resting-edge fade.)

## 0.13.1

### Patch Changes

- 92ed746: `ds-dialog`, `ds-drawer`, `ds-table`: the scroll-driven fade no longer shows a
  phantom fade on content that isn't scrollable. The resting keyframe now paints
  no fade, so a panel that fits its content stays clean even on engines that clamp
  an inactive scroll-progress timeline to its 0% keyframe instead of deactivating
  it. Trade-off: a scrollable surface no longer shows the bottom fade at its exact
  resting top (it appears as soon as you scroll).

  `ds-table` `scroll-body`: in the stacked (mobile) layout the header is hidden, so
  the top fade is no longer offset by the header height — it now fades from the
  very top like the dialog and drawer.

## 0.13.0

### Minor Changes

- b40e335: `ds-table`: add a `scroll-body` attribute. When set, the body scrolls under a
  pinned header (the `footer` slot stays pinned too). The scrollbar is hidden and
  overflow is signalled by scroll-driven top and bottom fades (about half a row
  deep so the cue stays visible), with the top fade offset below the header so it
  dims the body, not the header. The header pins to a fixed, CSS-configurable
  `--ds-table-header-height` (no JS measurement), and natural `table-layout: auto`
  column widths are preserved, and headers never wrap so the header row keeps a
  constant height. The overscroll bounce is suppressed so the rubber-band does
  not glitch against the pinned header and scroll-fade. The host must be given a
  bounded height by its container (e.g. `flex: 1` in a flex column).

  Header and body cell padding is slightly reduced (`--ds-space-2 --ds-space-3`)
  for denser rows. The scroll-driven fade used by `ds-dialog`, `ds-drawer` and
  `ds-table` is now a single shared definition (`--ds-scroll-fade-top` /
  `--ds-scroll-fade-bottom` + the `ds-scroll-fade` keyframes).

## 0.12.0

### Minor Changes

- e3f3ff1: Add `ds-progress-bar`, a determinate horizontal progress indicator.
  - `value` / `max` drive the fill (clamped to 0–100%); the track exposes
    `role="progressbar"` with `aria-valuemin` / `aria-valuemax` / `aria-valuenow`.
  - A default slot renders an optional label on a small card-like chip centred
    both ways over the bar, so the text stays legible regardless of the fill
    colour behind it. The chip is hidden automatically when no label is provided.
  - The bar is `1.5rem` tall by default and filled with `--ds-color-success`.
    Both are overridable via CSS parts: `::part(track)` for height (and track
    background/radius), `::part(indicator)` for the fill colour, and
    `::part(label)` for the chip.

## 0.11.3

### Patch Changes

- 9d2d6b4: - `ds-radio` and `ds-checkbox` now render crisply and stay centred on 1x / scaled external monitors. The controls used a `1.5px` border and fractional `rem` dimensions, which don't land on the device-pixel grid at 100% zoom: the browser splits the half-pixel border unevenly (shifting the dot off-centre) and offsets the checkbox tick by a fractional amount (blurring its diagonal edge). Both controls now use a `2px` border and integer-resolving sizes (`1rem` box, `0.5rem` radio dot, `1rem` tick) so every offset is a whole pixel.
  - Indicators (`ds-radio`'s dot and `ds-checkbox`'s tick) keep their size next to wide labels (`flex-shrink: 0`).
  - The control label uses `line-height: 1` so the 16px box defines the row height and lands on a whole pixel. Previously the box was vertically centred against the inherited (fractional) text line box, nudging it onto a half-pixel — invisible for the round radio dot but enough to smear the checkbox tick's diagonal edge on a 1x display.

## 0.11.2

### Patch Changes

- 67b6139: - `ds-drawer`'s close button now sits in its natural flex position inside the title row, vertically centred with the title. Removed the negative-margin offset that was carried over from `ds-dialog`; that offset was there to compensate for the dialog's 24px card padding pulling the X button away from the corner, but the drawer's title row owns its own padding (and is often 0-padded in the page-shell sidenav case), so the offset just produced a misaligned button.
- 87d2316: - `ds-drawer` no longer shows a 1px white strip around the card. The previous `border-color: transparent` on `ds-card::part(card)` kept a 1px border _width_, and ds-card's white background filled the border area via the default `background-clip: border-box`. Replaced with `border: 0`.
  - `ds-drawer`'s title row now vertically centres its slotted brand and close button. The h2 wrapping the title slot had its default line-height inflating the row's height, pushing content to the baseline. Made `.title-text` a flex container with `align-items: center` and `line-height: 1` so the title row collapses to the actual content height and `align-items: center` on the title row can do its job.

## 0.11.1

### Patch Changes

- 7514ee2: - `ds-drawer`'s `.card` now fills the dialog's full viewport height (`height: 100vh / 100dvh`) instead of sizing to its content. Fixes a regression where short drawer content (e.g. a 4-item sidenav in `ds-page-shell`'s mobile nav) caused the visible drawer to stop partway down the screen, leaving the page bleeding through below the drawer's bottom edge.
  - New `--ds-drawer-title-min-height` CSS variable on `ds-drawer` so consumers can match the title row to their surrounding chrome height.
  - `ds-page-shell`'s mobile-nav drawer now sets `--ds-drawer-title-min-height: 48px` and `--ds-drawer-title-padding: 0 var(--ds-space-4)` so the title row is the same height as `ds-top-bar` (48px). Before this fix the title row was visibly taller than the topbar because its block padding inflated the natural height of the slotted brand element.

## 0.11.0

### Minor Changes

- 3040b76: - `ds-drawer` now exposes CSS custom properties so consumers can theme the title-row chrome and remove the default card padding when the drawer's content (e.g. a navigation list) wants to reach the panel edges. New vars:
  - `--ds-drawer-card-padding` (default `var(--ds-space-6)`) — controls the inset of all drawer content inside the underlying `ds-card`. Set to `0` to let slotted body content go full-width and let the title-row chrome paint edge-to-edge.
  - `--ds-drawer-title-bg` (default `transparent`) — title-row background.
  - `--ds-drawer-title-fg` (default `inherit`) — title-row foreground; also applied to the close button so the icon keeps contrast against a coloured background.
  - `--ds-drawer-title-border-color` (default `transparent`) — bottom border on the title row.
  - `--ds-drawer-title-padding` (default `0`) — inline / block padding on the title row, useful when `--ds-drawer-card-padding` is `0` so the title row carries its own breathing room.
  - `ds-page-shell`'s mobile-nav drawer now wires those vars through from the existing `--ds-page-shell-drawer-header-bg` / `-fg` / `-border-color` contract that was preserved from the pre-0.10.0 page-shell. Consumer apps that set those vars on the page-shell host (e.g. xwords' `AppShell.vue` mapping them to its topbar colours) get the same blue-header / themed drawer look back without any app-side changes. The card padding is force-set to `0` for the page-shell drawer use case so sidenav items reach the drawer's inline edges.

### Patch Changes

- 6919eae: - `ds-dialog` and `ds-drawer` body now scrolls when content overflows the modal's height cap. The previous `ds-card::part(card) { height: 100%; max-height: 100% }` chain didn't resolve reliably through `ds-card`'s `display: block` host — when the percentage broke, `.card` sized to its content, the body's `flex: 1 + overflow-y: auto` had no height to scroll against, and overflowing content painted outside the dialog. Replaced both percentages with an explicit viewport-based cap (`min(90vh, 720px)` for dialog, `100dvh` for drawer) so the body always has a constrained parent height to flex inside of.
  - `ds-dialog` now also has an 8px minimum horizontal gutter on narrow viewports. Switched `width: 100%` to `width: calc(100% - var(--ds-space-4))` — native `margin: auto` continues to centre the dialog within whatever space remains after `max-width` caps it, so wider viewports are unchanged.

## 0.10.0

### Minor Changes

- 0fcebad: - New `ds-drawer` molecule: edge-anchored modal panel built on the native `<dialog>` element, mirroring `ds-dialog`'s API and chrome. Pinned at `side="start"` or `side="end"`, sized via `size="sm" | "md" | "lg"` (capped at `90vw` on narrow viewports), with the same sticky title row, scrolling body and footer slots, and the same `square sm` close-button affordance you get in `ds-dialog`. Inherits all of `ds-dialog`'s free benefits from the native `<dialog>`: top-layer rendering (escapes ancestor overflow/clip), focus trap, Escape-to-close, automatic `aria-modal`. Slide-in animation via CSS transform + `@starting-style`, slide-out via `transition-behavior: allow-discrete`. Body region uses the same focus-ring escape trick as `ds-dialog` (`padding-inline` + matching negative `margin-inline`) so focused full-width children's outlines paint fully. Replaces the need for bespoke teleported `<aside>` drawers in consumer apps.
- c9c7c44: - `ds-page-shell`'s mobile navigation now wraps its `aside` slot in a `ds-drawer` instead of hand-rolling its own slide-in chrome. This unifies the visual language across mobile nav and consumer-built drawers (same square `sm` close button, same backdrop, same animation), and the mobile nav inherits all of `ds-drawer`'s free benefits: native focus trap, top-layer rendering, automatic `aria-modal`, Escape-to-close. The bespoke `.mobile-backdrop` element, `.drawer-header` row, and all mobile-drawer positioning/animation CSS were deleted.

  **Breaking changes to the parts API:**
  - Removed parts: `drawer-header`, `drawer-brand`, `drawer-close`. Consumers styling these directly will need to migrate to `ds-drawer`'s own parts (`close-button`, etc.) via the page-shell's `aside` part, e.g. `ds-page-shell::part(aside)::part(close-button)`.
  - Removed CSS custom properties: `--ds-page-shell-drawer-header-bg`, `--ds-page-shell-drawer-header-fg`, `--ds-page-shell-drawer-header-border-color`, `--ds-page-shell-drawer-header-height`, `--ds-page-shell-drawer-close-hover-bg`. The drawer header is now `ds-drawer`'s title row inside its own shadow DOM; restyle through `ds-drawer`'s tokens or its `close-button` part instead.

  **Preserved public API:**
  - `drawer-brand` slot (now forwards into `ds-drawer`'s `title` slot)
  - `menu-toggle` button + `aria-expanded`
  - `data-mobile-nav-open` host attribute
  - `aside` part name (now applies to the `ds-drawer` element in mobile layout, plain `<aside>` in desktop)
  - All desktop-layout behavior unchanged.

### Patch Changes

- 8e3d42b: - Dropped the `backdrop-filter: blur(2px)` from `ds-dialog` and `ds-drawer`'s `::backdrop`. The dark overlay alone is enough to signal modality, the blur was decorative, and removing it cuts paint cost on lower-end devices. With no blur, the page-behind-modal looks less visually busy on the rare occasion that the user scrolls _over the backdrop_ (which is allowed by design — modal content's own scroll is still contained by `overscroll-behavior: contain` on the body, but scrolling over the backdrop is now treated as a deliberate user choice to look at the page, the same way Notion / Linear / GitHub modals behave).
- 6053562: - Closed `ds-dialog` and `ds-drawer` no longer render their content inline below the page. The flex-column rule I added previously to make the body scroll on short viewports was applied to `dialog` unscoped, which overrode the UA's `dialog:not([open]) { display: none }` default — so storybook docs pages (and any consumer with a closed dialog in the DOM) would show the dialog's title and content rendered inline alongside its trigger. Scoped the rule to `dialog[open]` so closed dialogs stay hidden by the UA default; open dialogs still get the flex column for height-cap propagation.
  - Bumped the body fade-mask zone from `var(--ds-space-5)` to `var(--ds-space-7)` on both `ds-dialog` and `ds-drawer`. The previous size was readable but easy to miss against light backgrounds; the bigger band makes the "more content here" cue noticeably more obvious without crossing into "feels cropped" territory.
- ae94a65: - `ds-dialog` and `ds-drawer` no longer leak scroll to the page behind them. Wheel/touch scrolling at the top of the body when there's nothing above (or in a body that doesn't overflow at all) used to chain up to the document and shift the underlying page, even though the modal itself was on top. Added `overscroll-behavior: contain` on the scrollable body part — the scroll stops at the modal's boundary instead of escaping to whatever's behind it.
- fa21a3b: - `ds-dialog` and `ds-drawer` no longer rely on a `padding-block` buffer to keep their body edges sharp at rest. The fade-mask is now driven by an actual scroll-progress timeline (`animation-timeline: scroll(self)`), so the top fade only appears once the user has scrolled and the bottom fade flips off as you reach the end of the content. With no scroll progress = no top fade and no bottom fade, content sits sharp against the body edges. The `padding-block: var(--ds-space-8)` (32px) buffer that v0.9.x added has been removed entirely, recovering ~64px of vertical real estate per modal. Implementation uses two `@property`-declared color custom properties (`--ds-{dialog,drawer}-body-top-fade` / `-bottom-fade`) so the keyframes can crossfade gradient stops instead of jumping. Falls back gracefully on browsers without `animation-timeline` support: the initial-values render both stops opaque (no fades), so older browsers just see a hidden scrollbar with natural content truncation.
- 08eea74: - `ds-dialog` and `ds-drawer` bodies hide the native scrollbar and signal overflow with a soft top / bottom fade-mask instead. Before, the native vertical scrollbar floated mid-way inside the card's right padding (a side-effect of the focus-ring escape padding-margin trick), which looked uncanny. The bar is now hidden via `scrollbar-width: none` + `::-webkit-scrollbar { display: none }`, and a `mask-image` linear-gradient fades the top and bottom edges of the body. A matching `padding-block: var(--ds-space-3)` keeps content out of the fade zone at rest so edges stay sharp when nothing overflows; when content scrolls past that buffer it visibly fades into transparency, indicating more content above or below. Aligns with Linear, Notion and most modern modal surfaces.
- ef79e77: - `ds-dialog`'s body now reliably scrolls when content exceeds the dialog's max-height, including on short mobile viewports. The native `<dialog>` element was given `max-height: min(90vh, 720px)` and `overflow: visible` but no explicit `height`, and the inner `ds-card` used `height: 100%` to fill — but `height: 100%` only resolves against a parent with an _explicit_ height, not just `max-height`, so it computed to `auto`, `ds-card` sized to its content, and the body's `flex: 1 + overflow-y: auto` never got a height to scroll against. Overflowing content painted visibly past the dialog edge instead, most noticeably on mobile where `90vh` actually bit. Switched `<dialog>` to `display: flex; flex-direction: column` and `ds-card` to `flex: 1; min-height: 0` so the height cap propagates and the body scrolls.
- c3f9db5: Expose PageShell mobile drawer header parts and theme hooks so apps can align drawer chrome with their top bar.
- ff76ccc: Default PageShell to a fluid content width. PageShell and SettingsPage stories now use the fluid default, with one PageShell story explicitly showing the capped layout opt-in.

## 0.9.13

### Patch Changes

- 3cda329: - `ds-dialog`'s body now reliably lets focus rings on full-width children (`ds-select`, `ds-text-field`, etc.) escape its inline clip box, even in browsers where `overflow-clip-margin-inline` is silently ignored. Replaced the previous `overflow-clip-margin-inline` declaration — which the spec says applies to a single clipped axis, but which renders inconsistently across recent Chromium/Firefox/Safari builds — with a `padding-inline: var(--ds-space-2)` + matching negative `margin-inline` pair. The scrollport edge moves outward 8px past the original content edge so focused children's box-shadow rings paint inside it, while the negative margin keeps the visible content area exactly where it was. No reliance on a partially-supported CSS property.

## 0.9.12

### Patch Changes

- ff033eb: - `ds-dialog`'s body now actually lets focus outlines escape its inline padding edge. The previous fix added `overflow-clip-margin` but kept `overflow-y: auto`, and per spec `overflow-clip-margin` only applies when `overflow` is `clip` — so it was a no-op and a focused `ds-select` or `ds-text-field` still had its left/right outline shaved off. Switched to `overflow-x: clip; overflow-y: auto` with `overflow-clip-margin-inline`, which gives outlines ~8px of breathing room on the inline axis while preserving block-axis scrolling.
- 05278e7: - `ds-page-shell`'s `aside` and `main` regions no longer clip focus outlines on the inline axis. The aside already used `overflow-x: clip; overflow-y: auto;` so a focused `ds-nav-item` near the inline edge had its left/right outline shaved off; added `overflow-clip-margin-inline: var(--ds-space-2)` to let outlines escape while preserving the vertical scroll. `main` was `overflow: auto` (both axes scroll), where `overflow-clip-margin` has no effect by spec — switched it to `overflow-x: clip; overflow-y: auto` so the inline axis stops being a scrollport and outlines get the same breathing room. Consumers who relied on horizontal page scrolling now need to enable it on their own wrapper.

## 0.9.11

### Patch Changes

- a08e779: - `ds-dialog`'s body region no longer clips focus outlines (or any other decoration that extends a few pixels beyond a child's border box). The body needs `overflow-y: auto` for scroll, and `overflow-y` clipping applies to both axes by spec, so previously a focused `ds-select` or `ds-text-field` inside a dialog showed its top/bottom outline but had the left/right sides shaved off where they crossed the body's padding edge. Added `overflow-clip-margin: var(--ds-space-2)` so non-scrolling overflow (outlines, ring decorations, popover shadows) gets ~8px of breathing room beyond the clip box before being trimmed; scrolling content still clips at the same boundary it did before.

## 0.9.10

### Patch Changes

- 89ba94e: - `ds-card`'s `.body` now grows to fill leftover height (`flex: 1`) regardless of orientation. Previously this only applied to horizontal cards, which meant that when a parent grid or flex container stretched several vertical cards to a common height, their bodies stayed content-sized and their actions / footer rows ended up at different Y positions — `Card A` footer halfway down, `Card B` footer at the bottom, etc. With body growing, the bottom block (actions, footer) is anchored to the card's bottom edge so footers line up across rows. Cards in an auto-height context are unchanged — body still wraps its content because there's no leftover space to absorb. The narrow-container override that resets body back to `flex: unset` for horizontal cards is unchanged.
- 3537373: - `ds-dialog`'s header close button is now a `ds-button` (variant=ghost, size=md, square) with the `x-mark` icon instead of a hand-rolled `<button>` + inline SVG. Same `part="close-button"` exposure, same `Close` aria-label, and clicks still emit `ds-close` with `{ returnValue: 'close' }`. Visual upshot: the hit area grows from 32px to ds-button's sm size, hover / focus / disabled states match every other action in the system, and the button sits closer to the card's top-right corner via negative margin offsets that absorb part of `ds-card`'s padding instead of leaving the X stranded mid-padding. The X icon's size is now 2xl.

## 0.9.9

### Patch Changes

- a317876: - `ds-dialog` normalises any element slotted into the `title` slot. Previously a consumer who wrote `<h2 slot="title">Foo</h2>` (a perfectly reasonable semantic choice) got the inner heading's UA defaults applied on top of the dialog's own `.title-text` styling — a `font-size: 1.5em` compound that made the title visibly larger than `--ds-font-size-xl`, plus large UA `margin-block` that pushed the dialog body down. Added a scoped `.title-text ::slotted(*) { font: inherit; margin: 0; letter-spacing: inherit; }` so plain text, spans, and h1-h6 all render at the dialog's intended size with no extra spacing.
- 81e2db9: - `ds-select` now renders its dropdown via the Popover API. Browsers that support `HTMLElement.prototype.showPopover` hoist the listbox into the top layer, so it escapes any `overflow: hidden` / `overflow: auto` ancestor (dialogs, scroll containers, fixed-height panels) instead of being clipped or expanding the container. JS positions the popover under the trigger via `position: fixed` and the trigger's bounding rect, flipping above when there isn't enough room below. Scroll and resize listeners re-position the popover while it's open, and the listeners self-clean on close / disconnect. Browsers without Popover API support keep the existing in-flow `position: absolute` behaviour so they still work — they just clip in dialogs as before.

## 0.9.8

### Patch Changes

- 08486eb: - `ds-table-pagination` no longer flashes its active page button back to the muted surface colour on hover. The generic `button:hover:not(:disabled)` rule was outranking the `[aria-current="page"]` rule on specificity, so the navy/accent active state was overwritten with grey as soon as the pointer touched it. Added an explicit `button[aria-current="page"]:hover:not(:disabled)` step using the existing `--ds-color-accent-hover` token, so the active button stays on-brand throughout hover.

## 0.9.7

### Patch Changes

- d72c7ef: - `ds-table-pagination` now adapts to narrow containers automatically. A ResizeObserver flips the new reflected `compact` attribute on whenever the host renders below ~480px. In compact mode the Previous / Next buttons collapse to icons only (their text label is hidden but stays in the DOM so consumers can re-show it via `::part(prev-next-label)`), the visible page range tightens to "first … current … last", and `sibling-count` is forced to 0. The `compact` boolean property / attribute can also be set explicitly by consumers if they want to opt into the layout at wider widths.
  - `buildPaginationRange` no longer silently clamps `maxVisiblePages` up to 5. The minimum is now 3, which is what the new compact mode needs. Callers that were already passing 5+ are unaffected.
  - The Previous / Next button now exposes its slotted label through a new `prev-next-label` csspart, so consumers can target the text region (e.g. to keep labels visible at narrow widths) without leaking into other parts of the button.

## 0.9.6

### Patch Changes

- 2349175: - `ds-table` no longer renders its `toolbar` and `footer` wrapper divs when nothing is slotted into them. Previously both wrappers were always in the DOM (just hidden via `:empty { display: none }`), which gave them part(toolbar) / part(footer) presence even when unused and could interfere with consumer CSS that targets those parts. The component now mirrors the existing `caption` slot pattern: a MutationObserver tracks whether any element with `slot="toolbar"` or `slot="footer"` is present and skips rendering the wrapper otherwise.

## 0.9.5

### Patch Changes

- 29debdf: - Expose the `<table>`'s outer scroll wrapper as `part(scroll)` on `ds-table`. Consumers can now delegate vertical scrolling to it (or re-target the scroller entirely) without having to break the table layout from outside. Useful for fixed-header + scrolling-tbody patterns where the host needs to be a flex column and the scroll wrapper needs to carry the remaining height.

## 0.9.4

### Patch Changes

- 4d01634: - Move nested `ds-nav-group` item indentation onto each child nav control and add spacing between the group heading and its nested items.

## 0.9.3

### Patch Changes

- 84314fc: - Stretch `ds-nav-item` controls to full width when rendered inside `ds-nav-group`.
- 1dcaf00: - Move nested `ds-nav-group` item indentation onto each slotted `ds-nav-item` and add spacing between the group heading and its nested items.

## 0.9.2

### Patch Changes

- baf76ce: - Render the internal `<caption>` element only when `slot="caption"` content is provided.
  - Add `responsive="stack" | "scroll"` to `ds-table`, defaulting to stacked rows in narrow containers.
  - Make the table skeleton use compact stacked cards in narrow containers when responsive stacking is enabled.
  - Align stacked table skeleton cells with the real label/value mobile layout and allow long stacked content to wrap.

## 0.9.1

### Patch Changes

- 9b0edc7: - Treat `ds-table` `loading` as a boolean property without reflecting it to a string attribute.
  - Parse `loading="false"` and `loading="0"` as false for string-based integrations.
  - Prioritize the skeleton state when `loading` is true and no rows are present; keep the loading overlay for refreshes with existing rows.

## 0.9.0

### Minor Changes

- a4d7075: - Make `lg` the default `ds-icon` size and use a distinct rem-based size scale from `sm` through `3xl`.
  - Add table loading states with a customizable `loading` slot and skeleton fallback rendering while columns are not initialized.
  - Tune `ds-skeleton` shimmer timing, make the animation loop seamless, and disable shimmer for reduced-motion users.
  - Add opt-in token-based utility CSS entry points for spacing, layout, and typography helpers.

## 0.8.0

### Minor Changes

- acde301: - e8660bc: Increase spacings from ds-space-1 to ds-space-2 in case of leading and trailing slots and also some horizontal list elements
  - acde301: Generate and export all Heroicons outline icons as `@jsekulowicz/ds-components/icon/<name>` modules, with `icon/all` and `icon/names` helper exports.

## 0.7.2

### Patch Changes

- 8626736: Add standalone NavGroup docs, align nav group heading styles with nav items, and avoid rendering an empty nav group icon wrapper.

## 0.7.1

### Patch Changes

- 4c544df: Constrain `ds-page-shell` to the viewport so its internal main region owns page scrolling instead of the document.

## 0.7.0

### Minor Changes

- d29c384: `ds-top-bar` and `ds-footer` now wrap their content in an inner wrapper whose max-width is configurable via `--ds-top-bar-content-max-width` / `--ds-footer-content-max-width` (default `none`). Chrome (background, border, fixed height) still spans the full element width.

  `ds-page-shell` sets both properties to `var(--ds-page-shell-max-width)` on the embedded top-bar and on any slotted `ds-footer`, so on viewports wider than the shell's content cap the top-bar's brand/actions and the footer's start/end regions align with the aside + main columns below.

## 0.6.1

### Patch Changes

- f71cbfb: Give `ds-page-shell` real 16px inline padding below the desktop breakpoint instead of relying on scrollbar gutter width to approximate the mobile content spacing.

## 0.6.0

### Minor Changes

- 529dda9: Replace the former Navbar component with TopBar and align the surrounding page chrome.
  - `ds-navbar` has been removed in favor of `ds-top-bar`. The new TopBar is a simpler application chrome component with `brand` and `actions` slots only; primary navigation should live in `ds-sidenav` or other navigation components.
  - Component package imports move from `@jsekulowicz/ds-components/navbar` to `@jsekulowicz/ds-components/top-bar`.
  - React wrapper consumers should replace `Navbar` with `TopBar`.
  - `ds-page-shell` now composes `ds-top-bar` in its header, preserves the footer slot without an extra shell wrapper, and keeps main/footer/header alignment consistent.
  - `ds-footer` and `ds-top-bar` now use fixed chrome heights with symmetric inline padding.
  - Breadcrumb item focus rings have a little more horizontal breathing room.

## 0.5.4

### Patch Changes

- c2d60d1: Center `ds-page-shell` brand slot content vertically in the header.

## 0.5.3

### Patch Changes

- f5ff508: Add the `3xl` icon size at `1.75rem` and use it for design-system mobile menu buttons.

## 0.5.2

### Patch Changes

- fdb812e: Add the `user-circle` icon export, keep mobile menu triggers as bars icons while open, order mobile `ds-page-shell` header content as brand, menu toggle, then header actions, and hide `ds-navbar`'s mobile toggle when no links are slotted.

## 0.5.1

### Patch Changes

- de6c4d6: Align `ds-sidenav` and mobile drawer spacing with page-shell chrome, and add a `drawer-brand` slot for mobile drawer branding while preserving compact horizontal padding in collapsed mode.

## 0.5.0

### Minor Changes

- e7b6442: Two layout improvements to `ds-page-shell` raised from a consumer integration:
  - **The desktop aside now sits flush with its column edge.** The aside previously used `scrollbar-gutter: stable`, permanently reserving ~14 px on the inline-end side for a potential scrollbar. Stacked with `<main>`'s padding, that produced a noticeably asymmetric horizontal gap between aside content and main content that consumers couldn't account for in their own layout. The base aside selector drops the reservation so `<main>` solely owns the gap; the scrollbar appears on demand when the aside genuinely overflows. The mobile drawer keeps `scrollbar-gutter: auto` as before.
  - **New `aside-end` slot.** Mirrors the existing `aside` (inline-start) for inline-end side regions — table-of-contents columns, contextual help panels, etc. Driven by a new `end-label` attribute (defaults to `Secondary navigation`) applied as `aria-label` on the secondary `<aside>`. The grid template adapts to which sides are populated (`auto 1fr auto` / `1fr auto` / `auto 1fr` / `1fr`). Mobile layout hides the inline-end region in v1; consumers can re-surface it via `::part(aside-end)`. The primary aside now also receives `aria-label` from `menu-label` for a11y parity.

### Patch Changes

- 96eeb67: **`ds-page-shell` — symmetric scrollbar gutter on `<main>`.** When `<main>`'s content exceeds the viewport, `overflow: auto` brings in a vertical scrollbar that consumed ~14 px on the inline-end side only, leaving the inline-start padding intact. Visually the content sat off-centre — smaller left margin than right. Adds `scrollbar-gutter: stable both-edges` to `<main>` so a gutter is reserved on both inline sides regardless of whether the scrollbar is currently visible; horizontal content position stays consistent and both visual margins match.

  Below the desktop breakpoint, `<main>` now uses compact responsive padding: `var(--ds-space-4) var(--ds-space-2)`. This keeps 20 px padding on desktop, while mobile and tablet layouts use 16 px vertical and 8 px horizontal padding without changing the symmetric scrollbar gutter behavior.

  Page chrome padding is now aligned across `ds-page-shell`, `ds-footer`, and `ds-navbar`: header and footer regions use 20 px horizontal padding on desktop and 16 px below the desktop breakpoint.

  `ds-icon` now supports `xl` (20 px) and `2xl` (24 px) sizes, and the PageShell/Navbar menu toggles use `xl` for clearer 20 px menu icons. The labeled icon role binding now uses `ifDefined` so Lit's type checker no longer reports an incompatible `role` binding.

- Updated dependencies [e7b6442]
- Updated dependencies [96eeb67]
  - @jsekulowicz/ds-core@0.5.0
  - @jsekulowicz/ds-tokens@0.5.0

## 0.4.1

### Patch Changes

- ba32207: Two bug fixes raised from a consumer integration:
  - **`FormControlMixin` (ds-core):** form-associated DS controls (`ds-text-field`, `ds-select`, `ds-checkbox`, `ds-radio`, …) now submit the surrounding form when **Enter** is pressed inside the field, matching native input behaviour. The host listens for `keydown` and calls `internals.form.requestSubmit()` (falling back to `closest('form')` for environments without full `ElementInternals` form association). Bare Enter only — modifier keys, IME composition, disabled state, and `textarea`-typed controls are skipped.
  - **`ds-page-shell`:** `<main>` now declares `min-width: 0` and `overflow: auto`. Without `min-width: 0`, a CSS grid item's intrinsic minimum is `auto`, so a wide descendant (long unwrapped string, wide table, `flex-wrap: nowrap` row) would push the `1fr` content track past the viewport and cause the whole page to scroll horizontally. `overflow: auto` keeps any truly oversized content scrollable inside `<main>` (rather than clipping it or letting it escape into the page chrome).

- Updated dependencies [ba32207]
  - @jsekulowicz/ds-core@0.4.1
  - @jsekulowicz/ds-tokens@0.4.1

## 0.4.0

### Minor Changes

- 1dcf3a2: Update component visuals, responsive behavior, and release tooling.
  - Added `ds-button square` for icon-sized square buttons.
  - Changed the display font token from Fraunces to Source Serif 4.
  - Refined form and card action alignment across mobile, tablet, and desktop layouts.
  - Improved `ds-page-shell` footer handling so empty footers do not render and slotted footer content is tracked dynamically.
  - Shared common select/dropdown styles between `ds-select` and `ds-searchable-select`.
  - Added Playwright visual regression coverage and CI support for visual snapshot updates.
  - Improved Storybook docs previews, including viewport-sized examples and live light/dark theme sync inside story iframes.
  - Added lint coverage for Storybook files and unused imports.

### Patch Changes

- Updated dependencies [1dcf3a2]
  - @jsekulowicz/ds-tokens@0.4.0
  - @jsekulowicz/ds-core@0.4.0

## 0.3.1

### Patch Changes

- 25209ac: ### `ds-page-shell`: brand and main content now share the same x coordinate

  The 0.3.0 content cap left a 20 px gap between the brand text in the header and the first column of main content — header chrome had its horizontal padding on the `<header>` outer element, while main's padding was inside the centred column.

  The horizontal padding now lives on `.shell-inner` instead of `<header>`/`<footer>`, so brand, main content, and footer content all start at the same x at any viewport width. Header and footer chrome (border, sticky backdrop) still extend to the viewport edges.

- Updated dependencies [25209ac]
  - @jsekulowicz/ds-tokens@0.3.1
  - @jsekulowicz/ds-core@0.3.1

## 0.3.0

### Minor Changes

- 651ccb8: ### `ds-page-shell` caps and centres its content column on wide viewports

  The shell now keeps a single centred column for header inner content, the aside + main row, and footer inner content. On viewports above the cap (default `90rem` / 1440 px), brand, sidenav, and main all line up vertically; below the cap, layout is unchanged.
  - **New CSS custom property: `--ds-page-shell-max-width`.** Defaults to `90rem`. Consumers override per-app, e.g. `ds-page-shell { --ds-page-shell-max-width: 96rem; }` for a wider dashboard or `64rem` for a marketing-narrow look.
  - **Header and footer chrome stay full-bleed.** The sticky header's border + backdrop blur and the footer's border still extend to the viewport edges — only the content inside each is centred. That preserves the "application chrome" feel without sprawl.
  - **Aside + main share the cap.** When a sidenav is present, sidenav width + main width together equal the cap (sidenav at its natural width, main flexes to fill the rest). When the aside slot is empty, main alone fills the centred column.
  - **Mobile drawer behaviour is unchanged.** Below 768 px the aside still becomes an absolute drawer over main with backdrop and Escape-to-close.

  ### Internal restructure

  The shadow DOM gained two intermediate wrappers: `.shell-inner` inside `<header>` and `<footer>`, and a `.shell-body` (exposed as `part="body"`) wrapping aside + main. Direct selectors like `aside`, `main`, `.menu-toggle`, `.mobile-backdrop` are unchanged, so most consumer styles continue to work. If you were targeting the host's grid template directly with custom CSS, expect to update — the host now uses flex column with grid only inside `.shell-body`.

### Patch Changes

- Updated dependencies [651ccb8]
  - @jsekulowicz/ds-tokens@0.3.0
  - @jsekulowicz/ds-core@0.3.0

## 0.2.0

### Minor Changes

- 69f9cb6: ### New atoms
  - **`ds-divider`** — hairline separator with built-in vertical breathing room (--ds-space-3 top + bottom by default; vertical orientation does the equivalent on the inline axis). Renders `role="separator"` for assistive tech. New mdx + stories under Atoms/Divider.
  - **`ds-list` + `ds-list-item`** — vertical stack with `bordered` (default) or `plain` variants. Items expose leading / default / trailing slots; leading and trailing wrappers auto-hide when their slot is empty. The bordered variant doesn't clip overflow, so popovers anchored inside a row escape the list correctly.

  ### New icons (Heroicons v2)

  `eye`, `eye-slash`, `plus`, `moon`, `sun`. Available as `@jsekulowicz/ds-components/icon/<name>` side-effect imports.

  ### `ds-page-shell`
  - **Auto-detects empty `aside` slot.** When nothing is slotted in, the host reflects `aside-empty`, collapses to a single-column grid, and skips rendering the hamburger toggle, drawer, and aside region. Replaces the need for a `no-aside` prop — single-section apps work out of the box.
  - **Auto-detects empty `footer` slot.** Reflects `footer-empty` for downstream styling hooks.
  - **Footer wrapper is now bare** — no padding, no border-top. Slotted content (e.g. `ds-footer`) provides its own. Removes the duplicate divider visible in the SettingsPage example.
  - **Header padding** is now `--ds-space-2 / --ds-space-5` (8 px / 20 px); `align-items: center`. The horizontal padding matches main content padding so brand and header actions align with the start/end of the page.

  ### `ds-card`
  - Header (eyebrow + title) and footer regions auto-hide when their slots are empty — no more empty header strip on a body-only card.

  ### `ds-button`
  - Horizontal padding consolidated to `0 var(--ds-space-2)` across `sm` / `md` / `lg` (was `0 var(--ds-space-4)` and `0 var(--ds-space-5)`). Buttons now sit closer to their adjacent text and stay compact in toolbars.

  ### `ds-tooltip`
  - New `full-width` reflective attribute. When set, the host and the inner anchor stretch to fill their parent, so a tooltipped full-width button stays full-width instead of collapsing to inline-flex.

  ### `ds-breadcrumb-item` and `ds-badge`
  - Drop their horizontal cell padding. The trail's first item and badges now align flush with whatever sits below them (page title, content). Badges keep their internal 2 px / `--ds-space-2` padding for the chip shape.

  ### `ds-table-pagination`
  - Explicit `column-gap: --ds-space-4` / `row-gap: --ds-space-3`. Summary + nav stay on a single row at any reasonable width and only break onto two lines on truly narrow screens, with proper vertical breathing room when they do.

  ### `ds-footer`
  - Horizontal padding aligns with `ds-page-shell` header at `--ds-space-5` (was `--ds-space-6`) so when both pass through the page shell, the start and end edges line up exactly.

  ### Typography docs
  - Recommend `xl` (22 px) for page-level `h1`; `2xl`–`3xl` reserved for editorial moments.

### Patch Changes

- Updated dependencies [69f9cb6]
  - @jsekulowicz/ds-tokens@0.2.0
  - @jsekulowicz/ds-core@0.2.0

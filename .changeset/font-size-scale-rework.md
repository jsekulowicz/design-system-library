---
"@jsekulowicz/ds-tokens": minor
"@jsekulowicz/ds-components": minor
---

Rework the font-size scale for readability and consistency.

**Tokens** (`@jsekulowicz/ds-tokens`):

- Removed `--ds-font-size-3xs` (11px) and `--ds-font-size-2xs` (12px). Remap `2xs` usages to `xs` — the new `xs` equals the old `2xs` value, so no visual change.
- Retuned the scale to a rounder progression: `xs` 12px, `sm` 14px, `md` 16px, `lg` 20px, `xl` 24px, `2xl` 28px, `3xl` 32px, `4xl` 48px, `5xl` 64px. Value changes: `xs` 13→12px, `lg` 18→20px, `xl` 22→24px, `3xl` 36→32px.

**Components** (`@jsekulowicz/ds-components`):

- Body and control text now uses `md` (16px) by default. Buttons, text fields, text areas, selects, searchable selects, tabs, nav items, menu items and select options render at 16px regardless of `size` — the previous per-size font shrinking on controls is gone (a `size="sm"` button/input is no longer 12–13px).
- Alert and toast titles bump to `lg` to stay above the larger body text.
- Tooltip text goes from 12px to `sm` (14px).
- Checkbox and radio labels stay at `sm` (14px), consistent with form-field labels. Segmented control option labels also stay at `sm` (they are compact toggles, not primary buttons). Labels, descriptions, helper/meta text, tables and breadcrumbs also keep their smaller sizes for density.

# Design System Library

A framework-agnostic design system built on **Lit** web components, organized by **atomic design**, themeable via a three-tier token layer, responsive by default, tree-shakable (JS and CSS), and accessible to WCAG 2.2 AA.

## Packages

| Package | Description |
| --- | --- |
| [`@ds/tokens`](./packages/tokens) | Design tokens (primitive, semantic, component) + CSS themes |
| [`@ds/core`](./packages/core) | `DsElement` base class, `FormControlMixin` (ElementInternals), controllers, utils |
| [`@ds/components`](./packages/components) | Web components (atoms, molecules, organisms, templates, pages) |
| [`@ds/icons`](./packages/icons) | Tree-shakable icon set powering `<ds-icon>` |
| [`@ds/react`](./packages/react) | Thin React wrappers generated from the Custom Elements Manifest |
| [`@ds/storybook`](./packages/storybook) | Storybook docs site (live examples, API tables, dos/don'ts, design intent) |

## Getting started

```sh
pnpm install
pnpm build
pnpm dev          # Storybook
pnpm test         # Vitest (component) across packages
pnpm test:e2e     # Playwright
pnpm test:a11y    # axe-core against every story
```

## Consumer usage

```ts
import '@ds/tokens/theme-default-light.css';
import '@ds/components/button/define';

// Or the typed class-only import:
import { DsButton } from '@ds/components/button';
```

See the [implementation plan](../../.claude/plans/noble-prancing-thacker.md) for architecture details.

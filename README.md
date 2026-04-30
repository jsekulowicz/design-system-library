# Design System Library

A framework-agnostic design system built on **Lit** web components, organized by **atomic design**, themeable via a three-tier token layer, responsive by default, tree-shakable (JS and CSS), and accessible to WCAG 2.2 AA.

Live Storybook docs: https://jsekulowicz.github.io/design-system-library

## Packages

| Package | Description |
| --- | --- |
| [`@ds/tokens`](./packages/tokens) | Design tokens (primitive + semantic layers) + generated CSS themes |
| [`@ds/core`](./packages/core) | `DsElement` base class, `FormControlMixin` (ElementInternals), controllers, utils |
| [`@ds/components`](./packages/components) | Web components (atoms → molecules → organisms → templates → pages) |
| [`@ds/react`](./packages/react) | Thin React wrappers generated from the Custom Elements Manifest via `@lit/react` |
| [`@ds/storybook`](./packages/storybook) | Storybook docs site (live examples, API tables, design intent, foundations) |

## Components

**Atoms** — `ds-badge`, `ds-breadcrumb`, `ds-button`, `ds-checkbox`, `ds-checkbox-group`, `ds-icon`, `ds-link`, `ds-nav-item`, `ds-nav-group`, `ds-radio`, `ds-radio-group`, `ds-searchable-select`, `ds-select`, `ds-table`, `ds-tabs`, `ds-text-field`, `ds-tooltip`

**Molecules** — `ds-alert`, `ds-bar-chart`, `ds-card`, `ds-field`

**Organisms** — `ds-footer`, `ds-form`, `ds-navbar`, `ds-sidenav`

**Templates** — `ds-page-shell`

**Pages** — `ds-settings-page`

## Getting started

```sh
pnpm install
pnpm build          # build all packages
pnpm dev            # start Storybook with watch mode
pnpm test           # Vitest unit tests across all packages
pnpm test:e2e       # Playwright end-to-end tests
pnpm test:a11y      # axe-core accessibility tests against every story
pnpm lint           # ESLint + Stylelint across all packages
pnpm typecheck      # TypeScript type-check across all packages
```

## Consumer usage

### Install tokens and a component

```ts
// Load the default theme (light + dark, switches via data-ds-theme on <html>)
import '@ds/tokens/theme-default.css';

// Register individual components on demand (tree-shakable)
import '@ds/components/button/define';
import '@ds/components/text-field/define';
```

### Use in HTML

```html
<ds-button variant="primary">Save</ds-button>
<ds-text-field label="Email" type="email"></ds-text-field>
```

### Use in React

```tsx
import { DsButton, DsTextField } from '@ds/react';

export function MyForm() {
  return (
    <>
      <DsTextField label="Email" type="email" />
      <DsButton variant="primary">Save</DsButton>
    </>
  );
}
```

### Theming

Override semantic CSS custom properties on any ancestor to retheme all child components. No component source changes needed.

```css
:root {
  --ds-color-accent: #E2341D;
  --ds-color-accent-hover: #C12613;
  --ds-radius-sm: 8px;
  --ds-radius-md: 16px;
}
```

Dark mode is applied by setting `data-ds-theme="dark"` on `<html>`. Light mode is the default; `data-ds-theme="light"` makes it explicit. The `color-scheme` property is set automatically so native UI elements (scrollbars, form controls) follow the active theme.

### Class-only import (no side-effects)

```ts
import { DsButton } from '@ds/components/button';
customElements.define('ds-button', DsButton);
```

# Visual Screenshot Tests

Visual tests use Storybook iframe stories as fixtures and Playwright screenshots as the assertion
layer. Static component matrices run at desktop width; stateful and composed components run at
mobile, tablet, and desktop widths.

## Commands

```sh
pnpm test:visual
pnpm test:visual:update
```

Use local updates for iteration only. The authoritative baseline should come from the GitHub
Actions visual snapshot workflow so screenshots are generated on the same Linux Chromium runtime
that verifies pull requests.

## Adding Coverage

Add scenarios in `tests/visual/scenarios.ts`. Prefer small named screenshots over one large catalog
page. Use `selector: '#storybook-root'` for compact static stories and page screenshots for popovers,
dialogs, responsive layouts, and other states where surrounding layout matters.

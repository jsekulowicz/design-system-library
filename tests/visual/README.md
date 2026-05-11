# Visual Screenshot Tests

Visual tests use Storybook iframe stories as fixtures and Playwright screenshots as the assertion
layer. Static component matrices and width-stable popovers run at desktop width. Stateful layouts
that actually respond to viewport changes run at mobile, tablet, and desktop widths.

## Commands

```sh
pnpm test:visual
pnpm test:visual:update:ci
```

Use `pnpm test:visual` to verify the current branch against committed baselines.
When visual tests fail in CI, download the `playwright-visual-diffs` artifact to inspect the
`*-expected.png`, `*-actual.png`, and `*-diff.png` files directly.

Use `pnpm test:visual:update:ci` when the current branch is clean and pushed. It dispatches the
GitHub Actions workflow for the current branch and lets CI commit updated PNG baselines when
screenshots changed. It uses GitHub CLI when available and prints manual workflow dispatch steps
when `gh` is not installed or authenticated.
The CI workflow removes the screenshot directory before updating so stale baselines are deleted
automatically.

Do not update committed baselines locally. Local rendering depends on OS, fonts, browser binaries,
and graphics libraries, so local screenshots are useful for debugging but not authoritative.

## Baseline Format

Use PNG baselines. Playwright 1.59 supports PNG and JPEG screenshots, and its native screenshot
matcher compares PNG/JPEG images. JPEG is lossy, so it is a poor fit for CSS regression tests.
Lossless WebP or AVIF would require a custom capture and diff pipeline outside `toHaveScreenshot`.

## Adding Coverage

Add scenarios in `tests/visual/scenarios.ts`. Prefer small named screenshots over one large catalog
page. Use `selector: '#storybook-root'` for compact static stories and page screenshots for popovers,
dialogs, responsive layouts, and other states where surrounding layout matters. Storybook stories may
use reduced frames for docs, but visual tests set `ds-storybook-visual-test` in local storage so page
stories can use the full Playwright viewport.

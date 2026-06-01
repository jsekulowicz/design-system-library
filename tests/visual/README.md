# Visual Screenshot Tests

Visual tests use Storybook iframe stories as fixtures and Playwright screenshots as the assertion
layer. Static component matrices and width-stable popovers run at desktop width. Stateful layouts
that actually respond to viewport changes run at mobile, tablet, and desktop widths.

## Commands

```sh
pnpm test:visual:docker          # check against committed baselines (recommended)
pnpm test:visual:update:docker   # regenerate baselines, then review + commit the PNGs
pnpm test:visual                 # check on the host (fast, debugging only — not authoritative)
```

### Run and update inside Docker (primary flow)

Baselines are environment-sensitive: rendering depends on OS, fonts, browser binaries, and graphics
libraries. To make local results match CI byte-for-byte, run the suite inside the pinned Playwright
container (`mcr.microsoft.com/playwright:v1.60.0-noble`) — the same image CI uses. Chromium headless
renders deterministically (SwiftShader), so a macOS host running this container matches Linux CI.

- `pnpm test:visual:docker` verifies the current tree against committed baselines.
- `pnpm test:visual:update:docker` regenerates the PNGs in `__screenshots__`. Review the diff
  (`git status` / image diff) and commit only the intended changes.

Both wrap `scripts/visual-docker.sh`, which bind-mounts the repo and installs/builds inside the
container. The first run pulls the ~2 GB image and warms cached volumes; later runs are fast.

Require Docker to be installed and running. `pnpm test:visual` on the host is fine for quick
debugging but its screenshots are **not** authoritative — never commit host-generated baselines.

### Inspecting CI failures

When visual tests fail in CI, download the `playwright-visual-diffs` artifact to inspect the
`*-expected.png`, `*-actual.png`, and `*-diff.png` files directly.

### Fallback: update baselines via GitHub Actions

If you cannot run Docker locally, use `pnpm test:visual:update:ci` when the current branch is clean
and pushed. It dispatches the GitHub Actions workflow for the current branch (using the same pinned
container) and lets CI commit updated PNG baselines when screenshots changed. It uses GitHub CLI
when available and prints manual workflow dispatch steps when `gh` is not installed or authenticated.
The workflow removes the screenshot directory before updating so stale baselines are deleted
automatically.

## Why It Is Reliable

Three things make these tests catch real regressions instead of silently passing:

1. **Deterministic rendering.** `playwright.visual.config.ts` launches Chromium with software-raster
   flags (`--disable-gpu`, `--disable-skia-runtime-opts`, `--disable-partial-raster`,
   `--disable-checker-imaging`, `--disable-lcd-text`, `--font-render-hinting=none`,
   `--force-color-profile=srgb`). Without them, GPU/threaded rasterization jitters anti-aliasing on
   curved edges and text by 4–80px between identical runs — noise that drowns real changes. With
   them, the run-to-run noise floor is **0px**.

2. **Pinned architecture.** `scripts/visual-docker.sh` forces `--platform=linux/amd64` so Apple
   Silicon hosts render the same output as the amd64 CI runner (emulated via Rosetta/QEMU). amd64 and
   arm64 produce different pixels, so baselines must be generated for one architecture — amd64, to
   match CI.

3. **Absolute pixel budget.** Comparison uses `maxDiffPixels: 10`, not `maxDiffPixelRatio`. A ratio
   lets small real changes — e.g. a button border-radius, which only repaints corner pixels — slip
   under the budget on large screenshots. Because the noise floor is 0, the `10` is a cushion for
   rare cross-environment sub-pixel drift, not a tolerance for real diffs: a one-step button radius
   change registers 21–71px on the dedicated button scenarios and fails comfortably.

If CI (native amd64) ever reports diffs against committed baselines with no real change, regenerate
the baselines on CI via the fallback workflow below rather than loosening the budget.

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

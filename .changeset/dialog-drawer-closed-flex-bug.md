---
"@jsekulowicz/ds-components": patch
---

- Closed `ds-dialog` and `ds-drawer` no longer render their content inline below the page. The flex-column rule I added previously to make the body scroll on short viewports was applied to `dialog` unscoped, which overrode the UA's `dialog:not([open]) { display: none }` default — so storybook docs pages (and any consumer with a closed dialog in the DOM) would show the dialog's title and content rendered inline alongside its trigger. Scoped the rule to `dialog[open]` so closed dialogs stay hidden by the UA default; open dialogs still get the flex column for height-cap propagation.
- Bumped the body fade-mask zone from `var(--ds-space-5)` to `var(--ds-space-7)` on both `ds-dialog` and `ds-drawer`. The previous size was readable but easy to miss against light backgrounds; the bigger band makes the "more content here" cue noticeably more obvious without crossing into "feels cropped" territory.

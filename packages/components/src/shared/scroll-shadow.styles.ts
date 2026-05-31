import { css } from 'lit';

// Shared CSS scroll shadows (no JS, no scroll-driven timeline). A scroll
// container gets four background layers:
//   1-2. "cover" gradients in the container's own background colour, pinned to
//        the content via `background-attachment: local` (they scroll WITH the
//        content);
//   3-4. "shadow" gradients pinned to the viewport via `background-attachment:
//        scroll` (they stay at the top/bottom edges).
// When the content fits (non-scrollable) the covers sit exactly over the
// shadows and hide them, so NOTHING shows — unlike a scroll-progress timeline,
// this needs no "is it scrollable" signal and never paints a phantom shadow.
// Scrolling moves the covers off the shadows, revealing a top shadow once
// content is above and a bottom shadow while content remains below.
//
// Apply `scrollShadowStyles` to the component, then on the scroll container:
//   scrollbar-width: none;
//   background:
//     linear-gradient(var(--ds-scroll-shadow-cover) 35%, rgb(0 0 0 / 0)) center top,
//     linear-gradient(rgb(0 0 0 / 0), var(--ds-scroll-shadow-cover) 65%) center bottom,
//     radial-gradient(farthest-side at 50% 0, var(--ds-scroll-shadow-color), rgb(0 0 0 / 0)) center top,
//     radial-gradient(farthest-side at 50% 100%, var(--ds-scroll-shadow-color), rgb(0 0 0 / 0)) center bottom;
//   background-repeat: no-repeat;
//   background-size:
//     100% var(--ds-scroll-shadow-cover-size), 100% var(--ds-scroll-shadow-cover-size),
//     100% var(--ds-scroll-shadow-size), 100% var(--ds-scroll-shadow-size);
//   background-attachment: local, local, scroll, scroll;
//   background-color: var(--ds-scroll-shadow-cover);
// and hide the WebKit scrollbar with `::-webkit-scrollbar { display: none }`.
//
// Note: the shadows paint BEHIND content, so this suits panels whose content
// sits on the container background (dialog, drawer). It does not suit opaque
// full-width rows (e.g. ds-table), which would cover the shadow.
export const scrollShadowStyles = css`
  :host {
    /* Container background — the covers must match it to hide the shadows. */
    --ds-scroll-shadow-cover: var(--ds-color-bg);
    /* Shadow tint. Override per theme if needed. */
    --ds-scroll-shadow-color: rgb(15 23 42 / 0.16);
    /* Cover depth must exceed the shadow depth so it fully hides it at rest. */
    --ds-scroll-shadow-cover-size: var(--ds-space-8);
    --ds-scroll-shadow-size: var(--ds-space-4);
  }
`;

import type { ReactiveController, ReactiveControllerHost } from 'lit';

// Drives the `--ds-scroll-fade-top` / `--ds-scroll-fade-bottom` custom
// properties on a scroll container from its REAL scroll state, so the
// mask-fade (see the consuming component's styles) shows:
//   • the bottom edge fading while there is more content below,
//   • the top edge fading once content has scrolled above,
//   • and NOTHING when the content fits (not scrollable).
// This replaces `animation-timeline: scroll(self)`, which some engines park at
// an extreme keyframe on non-scrollable content (painting a phantom fade). It
// recomputes on scroll, on resize (ResizeObserver) and on content changes
// (MutationObserver), all rAF-throttled.
const OPAQUE = 'rgb(0 0 0)';
const CLEAR = 'rgb(0 0 0 / 0)';

export class ScrollFadeController implements ReactiveController {
  #getScroller: () => HTMLElement | null | undefined;
  #scroller: HTMLElement | null = null;
  #resize?: ResizeObserver;
  #mutation?: MutationObserver;
  #frame = 0;

  constructor(host: ReactiveControllerHost, getScroller: () => HTMLElement | null | undefined) {
    this.#getScroller = getScroller;
    host.addController(this);
  }

  hostConnected(): void {
    this.#tryAttach();
  }

  hostUpdated(): void {
    this.#tryAttach();
  }

  hostDisconnected(): void {
    this.#detach();
  }

  #tryAttach(attempt = 0): void {
    const el = this.#getScroller();
    if (el && el === this.#scroller) {
      this.#schedule();
      return;
    }
    if (!el) {
      // The scroller may live in a nested shadow root that hasn't rendered yet.
      if (attempt < 10) requestAnimationFrame(() => this.#tryAttach(attempt + 1));
      return;
    }
    this.#detach();
    this.#scroller = el;
    el.addEventListener('scroll', this.#onScroll, { passive: true });
    if (typeof ResizeObserver !== 'undefined') {
      this.#resize = new ResizeObserver(this.#onScroll);
      this.#resize.observe(el);
      if (el.firstElementChild) this.#resize.observe(el.firstElementChild);
    }
    if (typeof MutationObserver !== 'undefined') {
      this.#mutation = new MutationObserver(this.#onScroll);
      this.#mutation.observe(el, { childList: true, subtree: true, characterData: true });
    }
    this.#schedule();
  }

  #detach(): void {
    this.#scroller?.removeEventListener('scroll', this.#onScroll);
    this.#resize?.disconnect();
    this.#mutation?.disconnect();
    this.#resize = undefined;
    this.#mutation = undefined;
    this.#scroller = null;
    if (this.#frame) {
      cancelAnimationFrame(this.#frame);
      this.#frame = 0;
    }
  }

  #onScroll = (): void => this.#schedule();

  #schedule(): void {
    if (this.#frame) return;
    this.#frame = requestAnimationFrame(() => {
      this.#frame = 0;
      this.#update();
    });
  }

  #update(): void {
    const el = this.#scroller;
    if (!el || !el.isConnected) return;
    const max = el.scrollHeight - el.clientHeight;
    const scrollable = max > 1;
    const atTop = el.scrollTop <= 1;
    const atBottom = el.scrollTop >= max - 1;
    el.style.setProperty('--ds-scroll-fade-top', scrollable && !atTop ? CLEAR : OPAQUE);
    el.style.setProperty('--ds-scroll-fade-bottom', scrollable && !atBottom ? CLEAR : OPAQUE);
  }
}

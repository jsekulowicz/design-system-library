import type { ReactiveController, ReactiveControllerHost } from 'lit';

// Measured, not `animation-timeline: scroll(self)`: some engines fade content that fits.
const OPAQUE = 'rgb(0 0 0)';
const CLEAR = 'rgb(0 0 0 / 0)';

// Sub-pixel rounding leaves a few px of overflow on content that visually fits.
const OVERFLOW_EPSILON = 2;

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
      if (attempt < 10) {
        requestAnimationFrame(() => this.#tryAttach(attempt + 1));
      }
      return;
    }
    this.#detach();
    this.#scroller = el;
    el.addEventListener('scroll', this.#onScroll, { passive: true });
    if (typeof ResizeObserver !== 'undefined') {
      this.#resize = new ResizeObserver(this.#onScroll);
      this.#resize.observe(el);
      if (el.firstElementChild) {
        this.#resize.observe(el.firstElementChild);
      }
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
    if (this.#frame) {
      return;
    }
    this.#frame = requestAnimationFrame(() => {
      this.#frame = 0;
      this.#update();
    });
  }

  #update(): void {
    const el = this.#scroller;
    if (!el || !el.isConnected) {
      return;
    }
    const max = el.scrollHeight - el.clientHeight;
    const scrollable = max > OVERFLOW_EPSILON;
    const atTop = el.scrollTop <= OVERFLOW_EPSILON;
    const atBottom = el.scrollTop >= max - OVERFLOW_EPSILON;
    el.style.setProperty('--ds-scroll-fade-top', scrollable && !atTop ? CLEAR : OPAQUE);
    el.style.setProperty('--ds-scroll-fade-bottom', scrollable && !atBottom ? CLEAR : OPAQUE);
  }
}

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
  #retry = 0;

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

  // Guarded like ResizeObserver and MutationObserver below: a host can update
  // in an environment that has no frame loop, and an unguarded call throws.
  #raf(callback: FrameRequestCallback): number {
    return typeof requestAnimationFrame === 'function' ? requestAnimationFrame(callback) : 0;
  }

  #cancelRaf(handle: number): void {
    if (handle && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(handle);
    }
  }

  #tryAttach(attempt = 0): void {
    const el = this.#getScroller();
    if (el && el === this.#scroller) {
      this.#schedule();
      return;
    }
    if (!el) {
      // The scroller may live in a nested shadow root that hasn't rendered yet.
      // Tracked so #detach can cancel it: a host that disconnects mid-retry
      // would otherwise leave the rest of the chain running against nothing.
      if (attempt < 10 && !this.#retry) {
        this.#retry = this.#raf(() => {
          this.#retry = 0;
          this.#tryAttach(attempt + 1);
        });
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
    this.#cancelRaf(this.#frame);
    this.#frame = 0;
    this.#cancelRaf(this.#retry);
    this.#retry = 0;
  }

  #onScroll = (): void => this.#schedule();

  #schedule(): void {
    if (this.#frame) {
      return;
    }
    this.#frame = this.#raf(() => {
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

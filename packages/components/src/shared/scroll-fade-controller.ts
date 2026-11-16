import type { ReactiveController, ReactiveControllerHost } from 'lit';

const OPAQUE = 'rgb(0 0 0)';
const CLEAR = 'rgb(0 0 0 / 0)';

const SUBPIXEL_ROUNDING_OVERFLOW_PX = 2;
const MAX_ATTACH_ATTEMPTS = 10;

export class ScrollFadeController implements ReactiveController {
  #getScroller: () => HTMLElement | null | undefined;
  #scroller: HTMLElement | null = null;
  #resize?: ResizeObserver;
  #mutation?: MutationObserver;
  #frame = 0;
  #retryFrame = 0;

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

  #requestFrameIfAvailable(callback: FrameRequestCallback): number {
    return typeof requestAnimationFrame === 'function' ? requestAnimationFrame(callback) : 0;
  }

  #cancelFrameIfAvailable(handle: number): void {
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
      this.#retryUntilScrollerRenders(attempt);
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

  #retryUntilScrollerRenders(attempt: number): void {
    if (attempt < MAX_ATTACH_ATTEMPTS && !this.#retryFrame) {
      this.#retryFrame = this.#requestFrameIfAvailable(() => {
        this.#retryFrame = 0;
        this.#tryAttach(attempt + 1);
      });
    }
  }

  #detach(): void {
    this.#scroller?.removeEventListener('scroll', this.#onScroll);
    this.#resize?.disconnect();
    this.#mutation?.disconnect();
    this.#resize = undefined;
    this.#mutation = undefined;
    this.#scroller = null;
    this.#cancelFrameIfAvailable(this.#frame);
    this.#frame = 0;
    this.#cancelFrameIfAvailable(this.#retryFrame);
    this.#retryFrame = 0;
  }

  #onScroll = (): void => this.#schedule();

  #schedule(): void {
    if (this.#frame) {
      return;
    }
    this.#frame = this.#requestFrameIfAvailable(() => {
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
    const scrollable = max > SUBPIXEL_ROUNDING_OVERFLOW_PX;
    const atTop = el.scrollTop <= SUBPIXEL_ROUNDING_OVERFLOW_PX;
    const atBottom = el.scrollTop >= max - SUBPIXEL_ROUNDING_OVERFLOW_PX;
    el.style.setProperty('--ds-scroll-fade-top', scrollable && !atTop ? CLEAR : OPAQUE);
    el.style.setProperty('--ds-scroll-fade-bottom', scrollable && !atBottom ? CLEAR : OPAQUE);
  }
}

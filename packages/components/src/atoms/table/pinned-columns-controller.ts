import type { ReactiveController, ReactiveControllerHost } from 'lit';

// Measures the pinned columns and drives their sticky region via custom
// properties on the <table>: cumulative `left` offsets, plus the separator and
// scroll-conditional shadow gates. Horizontal pinning is turned off by
// withholding the offsets (left falls back to auto), so the scroll-body vertical
// header stick is never disturbed. Disabled when the region would exceed
// `--ds-table-pin-max-ratio` of the container, so it can't cover the viewport.
// rAF-throttled on scroll/resize/mutation, mirroring ScrollFadeController.
const DEFAULT_MAX_RATIO = 0.75;

export class PinnedColumnsController implements ReactiveController {
  #getScroller: () => HTMLElement | null | undefined;
  #getTable: () => HTMLElement | null | undefined;
  #scroller: HTMLElement | null = null;
  #resize?: ResizeObserver;
  #mutation?: MutationObserver;
  #frame = 0;

  constructor(
    host: ReactiveControllerHost,
    getScroller: () => HTMLElement | null | undefined,
    getTable: () => HTMLElement | null | undefined,
  ) {
    this.#getScroller = getScroller;
    this.#getTable = getTable;
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
      if (attempt < 10) {
        requestAnimationFrame(() => this.#tryAttach(attempt + 1));
      }
      return;
    }
    this.#detach();
    this.#scroller = el;
    el.addEventListener('scroll', this.#onChange, { passive: true });
    if (typeof ResizeObserver !== 'undefined') {
      this.#resize = new ResizeObserver(this.#onChange);
      this.#resize.observe(el);
      if (el.firstElementChild) {
        this.#resize.observe(el.firstElementChild);
      }
    }
    if (typeof MutationObserver !== 'undefined') {
      this.#mutation = new MutationObserver(this.#onChange);
      this.#mutation.observe(el, { childList: true, subtree: true, characterData: true });
    }
    this.#schedule();
  }

  #detach(): void {
    this.#scroller?.removeEventListener('scroll', this.#onChange);
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

  #onChange = (): void => this.#schedule();

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
    const scroller = this.#scroller;
    const table = this.#getTable();
    if (!scroller || !scroller.isConnected || !table) {
      return;
    }
    const pinnedHeaders = [...table.querySelectorAll<HTMLElement>('thead th.pinned')];
    if (pinnedHeaders.length === 0) {
      this.#deactivate(table);
      return;
    }
    const widths = pinnedHeaders.map(cell => cell.offsetWidth);
    const total = widths.reduce((sum, width) => sum + width, 0);
    const containerWidth = scroller.clientWidth;
    const fits = containerWidth > 0 && total <= containerWidth * this.#maxRatio(table);
    if (!fits) {
      pinnedHeaders.forEach((_, index) => table.style.removeProperty(`--ds-table-pin-left-${index}`));
      this.#deactivate(table);
      return;
    }
    let offset = 0;
    widths.forEach((width, index) => {
      table.style.setProperty(`--ds-table-pin-left-${index}`, `${offset}px`);
      offset += width;
    });
    table.style.setProperty('--ds-table-pin-active', '1');
    table.style.setProperty('--ds-table-pin-shadow', scroller.scrollLeft > 0 ? '1' : '0');
  }

  #deactivate(table: HTMLElement): void {
    table.style.setProperty('--ds-table-pin-active', '0');
    table.style.setProperty('--ds-table-pin-shadow', '0');
  }

  #maxRatio(table: HTMLElement): number {
    const raw = getComputedStyle(table).getPropertyValue('--ds-table-pin-max-ratio');
    const parsed = Number.parseFloat(raw);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_MAX_RATIO;
  }
}

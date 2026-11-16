import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { syncPointTooltip } from '../../shared/point-tooltip.js';

type Host = ReactiveControllerHost & HTMLElement;

export class HeatmapActiveDay implements ReactiveController {
  #activeIndex: number | null = null;
  #tabbableIndex: number | null = null;
  #focusedIndex: number | null = null;
  #tooltipDismissed = false;
  #escapeTarget: Document | null = null;
  readonly #host: Host;
  readonly #onActivate: (index: number) => void;

  constructor(host: Host, onActivate: (index: number) => void) {
    this.#host = host;
    this.#onActivate = onActivate;
    host.addController(this);
  }

  get activeIndex(): number | null {
    return this.#activeIndex;
  }

  get tabbableIndex(): number | null {
    return this.#tabbableIndex;
  }

  get tooltipShown(): boolean {
    return this.#activeIndex !== null && !this.#tooltipDismissed;
  }

  hostUpdated(): void {
    const shown = this.#host.isConnected && this.tooltipShown;
    syncPointTooltip(this.#host.shadowRoot, shown);
    this.#listenForEscapeWhile(shown);
  }

  hostDisconnected(): void {
    this.blur();
    this.#listenForEscapeWhile(false);
  }

  reconcile(count: number): void {
    if (this.#tabbableIndex !== null && this.#tabbableIndex >= count) {
      this.#tabbableIndex = null;
    }
    if (this.#focusedIndex !== null && this.#focusedIndex >= count) {
      this.#focusedIndex = null;
    }
    if (this.#activeIndex !== null && this.#activeIndex >= count) {
      this.activate(this.#focusedIndex);
    }
  }

  activate(index: number | null): void {
    if (this.#activeIndex === index) {
      return;
    }
    this.#activeIndex = index;
    this.#tooltipDismissed = false;
    this.#host.requestUpdate();
    if (index !== null) {
      this.#onActivate(index);
    }
  }

  focus(index: number): void {
    this.#focusedIndex = index;
    this.#tabbableIndex = index;
    this.#host.requestUpdate();
    this.#undoEscape();
    this.activate(index);
  }

  blur(): void {
    this.#focusedIndex = null;
    this.activate(null);
  }

  returnToFocusedDay(): void {
    this.activate(this.#focusedIndex);
  }

  #undoEscape(): void {
    if (this.#tooltipDismissed) {
      this.#tooltipDismissed = false;
      this.#host.requestUpdate();
    }
  }

  #dismissOnEscape = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape') {
      return;
    }
    event.preventDefault();
    this.#tooltipDismissed = true;
    this.#host.requestUpdate();
  };

  #listenForEscapeWhile(listening: boolean): void {
    const target = listening ? this.#host.ownerDocument : null;
    if (this.#escapeTarget === target) {
      return;
    }
    this.#escapeTarget?.removeEventListener('keydown', this.#dismissOnEscape);
    target?.addEventListener('keydown', this.#dismissOnEscape);
    this.#escapeTarget = target;
  }
}

import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { syncPointTooltip } from '../../shared/point-tooltip.js';

type Host = ReactiveControllerHost & HTMLElement;

export class HeatmapActiveDay implements ReactiveController {
  #activeIndex: number | null = null;
  #tabbableIndex: number | null = null;
  #focusedIndex: number | null = null;
  #tooltipDismissed = false;
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
    syncPointTooltip(this.#host.shadowRoot, this.tooltipShown);
    this.#listenForEscapeWhile(this.tooltipShown);
  }

  hostDisconnected(): void {
    this.#listenForEscapeWhile(false);
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
    if (listening) {
      document.addEventListener('keydown', this.#dismissOnEscape);
    } else {
      document.removeEventListener('keydown', this.#dismissOnEscape);
    }
  }
}

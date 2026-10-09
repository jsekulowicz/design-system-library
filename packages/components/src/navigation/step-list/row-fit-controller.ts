import type { ReactiveController, ReactiveControllerHost } from 'lit';

interface RowFitHost extends ReactiveControllerHost {
  readonly compact: boolean;
}

function sameElements(left: readonly Element[], right: readonly Element[]): boolean {
  return left.length === right.length && left.every((element, index) => element === right[index]);
}

export class RowFitController implements ReactiveController {
  readonly #host: RowFitHost;
  readonly #findRow: () => HTMLElement | null;
  #observer: ResizeObserver | null = null;
  #watched: Element[] = [];
  #rowFits = true;

  constructor(host: RowFitHost, findRow: () => HTMLElement | null) {
    this.#host = host;
    this.#findRow = findRow;
    host.addController(this);
  }

  get rowFits(): boolean {
    return this.#rowFits;
  }

  hostUpdated(): void {
    if (this.#host.compact) {
      this.#stopWatching();
      return;
    }
    this.#watchTheRowAndEachStepInIt();
  }

  hostDisconnected(): void {
    this.#stopWatching();
  }

  #watchTheRowAndEachStepInIt(): void {
    const row = this.#findRow();
    if (!row || typeof ResizeObserver === 'undefined') {
      return;
    }
    const targets = [row, ...row.querySelectorAll('.step-control')];
    if (sameElements(targets, this.#watched)) {
      return;
    }
    this.#observer ??= new ResizeObserver(() => this.#measure());
    this.#observer.disconnect();
    for (const target of targets) {
      this.#observer.observe(target);
    }
    this.#watched = targets;
  }

  #stopWatching(): void {
    this.#observer?.disconnect();
    this.#observer = null;
    this.#watched = [];
  }

  #measure(): void {
    const row = this.#findRow();
    if (!row) {
      return;
    }
    const fits = row.scrollWidth <= row.clientWidth;
    if (fits !== this.#rowFits) {
      this.#rowFits = fits;
      this.#host.requestUpdate();
    }
  }
}

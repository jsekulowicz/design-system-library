import type { ReactiveController, ReactiveControllerHost } from 'lit';

type ReasonTooltipHost = ReactiveControllerHost & HTMLElement;

export class ReasonTooltipController implements ReactiveController {
  readonly #host: ReasonTooltipHost;
  readonly #hasReason: (index: number) => boolean;
  #openIndex: number | null = null;

  constructor(host: ReasonTooltipHost, hasReason: (index: number) => boolean) {
    this.#host = host;
    this.#hasReason = hasReason;
    host.addController(this);
  }

  hostDisconnected(): void {
    this.close();
  }

  hostUpdate(): void {
    if (this.#openIndex !== null && !this.#hasReason(this.#openIndex)) {
      this.#trackOpenIndex(null);
    }
  }

  isOpenFor(index: number): boolean {
    return this.#openIndex === index;
  }

  toggle(index: number): void {
    this.#changeOpenIndex(this.#openIndex === index ? null : index);
  }

  close = (): void => {
    this.#changeOpenIndex(null);
  };

  #closeOnEscape = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && this.#openIndex !== null) {
      event.preventDefault();
      this.close();
    }
  };

  #closeOnClickOutside = (event: MouseEvent): void => {
    if (!event.composedPath().includes(this.#host)) {
      this.close();
    }
  };

  #changeOpenIndex(index: number | null): void {
    if (this.#openIndex !== index) {
      this.#trackOpenIndex(index);
      this.#host.requestUpdate();
    }
  }

  #trackOpenIndex(index: number | null): void {
    this.#openIndex = index;
    if (index === null) {
      document.removeEventListener('click', this.#closeOnClickOutside);
      document.removeEventListener('keydown', this.#closeOnEscape);
    } else {
      document.addEventListener('click', this.#closeOnClickOutside);
      document.addEventListener('keydown', this.#closeOnEscape);
    }
  }
}

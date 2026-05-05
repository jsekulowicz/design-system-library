interface SlottedTriggerDelegate {
  isOpen: () => boolean;
  isDisabled: () => boolean;
  toggle: () => void;
  onTriggerKeydown: (event: KeyboardEvent) => void;
  onSlotChange: (hasTrigger: boolean) => void;
}

export class SlottedTriggerController {
  #element: HTMLElement | null = null;

  constructor(private readonly delegate: SlottedTriggerDelegate) {}

  get element(): HTMLElement | null {
    return this.#element;
  }

  detach(): void {
    if (!this.#element) return;
    this.#element.removeEventListener('click', this.#onClick);
    this.#element.removeEventListener('keydown', this.delegate.onTriggerKeydown);
    this.#element = null;
  }

  onSlotChange = (event: Event): void => {
    const slot = event.target as HTMLSlotElement;
    const next =
      slot
        .assignedElements({ flatten: true })
        .find((el): el is HTMLElement => el instanceof HTMLElement) ?? null;
    if (this.#element && this.#element !== next) {
      this.detach();
    }
    if (next && next !== this.#element) {
      next.addEventListener('click', this.#onClick);
      next.addEventListener('keydown', this.delegate.onTriggerKeydown);
      this.#element = next;
    }
    this.delegate.onSlotChange(!!next);
  };

  syncAria(panelId: string): void {
    if (!this.#element) return;
    this.#element.setAttribute('aria-haspopup', 'menu');
    this.#element.setAttribute('aria-expanded', this.delegate.isOpen() ? 'true' : 'false');
    if (this.delegate.isOpen()) {
      this.#element.setAttribute('aria-controls', panelId);
    } else {
      this.#element.removeAttribute('aria-controls');
    }
  }

  focus(): void {
    this.#element?.focus();
  }

  #onClick = (): void => {
    if (this.delegate.isDisabled()) return;
    this.delegate.toggle();
  };
}

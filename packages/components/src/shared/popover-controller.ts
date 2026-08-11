interface PopoverHost extends HTMLElement {
  disabled: boolean;
  requestUpdate(): void;
  updateComplete: Promise<unknown>;
}

interface PopoverDelegate {
  focusTrigger(): void;
  onOpen(): void;
  onClose(): void;
}

export class PopoverController {
  open = false;

  constructor(
    private readonly host: PopoverHost,
    private readonly delegate: PopoverDelegate,
  ) {}

  disconnect(): void {
    if (this.open) {
      document.removeEventListener('click', this.#onDocumentClick);
      this.open = false;
    }
  }

  show(afterOpen?: () => void): void {
    if (this.host.disabled || this.open) {
      return;
    }
    this.open = true;
    this.delegate.onOpen();
    document.addEventListener('click', this.#onDocumentClick);
    this.host.requestUpdate();
    if (afterOpen) {
      void this.host.updateComplete.then(afterOpen);
    }
  }

  hide(focusTrigger = false): void {
    if (!this.open) {
      return;
    }
    this.open = false;
    document.removeEventListener('click', this.#onDocumentClick);
    this.delegate.onClose();
    this.host.requestUpdate();
    if (focusTrigger) {
      void this.host.updateComplete.then(() => this.delegate.focusTrigger());
    }
  }

  toggle = (): void => {
    if (this.open) {
      this.hide();
      return;
    }
    this.show();
  };

  onEscapeKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && this.open) {
      event.preventDefault();
      this.hide(true);
    }
  };

  #onDocumentClick = (event: MouseEvent): void => {
    if (!event.composedPath().includes(this.host)) {
      this.hide();
    }
  };
}

export function syncPopoverPanel(panel: HTMLElement | undefined, open: boolean): void {
  if (!panel || !open || typeof panel.showPopover !== 'function') {
    return;
  }
  if (!panel.matches(':popover-open')) {
    panel.showPopover();
  }
}

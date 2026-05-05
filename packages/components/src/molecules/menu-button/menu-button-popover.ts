interface MenuButtonPopoverHost extends HTMLElement {
  disabled: boolean;
  requestUpdate(): void;
  updateComplete: Promise<unknown>;
}

interface MenuButtonPopoverDelegate {
  focusTrigger: () => void;
  focusFirstItem: () => void;
  onOpen: () => void;
  onClose: () => void;
}

export class MenuButtonPopover {
  open = false;

  constructor(
    private readonly host: MenuButtonPopoverHost,
    private readonly delegate: MenuButtonPopoverDelegate,
  ) {}

  disconnect(): void {
    if (this.open) {
      document.removeEventListener('click', this.#onDocumentClick);
      this.open = false;
    }
  }

  openMenu(focusFirstItem = false): void {
    if (this.host.disabled || this.open) {
      return;
    }
    this.open = true;
    this.delegate.onOpen();
    document.addEventListener('click', this.#onDocumentClick);
    this.host.requestUpdate();
    if (focusFirstItem) {
      void this.host.updateComplete.then(() => this.delegate.focusFirstItem());
    }
  }

  close(focusTrigger = false): void {
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
      this.close();
      return;
    }
    this.openMenu();
  };

  onTriggerKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.openMenu(true);
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.openMenu(true);
      return;
    }
    if (event.key === 'Escape' && this.open) {
      event.preventDefault();
      this.close(true);
    }
  };

  onPanelKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && this.open) {
      event.preventDefault();
      this.close(true);
    }
  };

  #onDocumentClick = (event: MouseEvent): void => {
    if (!event.composedPath().includes(this.host)) {
      this.close();
    }
  };
}

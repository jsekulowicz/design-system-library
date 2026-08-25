interface ColorPickerPopoverHost extends HTMLElement {
  disabled: boolean;
  requestUpdate(): void;
  updateComplete: Promise<unknown>;
}

interface ColorPickerPopoverDelegate {
  focusTrigger: () => void;
  onOpen: () => void;
}

export class ColorPickerPopover {
  open = false;

  constructor(
    private readonly host: ColorPickerPopoverHost,
    private readonly delegate: ColorPickerPopoverDelegate,
  ) {}

  disconnect(): void {
    this.close();
  }

  openPicker(): void {
    if (this.host.disabled || this.open) {
      return;
    }
    this.open = true;
    this.delegate.onOpen();
    document.addEventListener('click', this.#onDocumentClick);
    this.host.requestUpdate();
  }

  close(focusTrigger = false): void {
    if (!this.open) {
      return;
    }
    this.open = false;
    document.removeEventListener('click', this.#onDocumentClick);
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
    this.openPicker();
  };

  onTriggerKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.openPicker();
    }
    if (event.key === 'Escape') {
      this.close(true);
    }
  };

  onPanelKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
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

import type { ColorPickerOption } from './types.js';

interface ColorPickerSwatchFocusHost {
  shadowRoot: ShadowRoot | null;
  requestUpdate(): void;
  updateComplete: Promise<unknown>;
}

export class ColorPickerSwatchFocus {
  focusedIndex = -1;

  constructor(
    private readonly host: ColorPickerSwatchFocusHost,
    private readonly getOptions: () => ColorPickerOption[],
    private readonly getCurrentValue: () => string,
  ) {}

  sync(): void {
    const options = this.getOptions();
    const selected = options.findIndex((option) => option.value === this.getCurrentValue());
    const firstEnabled = options.findIndex((option) => !option.disabled);
    this.focusedIndex = selected >= 0 && !options[selected]?.disabled ? selected : firstEnabled;
  }

  onKeydown = (event: KeyboardEvent, index: number): void => {
    const handled = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'];
    if (!handled.includes(event.key)) {
      return;
    }
    event.preventDefault();
    this.#move(event.key, index);
  };

  #move(key: string, index: number): void {
    const enabled = this.getOptions()
      .map((option, i) => (option.disabled ? -1 : i))
      .filter((i) => i >= 0);
    if (enabled.length === 0) {
      return;
    }
    const next = this.#nextIndex(key, index, enabled);
    this.focusedIndex = enabled[next] ?? enabled[0] ?? -1;
    this.host.requestUpdate();
    void this.host.updateComplete.then(() => this.#focusSwatch());
  }

  #nextIndex(key: string, index: number, enabled: number[]): number {
    const current = Math.max(0, enabled.indexOf(index));
    const last = enabled.length - 1;
    if (key === 'Home') {
      return 0;
    }
    if (key === 'End') {
      return last;
    }
    return this.#nextEnabled(current, key, last);
  }

  #nextEnabled(current: number, key: string, last: number): number {
    if (key === 'ArrowRight' || key === 'ArrowDown') {
      return current >= last ? 0 : current + 1;
    }
    return current <= 0 ? last : current - 1;
  }

  #focusSwatch(): void {
    const swatch = this.host.shadowRoot?.querySelector<HTMLElement>(
      `ds-color-picker-swatch[data-swatch-index="${this.focusedIndex}"]`,
    );
    swatch?.focus();
  }
}

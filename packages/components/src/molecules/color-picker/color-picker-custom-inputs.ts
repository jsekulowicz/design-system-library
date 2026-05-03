import {
  COLOR_FORMAT_ERROR,
  DEFAULT_COLOR,
  normalizeHexColor,
} from './color-utils.js';

interface ColorPickerCustomInputsHost {
  requestUpdate(): void;
}

interface ColorPickerCustomInputsDelegate {
  closePicker: () => void;
  commitAndClose: () => void;
  emitChange: (value: string) => void;
  emitInput: (value: string) => void;
  setValidation: (message: string) => void;
  setValue: (value: string) => void;
}

export class ColorPickerCustomInputs {
  nativeValue = DEFAULT_COLOR;
  textValue = '';
  validationError = '';

  constructor(
    private readonly host: ColorPickerCustomInputsHost,
    private readonly delegate: ColorPickerCustomInputsDelegate,
  ) {}

  syncEmpty(): void {
    this.textValue = '';
    this.nativeValue = DEFAULT_COLOR;
    this.validationError = '';
    this.host.requestUpdate();
  }

  syncInvalid(raw: string): void {
    this.textValue = raw;
    this.validationError = COLOR_FORMAT_ERROR;
    this.host.requestUpdate();
  }

  syncValue(value: string): void {
    this.textValue = value;
    this.nativeValue = value;
    this.validationError = '';
    this.host.requestUpdate();
  }

  commit(): boolean {
    return this.#commitValue() !== null;
  }

  focusHexInput(root: ParentNode | null): void {
    root?.querySelector<HTMLElement>('.hex-input')?.focus();
  }

  onNativeInput = (event: CustomEvent<{ value: string }>): void => {
    const normalized = normalizeHexColor(event.detail.value);
    if (!normalized) {
      return;
    }
    this.delegate.setValue(normalized);
    this.delegate.emitInput(normalized);
  };

  onNativeChange = (event: CustomEvent<{ value: string }>): void => {
    this.delegate.emitChange(normalizeHexColor(event.detail.value) || this.nativeValue);
  };

  onTextInput = (event: CustomEvent<{ value: string }>): void => {
    const raw = event.detail.value.trim();
    this.textValue = raw;
    if (raw === '') {
      this.delegate.setValue('');
      this.delegate.emitInput('');
      return;
    }
    const normalized = normalizeHexColor(raw);
    if (!normalized) {
      this.#setValidation(COLOR_FORMAT_ERROR);
      return;
    }
    this.delegate.setValue(normalized);
    this.delegate.emitInput(normalized);
  };

  onTextChange = (): void => {
    const value = this.#commitValue();
    if (value !== null) {
      this.delegate.emitChange(value);
    }
  };

  onTextKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.delegate.commitAndClose();
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      this.delegate.closePicker();
    }
  };

  #commitValue(): string | null {
    if (!this.textValue) {
      this.delegate.setValue('');
      return '';
    }
    const normalized = normalizeHexColor(this.textValue);
    if (!normalized) {
      this.#setValidation(COLOR_FORMAT_ERROR);
      return null;
    }
    this.delegate.setValue(normalized);
    return normalized;
  }

  #setValidation(message: string): void {
    this.validationError = message;
    this.delegate.setValidation(message);
    this.host.requestUpdate();
  }
}

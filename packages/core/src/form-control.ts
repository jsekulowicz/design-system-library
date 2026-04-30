import type { LitElement } from 'lit';
import { property } from 'lit/decorators.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T = object> = new (...args: any[]) => T;

export interface FormControlHost {
  value: FormDataEntryValue | null;
  name: string;
  disabled: boolean;
  required: boolean;
  validity: ValidityState;
  validationMessage: string;
  willValidate: boolean;
  form: HTMLFormElement | null;
  labels: NodeListOf<HTMLLabelElement> | null;
  checkValidity(): boolean;
  reportValidity(): boolean;
  setCustomValidity(message: string): void;
  setValidity(flags: ValidityStateFlags, message?: string, anchor?: HTMLElement): void;
  setFormValue(value: FormDataEntryValue | null, state?: FormDataEntryValue): void;
  setAriaLabel(label: string | null): void;
  setAriaDescription(description: string | null): void;
}

type LitCtor = Constructor<LitElement> & { formAssociated?: boolean };

export function FormControlMixin<TBase extends LitCtor>(
  Base: TBase,
): TBase & Constructor<FormControlHost & LitElement> {
  class FormControl extends Base implements FormControlHost {
    static override readonly formAssociated = true;

    readonly #internals: ElementInternals;
    #value: FormDataEntryValue | null = null;

    @property({ reflect: true }) name = '';
    @property({ type: Boolean, reflect: true }) disabled = false;
    @property({ type: Boolean, reflect: true }) required = false;

    // TypeScript mixin constraint requires `any[]` here.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args);
      this.#internals = (this as unknown as HTMLElement).attachInternals();
    }

    get value(): FormDataEntryValue | null {
      return this.#value;
    }

    set value(next: FormDataEntryValue | null) {
      const old = this.#value;
      this.#value = next;
      if (typeof this.#internals.setFormValue === 'function') {
        this.#internals.setFormValue(next);
      }
      this.requestUpdate('value', old);
    }

    get form(): HTMLFormElement | null {
      return this.#internals.form;
    }

    get labels(): NodeListOf<HTMLLabelElement> | null {
      return this.#internals.labels as NodeListOf<HTMLLabelElement>;
    }

    get validity(): ValidityState {
      return this.#internals.validity;
    }

    get validationMessage(): string {
      return this.#internals.validationMessage;
    }

    get willValidate(): boolean {
      return this.#internals.willValidate;
    }

    checkValidity(): boolean {
      return this.#internals.checkValidity();
    }

    reportValidity(): boolean {
      return this.#internals.reportValidity();
    }

    setCustomValidity(message: string): void {
      this.#internals.setValidity(message ? { customError: true } : {}, message);
    }

    setValidity(flags: ValidityStateFlags, message?: string, anchor?: HTMLElement): void {
      if (typeof this.#internals.setValidity !== 'function') {
        return;
      }
      this.#internals.setValidity(flags, message, anchor);
    }

    setFormValue(value: FormDataEntryValue | null, state?: FormDataEntryValue): void {
      this.#value = value;
      if (typeof this.#internals.setFormValue !== 'function') {
        return;
      }
      this.#internals.setFormValue(value, state);
    }

    setAriaLabel(label: string | null): void {
      this.#internals.ariaLabel = label;
    }

    setAriaDescription(description: string | null): void {
      this.#internals.ariaDescription = description;
    }

    formResetCallback(): void {
      this.value = null;
    }

    formDisabledCallback(disabled: boolean): void {
      this.disabled = disabled;
    }

    formStateRestoreCallback(state: FormDataEntryValue | null): void {
      this.#value = state;
    }
  }
  return FormControl as unknown as TBase & Constructor<FormControlHost & LitElement>;
}

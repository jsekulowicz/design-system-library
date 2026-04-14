import type { LitElement } from 'lit';

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
}

type LitCtor = Constructor<LitElement> & { formAssociated?: boolean };

export function FormControlMixin<TBase extends LitCtor>(
  Base: TBase,
): TBase & Constructor<FormControlHost & LitElement> {
  class FormControl extends Base implements FormControlHost {
    static override readonly formAssociated = true;

    readonly #internals: ElementInternals;
    #value: FormDataEntryValue | null = null;
    name = '';
    disabled = false;
    required = false;

    constructor(...args: any[]) {
      super(...args);
      this.#internals = (this as unknown as HTMLElement).attachInternals();
    }

    get value(): FormDataEntryValue | null {
      return this.#value;
    }

    set value(next: FormDataEntryValue | null) {
      this.#value = next;
      this.#internals.setFormValue(next);
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

    protected setValidity(
      flags: ValidityStateFlags,
      message?: string,
      anchor?: HTMLElement,
    ): void {
      this.#internals.setValidity(flags, message, anchor);
    }

    protected setFormValue(value: FormDataEntryValue | null, state?: FormDataEntryValue): void {
      this.#value = value;
      this.#internals.setFormValue(value, state);
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

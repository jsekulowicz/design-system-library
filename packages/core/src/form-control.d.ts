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
type LitCtor = Constructor<LitElement> & {
    formAssociated?: boolean;
};
export declare function FormControlMixin<TBase extends LitCtor>(Base: TBase): TBase & Constructor<FormControlHost & LitElement>;
export {};
//# sourceMappingURL=form-control.d.ts.map
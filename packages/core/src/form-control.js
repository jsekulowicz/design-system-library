export function FormControlMixin(Base) {
    class FormControl extends Base {
        static { this.formAssociated = true; }
        #internals;
        #value;
        constructor(...args) {
            super(...args);
            this.#value = null;
            this.name = '';
            this.disabled = false;
            this.required = false;
            this.#internals = this.attachInternals();
        }
        get value() {
            return this.#value;
        }
        set value(next) {
            this.#value = next;
            this.#internals.setFormValue(next);
        }
        get form() {
            return this.#internals.form;
        }
        get labels() {
            return this.#internals.labels;
        }
        get validity() {
            return this.#internals.validity;
        }
        get validationMessage() {
            return this.#internals.validationMessage;
        }
        get willValidate() {
            return this.#internals.willValidate;
        }
        checkValidity() {
            return this.#internals.checkValidity();
        }
        reportValidity() {
            return this.#internals.reportValidity();
        }
        setCustomValidity(message) {
            this.#internals.setValidity(message ? { customError: true } : {}, message);
        }
        setValidity(flags, message, anchor) {
            this.#internals.setValidity(flags, message, anchor);
        }
        setFormValue(value, state) {
            this.#value = value;
            this.#internals.setFormValue(value, state);
        }
        formResetCallback() {
            this.value = null;
        }
        formDisabledCallback(disabled) {
            this.disabled = disabled;
        }
        formStateRestoreCallback(state) {
            this.#value = state;
        }
    }
    return FormControl;
}
//# sourceMappingURL=form-control.js.map
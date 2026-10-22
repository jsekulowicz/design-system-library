import { html, nothing, type TemplateResult } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';
import { DsElement } from '@jsekulowicz/ds-core';
import { formFieldStyles, renderSubtext } from '../../shared/form-field.js';
import { resolveRovingTarget } from '../../shared/roving-focus.js';
import { fieldGroupStyles } from '../../shared/field-group.styles.js';
import type { ValueChangeDetail } from '../../events.js';

type RadioEl = HTMLElement & {
  checked?: boolean;
  radioValue?: string;
  tabStop?: boolean;
  focus(options?: FocusOptions): void;
};

/**
 * @tag ds-radio-group
 * @summary Groups ds-radio buttons with a shared label, name, and validation state.
 * @slot default - One or more ds-radio elements.
 * @slot description - Replaces the description text, for a message that carries a link.
 * @slot warning - Replaces the warning text, for a message that carries a link.
 * @slot error - Replaces the error text, for a message that carries a link.
 * @event {CustomEvent<ValueChangeDetail>} ds-change - Fires when the selected radio changes. Detail: `{ value: string }`.
 * @csspart fieldset - The native `<fieldset>` element.
 * @csspart legend - The legend that names the group.
 * @csspart label - The legend, under the name every other field's label carries.
 */
export class DsRadioGroup extends DsElement {
  static override styles = [...DsElement.styles, formFieldStyles, fieldGroupStyles];

  @property() label = '';
  @property() name = '';
  @property() description = '';
  /** A caution about the current value; outranks `description` and leaves the field valid. */
  @property() warning = '';
  @property() error = '';
  @property() value = '';
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) invalid = false;
  @property({ type: Boolean, attribute: 'message-space', reflect: true }) messageSpace = false;

  @queryAssignedElements({ selector: 'ds-radio' }) private _radios!: RadioEl[];

  #radiosObserver: MutationObserver | undefined;

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.label) {
      console.warn('<ds-radio-group>: the `label` property is required for accessibility.');
    }
    this.addEventListener('ds-change', this.#onRadioChange);
    this.#radiosObserver = new MutationObserver((mutations) => {
      if (mutations.some(({ target }) => target instanceof HTMLElement && target.localName === 'ds-radio')) {
        this.#wireRadios(false);
      }
    });
    this.#radiosObserver.observe(this, { attributes: true, attributeFilter: ['disabled'], subtree: true });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('ds-change', this.#onRadioChange);
    this.#radiosObserver?.disconnect();
  }

  override updated(changed: Map<string, unknown>): void {
    this.#wireRadios(changed.has('value'));
  }

  #onSlotChange = (): void => {
    this.#wireRadios(this.value !== '');
  };

  #radioValueOf(radio: RadioEl): string {
    return radio.radioValue ?? radio.getAttribute('radio-value') ?? '';
  }

  #isRadioDisabledAt = (index: number): boolean => {
    const radio = this._radios[index];
    return radio ? radio.hasAttribute('disabled') : true;
  };

  #disabledByGroup = new WeakSet<RadioEl>();

  #syncDisabled(radio: RadioEl): void {
    if (this.disabled && !radio.hasAttribute('disabled')) {
      this.#disabledByGroup.add(radio);
      radio.setAttribute('disabled', '');
    } else if (!this.disabled && this.#disabledByGroup.delete(radio)) {
      radio.removeAttribute('disabled');
    }
  }

  #wireRadios = (syncChecked: boolean): void => {
    const radios = this._radios;
    radios.forEach((radio) => this.#syncDisabled(radio));
    const selectedIndex = radios.findIndex((radio) => this.#radioValueOf(radio) === this.value);
    const firstEnabled = radios.findIndex((radio) => !radio.hasAttribute('disabled'));
    const selectedIsEnabled = selectedIndex >= 0 && !this.#isRadioDisabledAt(selectedIndex);
    const tabStopIndex = selectedIsEnabled ? selectedIndex : firstEnabled;
    radios.forEach((radio, index) => {
      if (this.name) {
        radio.setAttribute('name', this.name);
      }
      if (this.required) {
        radio.setAttribute('required', '');
      } else {
        radio.removeAttribute('required');
      }
      radio.tabStop = index === tabStopIndex;
      if (syncChecked) {
        if (this.#radioValueOf(radio) === this.value) {
          radio.setAttribute('checked', '');
        } else {
          radio.removeAttribute('checked');
        }
      }
    });
  };

  #onKeydown = (event: KeyboardEvent): void => {
    if (this.disabled) {
      return;
    }
    const radios = this._radios;
    const target = resolveRovingTarget({
      key: event.key,
      currentIndex: radios.findIndex((radio) => this.#radioValueOf(radio) === this.value),
      count: radios.length,
      isDisabled: this.#isRadioDisabledAt,
    });
    if (target === null) {
      return;
    }
    const radio = radios[target];
    if (!radio) {
      return;
    }
    event.preventDefault();
    const value = this.#radioValueOf(radio);
    if (value !== this.value) {
      this.value = value;
      this.invalid = false;
      this.dispatchEvent(
        new CustomEvent<ValueChangeDetail>('ds-change', { bubbles: true, composed: true, detail: { value } }),
      );
    }
    void this.updateComplete.then(() => radio.focus());
  };

  #onRadioChange = (event: Event): void => {
    if (event.target === this) {
      return;
    }
    event.stopImmediatePropagation();
    const { value } = (event as CustomEvent<{ value: string }>).detail;
    this.value = value;
    this.invalid = false;
    this.dispatchEvent(
      new CustomEvent<ValueChangeDetail>('ds-change', { bubbles: true, composed: true, detail: { value } }),
    );
  };

  override render(): TemplateResult {
    return html`
      <fieldset class="fieldset" part="fieldset" @keydown=${this.#onKeydown}>
        <legend class="label" part="legend label">
          ${this.label} ${this.required ? html`<span class="required" aria-hidden="true"> *</span>` : nothing}
        </legend>
        <div class="items">
          <slot @slotchange=${this.#onSlotChange}></slot>
        </div>
      </fieldset>
      ${renderSubtext(this)}
    `;
  }
}

import { html, nothing, LitElement, type PropertyValues, type TemplateResult } from 'lit';
import { property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { DsElement, FormControlMixin } from '@jsekulowicz/ds-core';
import { formFieldStyles, renderFieldLabel, renderSubtext } from '../../shared/form-field.js';
import { renderVirtualItems } from '../../shared/virtual-list.js';
import {
  renderChevronDownIcon,
  renderClearButton,
  renderSelectedTiles,
} from './select.shared.js';
import { DropdownController } from './dropdown-controller.js';
import { clearKeydown, dropdownKeydown } from './dropdown-keydown.js';
import { selectCommonStyles } from './select.common-styles.js';
import { selectStyles } from './select.styles.js';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * @tag ds-select
 * @summary Custom dropdown selector with label, description and validation feedback.
 * @event ds-change - Fires when selection changes. Detail: `{ value }` or `{ values }` when multiple.
 * @csspart trigger - The trigger button element.
 * @csspart listbox - The dropdown listbox container.
 * @csspart option - Each individual option item.
 */
export class DsSelect extends FormControlMixin(DsElement) {
  static override styles = [...DsElement.styles, formFieldStyles, selectCommonStyles, selectStyles];
  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  @property({ type: Array }) options: SelectOption[] = [];
  @property() placeholder = '';
  @property() label = '';
  @property() description = '';
  @property() error = '';
  @property({ type: Boolean, reflect: true }) invalid = false;
  @property({ type: Boolean, reflect: true }) multiple = false;
  @property({ type: Boolean, reflect: true }) clearable = false;
  @property({ type: Array }) values: string[] = [];
  @property({ type: Number }) maxLines?: number;

  @query('.listbox') private _listboxEl?: HTMLElement;
  @query('#trigger') private _triggerEl?: HTMLElement;
  @query('.tiles') private _tilesEl?: HTMLElement;

  // Listeners installed while the dropdown is open so the popover
  // tracks viewport changes. Stored so we can detach them on close
  // without recreating closures.
  #onAncestorScroll?: () => void;
  #onWindowResize?: () => void;

  #dropdown = new DropdownController(this, {
    getOptions: () => this.options,
    getCurrentValue: () => (typeof this.value === 'string' ? this.value : ''),
    getValues: () => this.values,
    getMultiple: () => this.multiple,
    getMaxLines: () => this.maxLines,
    getTilesEl: () => this._tilesEl,
    getListboxEl: () => this._listboxEl,
    applyValues: (next) => {
      this.values = next;
      this.value = next.join(',');
      this.emit('ds-change', { detail: { values: next } });
    },
  });

  /* test-facing forwarders to controller state */
  get _open(): boolean { return this.#dropdown.open; }
  get _focusedIndex(): number { return this.#dropdown.focusedIndex; }
  set _focusedIndex(value: number) { this.#dropdown.focusedIndex = value; }
  get _focusedTileIndex(): number { return this.#dropdown.focusedTileIndex; }
  set _focusedTileIndex(value: number) { this.#dropdown.focusedTileIndex = value; }
  get _scrollTop(): number { return this.#dropdown.scrollTop; }
  set _scrollTop(value: number) { this.#dropdown.scrollTop = value; }
  get _hasLeading(): boolean { return this.#dropdown.hasLeading; }
  get _overflowCount(): number { return this.#dropdown.overflowCount; }
  get _overflowCheckQueued(): boolean { return this.#dropdown.overflowCheckQueued; }
  set _overflowCheckQueued(value: boolean) { this.#dropdown.overflowCheckQueued = value; }

  override updated(changed: PropertyValues): void {
    if (changed.has('label')) this.setAriaLabel(this.label || null);
    if (changed.has('description')) this.setAriaDescription(this.description || null);
    if (
      (changed.has('values') || changed.has('maxLines') || changed.has('multiple')) &&
      this.multiple
    ) {
      this.#dropdown.queueOverflowCheck();
    }
    this.#dropdown.syncScrollTop();
    this.#syncListboxPopover();
  }

  override disconnectedCallback(): void {
    this.#teardownPopoverListeners();
    super.disconnectedCallback();
    this.#dropdown.close();
  }

  // The listbox uses `popover="manual"` so the browser hoists it to the
  // top layer when shown — that's how it escapes the `overflow: hidden`
  // / `overflow: auto` ancestors a ds-select might find itself inside
  // (dialogs, scroll containers, etc.). Without the top layer those
  // ancestors clip or grow to fit the menu, both of which feel broken.
  //
  // The top layer doesn't get anchor positioning yet across browsers,
  // so we set `position: fixed` and compute coordinates from the
  // trigger's bounding rect. Re-positions on scroll/resize keep the
  // menu glued to its trigger while open.
  #syncListboxPopover(): void {
    const listbox = this._listboxEl;
    const open = this.#dropdown.open;
    if (!listbox) {
      if (!open) this.#teardownPopoverListeners();
      return;
    }
    if (typeof (listbox as HTMLElement & { showPopover?: () => void }).showPopover !== 'function') {
      // No Popover API — fall back to the in-flow `position: absolute`
      // styling already on `.listbox`. Behaviour matches pre-popover
      // builds; clipping in dialogs is then a known limitation.
      return;
    }
    if (open) {
      if (!listbox.matches(':popover-open')) {
        try { listbox.showPopover(); } catch { /* already shown by a previous tick */ }
      }
      this.#positionListbox();
      this.#installPopoverListeners();
    } else {
      this.#teardownPopoverListeners();
    }
  }

  #positionListbox(): void {
    const trigger = this._triggerEl;
    const listbox = this._listboxEl;
    if (!trigger || !listbox) return;
    const rect = trigger.getBoundingClientRect();
    const gap = 4;
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom - gap;
    const spaceAbove = rect.top - gap;
    const naturalHeight = Math.min(listbox.scrollHeight || 0, 240);
    const openUp = spaceBelow < Math.min(naturalHeight, 160) && spaceAbove > spaceBelow;
    listbox.style.position = 'fixed';
    listbox.style.margin = '0';
    listbox.style.inset = '';
    listbox.style.left = `${Math.max(0, rect.left)}px`;
    listbox.style.minWidth = `${rect.width}px`;
    if (openUp) {
      listbox.style.top = '';
      listbox.style.bottom = `${viewportHeight - rect.top + gap}px`;
    } else {
      listbox.style.bottom = '';
      listbox.style.top = `${rect.bottom + gap}px`;
    }
  }

  #installPopoverListeners(): void {
    if (this.#onAncestorScroll) return;
    this.#onAncestorScroll = () => this.#positionListbox();
    this.#onWindowResize = () => this.#positionListbox();
    // Capture so we catch scroll on any scrollable ancestor — dialogs,
    // page-shell main, etc. — not just window.
    window.addEventListener('scroll', this.#onAncestorScroll, { capture: true, passive: true });
    window.addEventListener('resize', this.#onWindowResize);
  }

  #teardownPopoverListeners(): void {
    if (this.#onAncestorScroll) {
      window.removeEventListener('scroll', this.#onAncestorScroll, { capture: true });
      this.#onAncestorScroll = undefined;
    }
    if (this.#onWindowResize) {
      window.removeEventListener('resize', this.#onWindowResize);
      this.#onWindowResize = undefined;
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.label)
      console.warn('<ds-select>: the `label` property is required for accessibility.');
  }

  #selectOption = (option: SelectOption): void => {
    if (option.disabled) return;
    if (this.multiple) {
      const next = this.values.includes(option.value)
        ? this.values.filter((v) => v !== option.value)
        : [...this.values, option.value];
      this.values = next;
      this.value = next.join(',');
      this.emit('ds-change', { detail: { values: next } });
    } else {
      this.value = option.value;
      this.invalid = this.required && !option.value;
      this.setValidity(
        this.invalid ? { valueMissing: true } : {},
        this.invalid ? 'Please select an option.' : '',
      );
      this.emit('ds-change', { detail: { value: option.value } });
      this.#dropdown.close();
    }
  };

  #clear = (): void => {
    if (this.multiple) {
      this.values = [];
      this.value = '';
      this.emit('ds-change', { detail: { values: [] } });
    } else {
      this.value = '';
      this.emit('ds-change', { detail: { value: '' } });
    }
  };

  #onClearKeydown = (event: KeyboardEvent): void => clearKeydown(event, this.#clear);

  #onTriggerKeydown = (event: KeyboardEvent): void => {
    if (this.disabled) return;
    if ((event.target as Element).classList.contains('clear-btn')) return;
    if (
      dropdownKeydown(event, {
        controller: this.#dropdown,
        multiple: this.multiple,
        options: this.options,
        values: this.values,
        selectOption: this.#selectOption,
      }) === 'handled'
    ) {
      return;
    }
    if (
      !this.#dropdown.open &&
      (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ')
    ) {
      event.preventDefault();
      this.#dropdown.openDropdown();
    }
  };

  #renderTiles = (): TemplateResult =>
    renderSelectedTiles({
      values: this.values,
      focusedTileIndex: this.#dropdown.focusedTileIndex,
      overflowCount: this.#dropdown.overflowCount,
      maxLines: this.maxLines,
      labelFor: (value) => this.options.find((option) => option.value === value)?.label ?? value,
      onRemove: this.#dropdown.removeTile,
    });

  #renderOption = (option: SelectOption, index: number, current: string): TemplateResult => {
    const isSelected = this.multiple
      ? this.values.includes(option.value)
      : option.value === current;
    return html`<ds-select-option
      id="option-${index}"
      part="option"
      .value=${option.value}
      ?selected=${isSelected}
      ?active=${this.#dropdown.focusedIndex === index}
      ?disabled=${option.disabled ?? false}
      @click=${() => this.#selectOption(option)}
      @mouseenter=${() => {
        this.#dropdown.focusedIndex = index;
      }}
      >${option.label}</ds-select-option
    >`;
  };

  override render(): TemplateResult {
    const current = typeof this.value === 'string' ? this.value : '';
    const selectedOption = this.options.find((option) => option.value === current);
    const open = this.#dropdown.open;
    const activeDesc =
      open && this.#dropdown.focusedIndex >= 0 ? `option-${this.#dropdown.focusedIndex}` : undefined;
    const hasTiles = this.multiple && this.values.length > 0;
    const hasClearBtn =
      (this.clearable || this.required) &&
      (this.multiple ? this.values.length > 0 : current !== '');
    return html` ${renderFieldLabel(this.label, this.required, 'trigger')}
      <div class="control-wrap">
        <div
          id="trigger"
          class="trigger${this.multiple ? ' trigger-multiple' : ''}"
          part="trigger"
          tabindex=${this.disabled ? '-1' : '0'}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded=${open ? 'true' : 'false'}
          aria-controls="listbox"
          aria-label=${ifDefined(this.label || undefined)}
          aria-activedescendant=${ifDefined(activeDesc)}
          aria-disabled=${this.disabled ? 'true' : 'false'}
          @click=${this.#toggle}
          @keydown=${this.#onTriggerKeydown}
        >
          <span class="leading" ?hidden=${!this.#dropdown.hasLeading}>
            <slot name="leading" @slotchange=${this.#dropdown.onLeadingChange}></slot>
          </span>
          ${hasTiles
            ? this.#renderTiles()
            : html` <span class=${selectedOption ? 'trigger-label' : 'trigger-label placeholder'}>
                ${selectedOption?.label ?? this.placeholder}
              </span>`}
          ${hasClearBtn
            ? renderClearButton((event: Event) => {
                event.stopPropagation();
                this.#clear();
              }, this.#onClearKeydown)
            : nothing}
          ${renderChevronDownIcon()}
        </div>
        ${open
          ? html` <div
              id="listbox"
              class="listbox"
              part="listbox"
              role="listbox"
              popover="manual"
              aria-multiselectable=${this.multiple ? 'true' : 'false'}
              @scroll=${this.#dropdown.onScroll}
              @ds-activate=${(event: Event) => event.stopPropagation()}
            >
              ${renderVirtualItems(this.options, this.#dropdown.scrollTop, (option, index) =>
                this.#renderOption(option, index, current),
              )}
            </div>`
          : nothing}
      </div>
      ${renderSubtext(this.description, this.error, this.invalid)}`;
  }

  #toggle = (): void => {
    if (this.disabled) return;
    this.#dropdown.toggle();
  };
}

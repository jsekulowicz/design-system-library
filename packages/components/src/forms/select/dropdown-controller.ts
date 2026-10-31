import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { clampTileFocusIndex, countOverflowTiles, getVisibleTileCount, queueTaskOnce } from './select.shared.js';
import type { SelectOption } from './select.js';

export interface DropdownConfig {
  getOptions: () => SelectOption[];
  getCurrentValue: () => string;
  getValues: () => string[];
  getMultiple: () => boolean;
  getMaxLines: () => number | undefined;
  getTilesEl: () => HTMLElement | undefined;
  getListboxEl: () => HTMLElement | undefined;
  applyValues: (next: string[]) => void;
  canOpen?: () => boolean;
  onOpen?: () => void;
  onClose?: () => void;
  // Focus on this element keeps the dropdown open; focus elsewhere closes it.
  getComboboxEl?: () => Element | null | undefined;
}

type DropdownHost = ReactiveControllerHost & HTMLElement;

const SLACK_BEFORE_SCROLL_END_PX = 72;
const OPENING_ROWS_ABOVE_FOCUS = 2;

export class DropdownController implements ReactiveController {
  #host: DropdownHost;
  #config: DropdownConfig;

  #open = false;
  #focusedIndex = -1;
  #focusedTileIndex = -1;
  #overflowCount = 0;
  #hasLeading = false;
  #scrollEndArmed = true;

  #docClickHandler?: (event: MouseEvent) => void;
  #focusOutHandler?: () => void;
  #overflowCheckQueued = false;
  #focusRevealPending = false;
  #focusRevealQueued = false;

  constructor(host: DropdownHost, config: DropdownConfig) {
    this.#host = host;
    this.#config = config;
    host.addController(this);
  }

  get open(): boolean {
    return this.#open;
  }
  get focusedIndex(): number {
    return this.#focusedIndex;
  }
  set focusedIndex(value: number) {
    if (this.#focusedIndex === value) {
      return;
    }
    this.#focusedIndex = value;
    this.#host.requestUpdate();
  }
  get focusedTileIndex(): number {
    return this.#focusedTileIndex;
  }
  set focusedTileIndex(value: number) {
    if (this.#focusedTileIndex === value) {
      return;
    }
    this.#focusedTileIndex = value;
    this.#host.requestUpdate();
  }
  get overflowCount(): number {
    return this.#overflowCount;
  }
  get hasLeading(): boolean {
    return this.#hasLeading;
  }
  get overflowCheckQueued(): boolean {
    return this.#overflowCheckQueued;
  }
  set overflowCheckQueued(value: boolean) {
    this.#overflowCheckQueued = value;
  }

  hostDisconnected(): void {
    this.close();
  }

  openDropdown = (): void => {
    if (this.#open) {
      return;
    }
    if (this.#config.canOpen && !this.#config.canOpen()) {
      return;
    }
    this.#open = true;
    this.#scrollEndArmed = true;
    this.#focusRevealPending = true;
    this.#config.onOpen?.();
    this.#focusedTileIndex = -1;
    const options = this.#config.getOptions();
    const idx = this.#config.getMultiple()
      ? options.findIndex((option) => this.#config.getValues().includes(option.value))
      : options.findIndex((option) => option.value === this.#config.getCurrentValue());
    this.#focusedIndex = idx >= 0 ? idx : 0;
    this.#docClickHandler = (event: MouseEvent) => {
      if (!event.composedPath().includes(this.#host)) {
        this.close();
      }
    };
    document.addEventListener('click', this.#docClickHandler);
    this.#focusOutHandler = () => {
      queueMicrotask(() => {
        if (!this.#open) {
          return;
        }
        const active = this.#host.shadowRoot?.activeElement ?? null;
        if (active && active === this.#config.getComboboxEl?.()) {
          return;
        }
        this.close();
      });
    };
    this.#host.addEventListener('focusout', this.#focusOutHandler);
    this.#host.requestUpdate();
  };

  close = (): void => {
    this.#open = false;
    this.#focusedIndex = -1;
    this.#config.onClose?.();
    if (this.#docClickHandler) {
      document.removeEventListener('click', this.#docClickHandler);
      this.#docClickHandler = undefined;
    }
    if (this.#focusOutHandler) {
      this.#host.removeEventListener('focusout', this.#focusOutHandler);
      this.#focusOutHandler = undefined;
    }
    this.#host.requestUpdate();
  };

  toggle = (): void => {
    if (this.#open) {
      this.close();
    } else {
      this.openDropdown();
    }
  };

  moveFocus = (direction: 1 | -1): void => {
    const next = this.#focusedIndex + direction;
    const total = this.#config.getOptions().length;
    if (next < 0 || next >= total) {
      return;
    }
    this.#focusedIndex = next;
    this.#focusRevealPending = false;
    this.#scrollFocusedIntoView();
    this.#host.requestUpdate();
  };

  onScroll = (): void => {
    this.#focusRevealPending = false;
    const el = this.#config.getListboxEl();
    if (el) {
      this.#notifyScrollEnd(el);
    }
  };

  // Fires once per approach; scrolling away or reopening re-arms it.
  #notifyScrollEnd = (el: HTMLElement): void => {
    const nearEnd = el.scrollTop + el.clientHeight >= el.scrollHeight - SLACK_BEFORE_SCROLL_END_PX;
    if (!nearEnd) {
      this.#scrollEndArmed = true;
      return;
    }
    if (!this.#scrollEndArmed) {
      return;
    }
    this.#scrollEndArmed = false;
    this.#host.dispatchEvent(new CustomEvent('ds-scroll-end', { bubbles: true, composed: true }));
  };

  onLeadingChange = (event: Event): void => {
    const next = (event.target as HTMLSlotElement).assignedElements().length > 0;
    if (next === this.#hasLeading) {
      return;
    }
    this.#hasLeading = next;
    this.#host.requestUpdate();
  };

  removeTile = (value: string): void => {
    const next = this.#config.getValues().filter((current) => current !== value);
    this.#config.applyValues(next);
    const visibleCount = getVisibleTileCount(next.length, this.#overflowCount);
    this.#focusedTileIndex = clampTileFocusIndex(this.#focusedTileIndex, visibleCount);
    this.#host.requestUpdate();
  };

  queueOverflowCheck = (): void => {
    queueTaskOnce({
      isQueued: this.#overflowCheckQueued,
      setQueued: (value) => {
        this.#overflowCheckQueued = value;
      },
      task: this.#checkOverflow,
    });
  };

  queueFocusReveal = (): void => {
    if (!this.#focusRevealPending) {
      return;
    }
    queueTaskOnce({
      isQueued: this.#focusRevealQueued,
      setQueued: (value) => {
        this.#focusRevealQueued = value;
      },
      task: this.#revealFocusedWithRowsAbove,
    });
  };

  #findRenderedOption(index: number): HTMLElement | null {
    return this.#config.getListboxEl()?.querySelector<HTMLElement>(`#option-${index}`) ?? null;
  }

  #measureHintHeight(listbox: HTMLElement): number {
    return listbox.querySelector<HTMLElement>('[part="hint"]')?.offsetHeight ?? 0;
  }

  #revealFocusedWithRowsAbove = (): void => {
    const listbox = this.#config.getListboxEl();
    const focused = this.#findRenderedOption(this.#focusedIndex);
    if (!this.#open || !listbox || !focused || focused.offsetHeight === 0) {
      return;
    }
    this.#focusRevealPending = false;
    const firstShown = this.#findRenderedOption(this.#focusedIndex - OPENING_ROWS_ABOVE_FOCUS);
    listbox.scrollTop = firstShown ? firstShown.offsetTop - this.#measureHintHeight(listbox) : 0;
    this.#scrollFocusedIntoView();
  };

  #scrollFocusedIntoView(): void {
    const listbox = this.#config.getListboxEl();
    const focused = this.#findRenderedOption(this.#focusedIndex);
    if (!listbox || !focused) {
      return;
    }
    const hintHeight = this.#measureHintHeight(listbox);
    const focusedBottom = focused.offsetTop + focused.offsetHeight;
    if (focused.offsetTop < listbox.scrollTop + hintHeight) {
      listbox.scrollTop = focused.offsetTop - hintHeight;
    } else if (focusedBottom > listbox.scrollTop + listbox.clientHeight) {
      listbox.scrollTop = focusedBottom - listbox.clientHeight;
    }
  }

  #checkOverflow = (): void => {
    const count = countOverflowTiles(this.#config.getTilesEl(), this.#config.getMaxLines());
    if (count === this.#overflowCount) {
      return;
    }
    this.#overflowCount = count;
    this.#host.requestUpdate();
  };
}

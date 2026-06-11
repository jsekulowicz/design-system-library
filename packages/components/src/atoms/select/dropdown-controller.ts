import type { ReactiveController, ReactiveControllerHost } from 'lit';
import {
  clampTileFocusIndex,
  countOverflowTiles,
  getVisibleTileCount,
  queueTaskOnce,
} from './select.shared.js';
import { ITEM_HEIGHT, LISTBOX_HEIGHT } from '../../shared/virtual-list.js';
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
}

type DropdownHost = ReactiveControllerHost & HTMLElement;

// How close (px) to the listbox bottom counts as "scrolled to the end".
// Two rows of slack lets consumers fetch the next page before the user
// actually hits the hard end.
const SCROLL_END_THRESHOLD = ITEM_HEIGHT * 2;

export class DropdownController implements ReactiveController {
  #host: DropdownHost;
  #config: DropdownConfig;

  #open = false;
  #focusedIndex = -1;
  #scrollTop = 0;
  #focusedTileIndex = -1;
  #overflowCount = 0;
  #hasLeading = false;
  #scrollEndArmed = true;

  #docClickHandler?: (event: MouseEvent) => void;
  #overflowCheckQueued = false;

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
    if (this.#focusedIndex === value) return;
    this.#focusedIndex = value;
    this.#host.requestUpdate();
  }
  get scrollTop(): number {
    return this.#scrollTop;
  }
  set scrollTop(value: number) {
    if (this.#scrollTop === value) return;
    this.#scrollTop = value;
    this.#host.requestUpdate();
  }
  get focusedTileIndex(): number {
    return this.#focusedTileIndex;
  }
  set focusedTileIndex(value: number) {
    if (this.#focusedTileIndex === value) return;
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

  hostConnected(): void {}

  hostDisconnected(): void {
    this.close();
  }

  openDropdown = (): void => {
    if (this.#open) return;
    if (this.#config.canOpen && !this.#config.canOpen()) return;
    this.#open = true;
    this.#scrollEndArmed = true;
    this.#config.onOpen?.();
    this.#focusedTileIndex = -1;
    const options = this.#config.getOptions();
    const idx = this.#config.getMultiple()
      ? options.findIndex((option) => this.#config.getValues().includes(option.value))
      : options.findIndex((option) => option.value === this.#config.getCurrentValue());
    this.#focusedIndex = idx >= 0 ? idx : 0;
    this.#scrollTop = Math.max(0, (this.#focusedIndex - 2) * ITEM_HEIGHT);
    this.#docClickHandler = (event: MouseEvent) => {
      if (!event.composedPath().includes(this.#host)) this.close();
    };
    document.addEventListener('click', this.#docClickHandler);
    this.#host.requestUpdate();
  };

  close = (): void => {
    this.#open = false;
    this.#focusedIndex = -1;
    this.#scrollTop = 0;
    this.#config.onClose?.();
    if (this.#docClickHandler) {
      document.removeEventListener('click', this.#docClickHandler);
      this.#docClickHandler = undefined;
    }
    this.#host.requestUpdate();
  };

  toggle = (): void => {
    if (this.#open) this.close();
    else this.openDropdown();
  };

  moveFocus = (direction: 1 | -1): void => {
    const next = this.#focusedIndex + direction;
    const total = this.#config.getOptions().length;
    if (next < 0 || next >= total) return;
    this.#focusedIndex = next;
    this.#scrollFocusedIntoView();
    this.#host.requestUpdate();
  };

  onScroll = (): void => {
    const el = this.#config.getListboxEl();
    this.#scrollTop = el?.scrollTop ?? 0;
    if (el) this.#notifyScrollEnd(el);
    this.#host.requestUpdate();
  };

  // Emits `ds-scroll-end` once per approach of the listbox bottom (the
  // infinite-scroll hook). Scrolling back up re-arms it, as does
  // reopening the dropdown; appended options push the bottom away so the
  // next approach fires again.
  #notifyScrollEnd = (el: HTMLElement): void => {
    const nearEnd = el.scrollTop + el.clientHeight >= el.scrollHeight - SCROLL_END_THRESHOLD;
    if (!nearEnd) {
      this.#scrollEndArmed = true;
      return;
    }
    if (!this.#scrollEndArmed) return;
    this.#scrollEndArmed = false;
    this.#host.dispatchEvent(
      new CustomEvent('ds-scroll-end', { bubbles: true, composed: true }),
    );
  };

  onLeadingChange = (event: Event): void => {
    const next = (event.target as HTMLSlotElement).assignedElements().length > 0;
    if (next === this.#hasLeading) return;
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

  syncScrollTop = (): void => {
    const el = this.#config.getListboxEl();
    if (el && el.scrollTop !== this.#scrollTop) el.scrollTop = this.#scrollTop;
  };

  #scrollFocusedIntoView = (): void => {
    const top = this.#focusedIndex * ITEM_HEIGHT;
    const bottom = top + ITEM_HEIGHT;
    if (top < this.#scrollTop) {
      this.#scrollTop = top;
    } else if (bottom > this.#scrollTop + LISTBOX_HEIGHT) {
      this.#scrollTop = bottom - LISTBOX_HEIGHT;
    }
  };

  #checkOverflow = (): void => {
    const count = countOverflowTiles(this.#config.getTilesEl(), this.#config.getMaxLines());
    if (count === this.#overflowCount) return;
    this.#overflowCount = count;
    this.#host.requestUpdate();
  };
}

import { html, nothing, type TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { IconSize } from '../icon/icon.js';
import { TILE_ROW_HEIGHT } from './select.common-styles.js';
import '../icon/icons/x-mark.js';
import '../icon/icons/chevron-down.js';

export interface OptionIcon {
  name: string;
  color?: string;
}

interface OptionIconOptions {
  slot?: string;
  size?: IconSize;
}

export function renderOptionIcon(
  icon?: OptionIcon,
  { slot, size }: OptionIconOptions = {},
): TemplateResult | typeof nothing {
  if (!icon) {
    return nothing;
  }
  return html`<ds-icon
    slot=${ifDefined(slot)}
    size=${ifDefined(size)}
    name=${icon.name}
    style=${ifDefined(icon.color ? `color:${icon.color}` : undefined)}
  ></ds-icon>`;
}

type TileDirection = 'left' | 'right';

interface QueueTaskOptions {
  isQueued: boolean;
  setQueued: (value: boolean) => void;
  task: () => void;
}

interface TileListTemplateOptions {
  values: string[];
  focusedTileIndex: number;
  overflowCount: number;
  maxLines?: number;
  labelFor: (value: string) => string;
  iconFor?: (value: string) => OptionIcon | undefined;
  onRemove: (value: string) => void;
}

interface TileTemplateOptions {
  value: string;
  label: string;
  icon?: OptionIcon;
  isFocused: boolean;
  onRemove: (value: string) => void;
}

export function getVisibleTileCount(valueCount: number, overflowCount: number): number {
  return Math.max(0, valueCount - overflowCount);
}

export function getNextTileFocusIndex(currentIndex: number, visibleCount: number, direction: TileDirection): number {
  if (direction === 'left') {
    return currentIndex <= 0 ? visibleCount - 1 : currentIndex - 1;
  }
  return currentIndex >= visibleCount - 1 ? -1 : currentIndex + 1;
}

export function clampTileFocusIndex(currentIndex: number, visibleCount: number): number {
  if (currentIndex < visibleCount) {
    return currentIndex;
  }
  return Math.max(-1, visibleCount - 1);
}

export function countOverflowTiles(tilesElement?: HTMLElement, maxLines?: number): number {
  if (!maxLines || !tilesElement) {
    return 0;
  }
  const tiles = Array.from(tilesElement.querySelectorAll<HTMLElement>('.tile[data-value]'));
  return tiles.filter((tile) => tile.offsetTop >= maxLines * TILE_ROW_HEIGHT).length;
}

export function queueTaskOnce(options: QueueTaskOptions): void {
  if (options.isQueued) {
    return;
  }
  options.setQueued(true);
  queueMicrotask(() => {
    options.setQueued(false);
    options.task();
  });
}

function renderTile(options: TileTemplateOptions): TemplateResult {
  return html` <span class="tile${options.isFocused ? ' tile-focused' : ''}" data-value=${options.value}>
    ${renderOptionIcon(options.icon, { size: 'md' })}
    <span class="tile-label"><slot name="tile:${options.value}">${options.label}</slot></span>
    <button
      class="tile-remove"
      type="button"
      tabindex="-1"
      aria-label="Remove ${options.label}"
      @pointerdown=${(event: Event) => event.preventDefault()}
      @click=${(event: Event) => {
        event.stopPropagation();
        options.onRemove(options.value);
      }}
    >
      <ds-icon name="x-mark" size="xl"></ds-icon>
    </button>
  </span>`;
}

/** Sits outside the tile list so it keeps its place on the first row as tiles wrap. */
export function renderOverflowTile(count: number): TemplateResult | typeof nothing {
  if (count <= 0) {
    return nothing;
  }
  return html`<span class="tile tile-overflow" aria-label="${count} more selected">+${count}</span>`;
}

export function renderSelectedTiles(options: TileListTemplateOptions): TemplateResult {
  const style = options.maxLines ? `max-height:${options.maxLines * TILE_ROW_HEIGHT - 4}px;overflow:hidden` : '';
  return html` <div class="tiles" style=${style}>
    ${options.values.map((value, index) =>
      renderTile({
        value,
        label: options.labelFor(value),
        icon: options.iconFor?.(value),
        isFocused: options.focusedTileIndex === index,
        onRemove: options.onRemove,
      }),
    )}
  </div>`;
}

export function renderClearButton(
  onClear: (event: Event) => void,
  onKeydown: (event: KeyboardEvent) => void,
): TemplateResult {
  return html` <button
    class="clear-btn"
    type="button"
    aria-label="Clear selection"
    @click=${onClear}
    @keydown=${onKeydown}
  >
    <ds-icon name="x-mark" size="xl"></ds-icon>
  </button>`;
}

export function renderChevronDownIcon(): TemplateResult {
  return html`<ds-icon class="caret" name="chevron-down" size="xl"></ds-icon>`;
}

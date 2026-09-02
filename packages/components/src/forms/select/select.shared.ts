import { html, nothing, type TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { IconSize } from '../../data-display/icon/icon.js';
import { TILE_ROW_HEIGHT } from './select.common-styles.js';
import '../../data-display/icon/icons/x-mark.js';
import '../../data-display/icon/icons/chevron-down.js';
import { formatLabel } from '../../shared/format-label.js';

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
  removeLabel: string;
}

interface TileTemplateOptions {
  value: string;
  label: string;
  icon?: OptionIcon;
  isFocused: boolean;
  onRemove: (value: string) => void;
  removeLabel: string;
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
      aria-label=${formatLabel(options.removeLabel, { label: options.label })}
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

/**
 * Activation for a button nested inside the trigger. Without it the trigger's own
 * keydown handler sees the key first and preventDefaults it, canceling the click
 * the browser would have synthesized - so the button never fires at all.
 */
export function triggerButtonKeydown(event: KeyboardEvent, activate: () => void): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.stopPropagation();
    event.preventDefault();
    activate();
  }
}

/**
 * The "+3" tile, for selections `maxLines` clipped out of view.
 *
 * A button, not a label: keyboard tile navigation cannot reach a hidden tile, so
 * without it there is no way to see or remove what is behind the count. Consumers
 * listen for `ds-overflow-click` and reveal the full selection however suits them.
 */
export function renderOverflowTile(
  count: number,
  overflowLabel: string,
  onActivate?: () => void,
): TemplateResult | typeof nothing {
  if (count <= 0) {
    return nothing;
  }
  return html`<button
    class="tile tile-overflow"
    type="button"
    aria-label=${formatLabel(overflowLabel, { count })}
    @pointerdown=${(event: Event) => event.preventDefault()}
    @keydown=${(event: KeyboardEvent) => triggerButtonKeydown(event, () => onActivate?.())}
    @click=${(event: Event) => {
      event.stopPropagation();
      onActivate?.();
    }}
  >
    +${count}
  </button>`;
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
        removeLabel: options.removeLabel,
      }),
    )}
  </div>`;
}

export function renderClearButton(
  onClear: (event: Event) => void,
  onKeydown: (event: KeyboardEvent) => void,
  clearLabel: string,
): TemplateResult {
  return html` <button class="clear-btn" type="button" aria-label=${clearLabel} @click=${onClear} @keydown=${onKeydown}>
    <ds-icon name="x-mark" size="xl"></ds-icon>
  </button>`;
}

export function renderChevronDownIcon(): TemplateResult {
  return html`<ds-icon class="caret" name="chevron-down" size="xl"></ds-icon>`;
}

import { html, nothing, type TemplateResult } from 'lit';

export const TILE_ROW_HEIGHT = 28;

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
  onRemove: (value: string) => void;
}

interface TileTemplateOptions {
  value: string;
  label: string;
  isFocused: boolean;
  onRemove: (value: string) => void;
}

export function getVisibleTileCount(valueCount: number, overflowCount: number): number {
  return Math.max(0, valueCount - overflowCount);
}

export function getNextTileFocusIndex(
  currentIndex: number,
  visibleCount: number,
  direction: TileDirection,
): number {
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
    <span class="tile-label">${options.label}</span>
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
      ${renderXMarkIcon()}
    </button>
  </span>`;
}

export function renderSelectedTiles(options: TileListTemplateOptions): TemplateResult {
  const style = options.maxLines
    ? `max-height:${options.maxLines * TILE_ROW_HEIGHT - 4}px;overflow:hidden`
    : '';
  return html` <div class="tiles" style=${style}>
    ${options.overflowCount > 0
      ? html` <span class="tile tile-overflow" aria-label="${options.overflowCount} more selected">
          +${options.overflowCount}
        </span>`
      : nothing}
    ${options.values.map((value, index) =>
      renderTile({
        value,
        label: options.labelFor(value),
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
  return html` <button class="clear-btn" type="button" aria-label="Clear selection" @click=${onClear} @keydown=${onKeydown}>
    ${renderXMarkIcon()}
  </button>`;
}

export function renderChevronDownIcon(): TemplateResult {
  return html`<svg class="caret" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path
      fill-rule="evenodd"
      d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
      clip-rule="evenodd"
    />
  </svg>`;
}

function renderXMarkIcon(): TemplateResult {
  return html`<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path
      d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z"
    />
  </svg>`;
}

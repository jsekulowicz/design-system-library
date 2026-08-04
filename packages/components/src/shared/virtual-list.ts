import { html, type TemplateResult } from 'lit';

/** Assumed until a row can be measured: real height follows the font metrics. */
export const DEFAULT_ITEM_HEIGHT = 36;
export const LISTBOX_HEIGHT = 240;

const OVERSCAN = 3;

export function renderVirtualItems<T>(
  items: T[],
  scrollTop: number,
  renderItem: (item: T, index: number) => TemplateResult,
  itemHeight: number = DEFAULT_ITEM_HEIGHT,
): TemplateResult {
  const startIdx = Math.max(0, Math.floor(scrollTop / itemHeight) - OVERSCAN);
  const endIdx = Math.min(items.length, startIdx + Math.ceil(LISTBOX_HEIGHT / itemHeight) + OVERSCAN * 2);
  const topPad = startIdx * itemHeight;
  const bottomPad = (items.length - endIdx) * itemHeight;

  return html`
    <div style="height:${topPad}px" aria-hidden="true"></div>
    ${items.slice(startIdx, endIdx).map((item, i) => renderItem(item, startIdx + i))}
    <div style="height:${bottomPad}px" aria-hidden="true"></div>
  `;
}

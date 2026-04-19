import { html, type TemplateResult } from 'lit';

export const ITEM_HEIGHT = 36;
export const LISTBOX_HEIGHT = 240;

const OVERSCAN = 3;

export function renderVirtualItems<T>(
  items: T[],
  scrollTop: number,
  renderItem: (item: T, index: number) => TemplateResult,
): TemplateResult {
  const startIdx = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - OVERSCAN);
  const endIdx = Math.min(items.length, startIdx + Math.ceil(LISTBOX_HEIGHT / ITEM_HEIGHT) + OVERSCAN * 2);
  const topPad = startIdx * ITEM_HEIGHT;
  const bottomPad = (items.length - endIdx) * ITEM_HEIGHT;

  return html`
    <div style="height:${topPad}px" aria-hidden="true"></div>
    ${items.slice(startIdx, endIdx).map((item, i) => renderItem(item, startIdx + i))}
    <div style="height:${bottomPad}px" aria-hidden="true"></div>
  `;
}

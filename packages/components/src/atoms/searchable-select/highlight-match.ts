import { html, type TemplateResult } from 'lit';

export function highlightMatch(label: string, query: string): TemplateResult {
  if (!query) return html`${label}`;
  const lower = label.toLowerCase();
  const q = query.toLowerCase();
  const parts: Array<TemplateResult | string> = [];
  let pos = 0;
  let idx: number;
  while ((idx = lower.indexOf(q, pos)) !== -1) {
    if (idx > pos) parts.push(label.slice(pos, idx));
    parts.push(html`<mark class="match">${label.slice(idx, idx + q.length)}</mark>`);
    pos = idx + q.length;
  }
  if (pos < label.length) parts.push(label.slice(pos));
  return html`${parts}`;
}

import { html, type TemplateResult } from 'lit';

/**
 * Charts expose their graphic as a `graphics-document` whose data points are
 * real focusable `graphics-symbol` elements driven by a roving tabindex. The
 * tabular fallback is rendered as a sibling of the graphic — never referenced
 * with `aria-describedby`, which would flatten the table to a single string.
 */

export function chartTitleId(uid: string): string {
  return `${uid}-title`;
}

export function datumId(uid: string, kind: string, index: number): string {
  return `${uid}-${kind}-${index}`;
}

export function rovingTabIndex(index: number, activeIndex: number | null): number {
  if (activeIndex == null) {
    return index === 0 ? 0 : -1;
  }
  return index === activeIndex ? 0 : -1;
}

export function focusDatum(root: ShadowRoot | null, uid: string, kind: string, index: number): void {
  const target = root?.getElementById(datumId(uid, kind, index));
  if (target instanceof SVGElement || target instanceof HTMLElement) {
    target.focus();
  }
}

export function renderChartTitle(uid: string, text: string): TemplateResult {
  return html`<div class="visually-hidden" id=${chartTitleId(uid)}>${text}</div>`;
}

export function renderChartLiveRegion(text: string): TemplateResult {
  return html`<div class="visually-hidden" role="status" aria-live="polite">${text}</div>`;
}

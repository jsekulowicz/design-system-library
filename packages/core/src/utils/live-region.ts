import { isBrowser } from './env.js';

type Politeness = 'polite' | 'assertive';

const regions = new Map<Politeness, HTMLElement>();

function createRegion(politeness: Politeness): HTMLElement {
  const el = document.createElement('div');
  el.setAttribute('role', politeness === 'assertive' ? 'alert' : 'status');
  el.setAttribute('aria-live', politeness);
  el.setAttribute('aria-atomic', 'true');
  el.style.cssText =
    'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0';
  document.body.appendChild(el);
  return el;
}

function getRegion(politeness: Politeness): HTMLElement | null {
  if (!isBrowser) {
    return null;
  }
  const existing = regions.get(politeness);
  if (existing && existing.isConnected) {
    return existing;
  }
  const region = createRegion(politeness);
  regions.set(politeness, region);
  return region;
}

export function announce(message: string, politeness: Politeness = 'polite'): void {
  const region = getRegion(politeness);
  if (!region) {
    return;
  }
  region.textContent = '';
  window.requestAnimationFrame(() => {
    region.textContent = message;
  });
}

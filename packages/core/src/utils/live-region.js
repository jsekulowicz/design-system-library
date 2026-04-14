import { isBrowser } from './env.js';
const regions = new Map();
function createRegion(politeness) {
    const el = document.createElement('div');
    el.setAttribute('role', politeness === 'assertive' ? 'alert' : 'status');
    el.setAttribute('aria-live', politeness);
    el.setAttribute('aria-atomic', 'true');
    el.style.cssText =
        'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0';
    document.body.appendChild(el);
    return el;
}
function getRegion(politeness) {
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
export function announce(message, politeness = 'polite') {
    const region = getRegion(politeness);
    if (!region) {
        return;
    }
    region.textContent = '';
    window.requestAnimationFrame(() => {
        region.textContent = message;
    });
}
//# sourceMappingURL=live-region.js.map
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { DsCarousel } from './carousel.js';
import './define.js';
import { mount, resetTestDom } from '../../test-utils/mount.js';

beforeEach(() => {
  resetTestDom();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function getTrack(el: DsCarousel): HTMLElement {
  return el.shadowRoot!.querySelector<HTMLElement>('[part="track"]')!;
}

function getButton(el: DsCarousel, side: 'prev' | 'next'): HTMLElement {
  return el.shadowRoot!.querySelector<HTMLElement>(`[part~="button-${side}"]`)!;
}

function setTrackGeometry(track: HTMLElement, geometry: { scrollLeft: number; scrollWidth: number }): void {
  Object.defineProperty(track, 'clientWidth', { configurable: true, value: 300 });
  Object.defineProperty(track, 'scrollWidth', { configurable: true, value: geometry.scrollWidth });
  Object.defineProperty(track, 'scrollLeft', { configurable: true, value: geometry.scrollLeft });
}

async function scrollTo(el: DsCarousel, scrollLeft: number): Promise<void> {
  const track = getTrack(el);
  setTrackGeometry(track, { scrollLeft, scrollWidth: 900 });
  track.dispatchEvent(new Event('scroll'));
  await el.updateComplete;
}

async function mountCarousel(attributes = ''): Promise<DsCarousel> {
  return mount<DsCarousel>(`<ds-carousel ${attributes}><div>One</div><div>Two</div></ds-carousel>`);
}

describe('<ds-carousel>', () => {
  it('names its region and announces itself as a carousel', async () => {
    const el = await mountCarousel('label="Recommended"');
    const region = el.shadowRoot!.querySelector('section')!;

    expect(region.getAttribute('aria-label')).toBe('Recommended');
    expect(region.getAttribute('aria-roledescription')).toBe('carousel');
  });

  it('hides both buttons while every item fits', async () => {
    const el = await mountCarousel();

    expect(getButton(el, 'prev').hidden).toBe(true);
    expect(getButton(el, 'next').hidden).toBe(true);
  });

  it('offers only the next button at the start of a row that overflows', async () => {
    const el = await mountCarousel();

    await scrollTo(el, 0);

    expect(getButton(el, 'prev').hidden).toBe(true);
    expect(getButton(el, 'next').hidden).toBe(false);
  });

  it('offers both buttons in the middle and only the previous one at the end', async () => {
    const el = await mountCarousel();

    await scrollTo(el, 300);
    expect([getButton(el, 'prev').hidden, getButton(el, 'next').hidden]).toEqual([false, false]);

    await scrollTo(el, 600);
    expect([getButton(el, 'prev').hidden, getButton(el, 'next').hidden]).toEqual([false, true]);
  });

  it('scrolls by one view in either direction', async () => {
    const el = await mountCarousel();
    await scrollTo(el, 300);
    const scrollBy = vi.fn();
    getTrack(el).scrollBy = scrollBy;

    getButton(el, 'next').click();
    getButton(el, 'prev').click();

    expect(scrollBy.mock.calls).toEqual([[{ left: 300 }], [{ left: -300 }]]);
  });

  it('scrolls the other way when the page reads right to left', async () => {
    const el = await mountCarousel('dir="rtl"');
    await scrollTo(el, -300);
    const scrollBy = vi.fn();
    getTrack(el).scrollBy = scrollBy;

    getButton(el, 'next').click();

    expect(scrollBy).toHaveBeenCalledWith({ left: -300 });
  });

  it('hands focus to the previous button when the next one runs out of room', async () => {
    const el = await mountCarousel();
    await scrollTo(el, 300);
    getButton(el, 'next').focus();

    await scrollTo(el, 600);

    expect(el.shadowRoot!.activeElement).toBe(getButton(el, 'prev'));
  });

  it('takes translated names for its buttons', async () => {
    const el = await mountCarousel('prev-label="Anteriores" next-label="Siguientes"');

    expect(getButton(el, 'prev').getAttribute('label')).toBe('Anteriores');
    expect(getButton(el, 'next').getAttribute('label')).toBe('Siguientes');
  });

  it('announces itself with a translated role description', async () => {
    const el = await mountCarousel('role-description="carrusel"');

    expect(el.shadowRoot!.querySelector('section')!.getAttribute('aria-roledescription')).toBe('carrusel');
  });

  it('keeps watching its size after it moves to another parent', async () => {
    const observed: Element[] = [];
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe(target: Element): void {
          observed.push(target);
        }
        disconnect(): void {}
      },
    );
    const el = await mountCarousel();

    document.body.append(document.createElement('div'));
    document.body.lastElementChild!.append(el);

    expect(observed).toEqual([el, el]);
  });
});

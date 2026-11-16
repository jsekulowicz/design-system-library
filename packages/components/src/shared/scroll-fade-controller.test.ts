import { beforeEach, describe, expect, it } from 'vitest';
import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { ScrollFadeController } from './scroll-fade-controller.js';
import { resetTestDom } from '../test-utils/mount.js';

const OPAQUE = 'rgb(0 0 0)';
const CLEAR = 'rgb(0 0 0 / 0)';

function createHost(): ReactiveControllerHost & { connect: () => void } {
  const controllers: ReactiveController[] = [];
  return {
    addController: (controller: ReactiveController) => controllers.push(controller),
    removeController: () => {},
    requestUpdate: () => {},
    updateComplete: Promise.resolve(true),
    connect: () => controllers.forEach((controller) => controller.hostConnected?.()),
  };
}

function createScroller(scrollHeight: number, clientHeight: number, scrollTop = 0): HTMLElement {
  const el = document.createElement('div');
  document.body.appendChild(el);
  Object.defineProperties(el, {
    scrollHeight: { value: scrollHeight },
    clientHeight: { value: clientHeight },
    scrollTop: { value: scrollTop, writable: true },
  });
  return el;
}

async function waitForNextFrame(): Promise<void> {
  await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
}

async function getFade(scroller: HTMLElement): Promise<{ top: string; bottom: string }> {
  const host = createHost();
  new ScrollFadeController(host, () => scroller);
  host.connect();
  await waitForNextFrame();
  return {
    top: scroller.style.getPropertyValue('--ds-scroll-fade-top'),
    bottom: scroller.style.getPropertyValue('--ds-scroll-fade-bottom'),
  };
}

beforeEach(() => {
  resetTestDom();
});

describe('ScrollFadeController', () => {
  it('fades the bottom edge while there is content below', async () => {
    expect(await getFade(createScroller(400, 200))).toEqual({ top: OPAQUE, bottom: CLEAR });
  });

  it('fades the top edge once content has scrolled above', async () => {
    expect(await getFade(createScroller(400, 200, 200))).toEqual({ top: CLEAR, bottom: OPAQUE });
  });

  it('paints no fade when the content fits, which animation-timeline: scroll(self) gets wrong in some engines', async () => {
    expect(await getFade(createScroller(200, 200))).toEqual({ top: OPAQUE, bottom: OPAQUE });
  });

  it('ignores a couple of px of overflow that sub-pixel rounding leaves on content that visually fits', async () => {
    expect(await getFade(createScroller(202, 200))).toEqual({ top: OPAQUE, bottom: OPAQUE });
  });

  it('still fades once the overflow is real', async () => {
    expect(await getFade(createScroller(203, 200))).toEqual({ top: OPAQUE, bottom: CLEAR });
  });
});

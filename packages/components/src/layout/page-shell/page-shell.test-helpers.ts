import { afterAll, beforeAll, beforeEach } from 'vitest';
import type { DsButton } from '../../actions/button/button.js';
import { DsPageShell } from './page-shell.js';
import './define.js';
import { shimModalDialogMethods } from '../../test-utils/jsdom-gaps.js';
import { mount, resetTestDom } from '../../test-utils/mount.js';

type ResizeObserverCallback = ConstructorParameters<typeof ResizeObserver>[0];

class ResizeObserverMock {
  static instances: ResizeObserverMock[] = [];

  readonly callback: ResizeObserverCallback;
  target?: Element;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    ResizeObserverMock.instances.push(this);
  }

  observe(target?: Element): void {
    if (target) {
      this.target = target;
    }
  }

  disconnect(): void {}

  unobserve(): void {}
}

function findShellResizeObserver(el: Element): ResizeObserverMock {
  return ResizeObserverMock.instances.find((observer) => observer.target === el) ?? ResizeObserverMock.instances[0]!;
}

const OriginalResizeObserver = globalThis.ResizeObserver;

function renderPageShell(): string {
  return `
    <ds-page-shell brand="Brand">
      <div slot="aside" collapsed>
        <a href="#settings">Settings</a>
      </div>
      <div>Content</div>
    </ds-page-shell>
  `;
}

function renderPageShellWithFooter(): string {
  return `
    <ds-page-shell brand="Brand">
      <div slot="aside" collapsed>
        <a href="#settings">Settings</a>
      </div>
      <div>Content</div>
      <div slot="footer">Footer</div>
    </ds-page-shell>
  `;
}

beforeAll(() => {
  if (!customElements.get('ds-page-shell')) {
    customElements.define('ds-page-shell', DsPageShell);
  }
  globalThis.ResizeObserver = ResizeObserverMock as never;

  shimModalDialogMethods();
});

afterAll(() => {
  globalThis.ResizeObserver = OriginalResizeObserver;
});

beforeEach(() => {
  resetTestDom();
  ResizeObserverMock.instances = [];
});

async function forceMobileLayout(el: DsPageShell): Promise<void> {
  const observer = findShellResizeObserver(el);
  observer.callback([{ contentRect: { width: 360 } } as ResizeObserverEntry], observer as never);
  await el.updateComplete;
}

async function forceDesktopLayout(el: DsPageShell): Promise<void> {
  const observer = findShellResizeObserver(el);
  observer.callback([{ contentRect: { width: 1024 } } as ResizeObserverEntry], observer as never);
  await el.updateComplete;
}

export {
  DsButton,
  DsPageShell,
  ResizeObserverMock,
  forceDesktopLayout,
  forceMobileLayout,
  mount,
  renderPageShell,
  renderPageShellWithFooter,
  findShellResizeObserver,
};

import { afterAll, beforeAll, beforeEach } from 'vitest';
import type { DsButton } from '../../actions/button/button.js';
import { DsPageShell } from './page-shell.js';
import './define.js';
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

function shellResizeObserver(el: Element): ResizeObserverMock {
  return ResizeObserverMock.instances.find((observer) => observer.target === el) ?? ResizeObserverMock.instances[0]!;
}

const OriginalResizeObserver = globalThis.ResizeObserver;

function pageShellTemplate(): string {
  return `
    <ds-page-shell brand="Brand">
      <div slot="aside" collapsed>
        <a href="#settings">Settings</a>
      </div>
      <div>Content</div>
    </ds-page-shell>
  `;
}

function pageShellWithFooterTemplate(): string {
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

  // The mobile drawer renders a <ds-drawer>, which uses a native <dialog>
  // under the hood. jsdom's HTMLDialogElement lacks showModal/close, so
  // shim them the same way the dialog/drawer test files do.
  const proto = HTMLDialogElement.prototype as unknown as {
    showModal?: () => void;
    close?: (returnValue?: string) => void;
  };
  if (typeof proto.showModal !== 'function') {
    proto.showModal = function showModal(this: HTMLDialogElement) {
      this.setAttribute('open', '');
    };
  }
  if (typeof proto.close !== 'function') {
    proto.close = function close(this: HTMLDialogElement, returnValue?: string) {
      if (returnValue !== undefined) {
        (this as unknown as { returnValue: string }).returnValue = returnValue;
      }
      this.removeAttribute('open');
      this.dispatchEvent(new Event('close'));
    };
  }
});

afterAll(() => {
  globalThis.ResizeObserver = OriginalResizeObserver;
});

beforeEach(() => {
  resetTestDom();
  ResizeObserverMock.instances = [];
});

async function forceMobileLayout(el: DsPageShell): Promise<void> {
  const observer = shellResizeObserver(el);
  observer.callback([{ contentRect: { width: 360 } } as ResizeObserverEntry], observer as never);
  await el.updateComplete;
}

async function forceDesktopLayout(el: DsPageShell): Promise<void> {
  const observer = shellResizeObserver(el);
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
  pageShellTemplate,
  pageShellWithFooterTemplate,
  shellResizeObserver,
};

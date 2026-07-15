import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { DsTooltip } from './tooltip.js';
import './define.js';
import { mount, resetTestDom } from '../../test-utils/mount.js';

interface PopoverHarness {
  showCalls: number;
  hideCalls: number;
  tooltip: HTMLElement;
  setOpenState(next: boolean): void;
}

beforeAll(() => {
  if (!customElements.get('ds-tooltip')) {
    customElements.define('ds-tooltip', DsTooltip);
  }
});

beforeEach(() => {
  resetTestDom();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

function domRect(top: number, left: number, width: number, height: number): DOMRect {
  return {
    top,
    left,
    width,
    height,
    right: left + width,
    bottom: top + height,
    x: left,
    y: top,
    toJSON: () => ({}),
  } as DOMRect;
}

function setupPopoverHarness(el: DsTooltip): PopoverHarness {
  const tooltip = el.shadowRoot!.querySelector('.tooltip') as HTMLElement;
  const anchor = el.shadowRoot!.querySelector('.anchor') as HTMLElement;
  anchor.getBoundingClientRect = () => domRect(100, 200, 80, 40);

  let openState = false;
  let showCalls = 0;
  let hideCalls = 0;

  (tooltip as HTMLElement & { showPopover: () => void }).showPopover = () => {
    showCalls += 1;
    openState = true;
  };
  (tooltip as HTMLElement & { hidePopover: () => void }).hidePopover = () => {
    hideCalls += 1;
    openState = false;
  };

  Object.defineProperty(tooltip, 'matches', {
    configurable: true,
    value: (selector: string): boolean => {
      if (selector === ':popover-open') {
        return openState;
      }
      return false;
    },
  });

  return {
    tooltip,
    get showCalls() {
      return showCalls;
    },
    get hideCalls() {
      return hideCalls;
    },
    setOpenState(next: boolean): void {
      openState = next;
    },
  };
}

describe('<ds-tooltip>', () => {
  it('wraps content independently of the trigger context', () => {
    const css = DsTooltip.styles.map((style) => style.cssText).join('\n');

    expect(css).toContain('white-space: normal');
    expect(css).toContain('overflow-wrap: anywhere');
    expect(css).toContain('text-align: start');
    expect(css).toContain('max-width: min(16rem, calc(100vw - var(--ds-space-4)))');
  });

  it('stays safe when popover APIs are unavailable', async () => {
    const el = await mount<DsTooltip>('<ds-tooltip><button>Trigger</button><span slot="tip">Tip</span></ds-tooltip>');
    el.open = true;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.tooltip')).not.toBeNull();
  });

  it('shows and hides the tooltip, reflecting each placement', async () => {
    const el = await mount<DsTooltip>('<ds-tooltip><button>Trigger</button><span slot="tip">Tip</span></ds-tooltip>');
    const harness = setupPopoverHarness(el);

    // Placement is reflected to the host attribute, which drives the CSS
    // anchor positioning (position-area) — there's no JS positioning anymore.
    for (const placement of ['top', 'right', 'bottom', 'left'] as const) {
      harness.setOpenState(false);
      el.placement = placement;
      el.open = true;
      await el.updateComplete;
      expect(el.getAttribute('placement')).toBe(placement);
    }

    el.open = false;
    await el.updateComplete;

    expect(harness.showCalls).toBe(4);
    expect(harness.hideCalls).toBe(1);
  });

  it('respects hover delay and focus behavior', async () => {
    vi.useFakeTimers();
    const el = await mount<DsTooltip>('<ds-tooltip delay="200"><button>Trigger</button><span slot="tip">Tip</span></ds-tooltip>');
    const harness = setupPopoverHarness(el);
    const anchor = el.shadowRoot!.querySelector('.anchor') as HTMLElement;

    anchor.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    vi.advanceTimersByTime(199);
    await el.updateComplete;
    expect(harness.showCalls).toBe(0);

    vi.advanceTimersByTime(1);
    await el.updateComplete;
    expect(harness.showCalls).toBe(1);

    anchor.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    await el.updateComplete;
    expect(harness.hideCalls).toBe(1);

    anchor.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    await el.updateComplete;
    expect(harness.showCalls).toBe(2);

    anchor.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    await el.updateComplete;
    expect(harness.hideCalls).toBe(2);
  });

  it('shows immediately on hover when delay is zero', async () => {
    const el = await mount<DsTooltip>('<ds-tooltip><button>Trigger</button><span slot="tip">Tip</span></ds-tooltip>');
    const harness = setupPopoverHarness(el);
    const anchor = el.shadowRoot!.querySelector('.anchor') as HTMLElement;

    anchor.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await el.updateComplete;

    expect(harness.showCalls).toBe(1);
  });

  it('ignores focus in hover-only mode and handles popover errors on disconnect', async () => {
    const el = await mount<DsTooltip>('<ds-tooltip hover-only><button>Trigger</button><span slot="tip">Tip</span></ds-tooltip>');
    const harness = setupPopoverHarness(el);

    const failingShow = harness.tooltip as HTMLElement & { showPopover: () => void; hidePopover: () => void };
    failingShow.showPopover = () => {
      throw new Error('show failed');
    };
    failingShow.hidePopover = () => {
      throw new Error('hide failed');
    };

    const anchor = el.shadowRoot!.querySelector('.anchor') as HTMLElement;
    anchor.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    anchor.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    await el.updateComplete;
    expect(harness.showCalls).toBe(0);
    expect(harness.hideCalls).toBe(0);

    el.open = true;
    await el.updateComplete;
    harness.setOpenState(true);
    el.remove();

    expect(el.isConnected).toBe(false);
  });

  it('stops positioning if tooltip loses popover capabilities between show and update', async () => {
    const el = await mount<DsTooltip>('<ds-tooltip><button>Trigger</button><span slot="tip">Tip</span></ds-tooltip>');
    const tooltip = el.shadowRoot!.querySelector('.tooltip') as HTMLElement & { showPopover: () => void };

    tooltip.showPopover = function showAndRemove(): void {
      Reflect.deleteProperty(this, 'showPopover');
    };
    Object.defineProperty(tooltip, 'matches', {
      configurable: true,
      value: () => false,
    });

    el.open = true;
    await el.updateComplete;

    expect(el.open).toBe(true);
  });

  it('does not call showPopover when tooltip is already open', async () => {
    const el = await mount<DsTooltip>('<ds-tooltip><button>Trigger</button><span slot="tip">Tip</span></ds-tooltip>');
    const harness = setupPopoverHarness(el);
    harness.setOpenState(true);

    el.open = true;
    await el.updateComplete;

    expect(harness.showCalls).toBe(0);
  });

  it('stays safe when tooltip node is missing', async () => {
    const el = await mount<DsTooltip>('<ds-tooltip><button>Trigger</button><span slot="tip">Tip</span></ds-tooltip>');
    el.shadowRoot!.querySelector('.tooltip')?.remove();

    el.open = true;
    await el.updateComplete;

    expect(el.open).toBe(true);
  });
});

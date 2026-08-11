import { beforeEach, describe, expect, it } from 'vitest';
import type { DsPopoverButton } from './popover-button.js';
import './define.js';
import { mount, resetTestDom } from '../../test-utils/mount.js';

function trigger(host: DsPopoverButton): HTMLElement {
  return host.shadowRoot!.querySelector('#trigger') as HTMLElement;
}

function clickTrigger(host: DsPopoverButton): void {
  trigger(host).shadowRoot!.querySelector<HTMLButtonElement>('button')!.click();
}

function panel(host: DsPopoverButton): HTMLElement | null {
  return host.shadowRoot!.querySelector('#panel');
}

beforeEach(() => {
  resetTestDom();
});

describe('<ds-popover-button>', () => {
  it('uses neutral disclosure semantics for the default trigger', async () => {
    const element = await mount<DsPopoverButton>(
      '<ds-popover-button label="Preferences"><div>Settings</div></ds-popover-button>',
    );

    expect(trigger(element).getAttribute('aria-expanded')).toBe('false');
    expect(trigger(element).hasAttribute('aria-haspopup')).toBe(false);
    expect(panel(element)).toBeNull();
  });

  it('opens and closes from the trigger', async () => {
    const element = await mount<DsPopoverButton>(
      '<ds-popover-button label="Preferences"><div>Settings</div></ds-popover-button>',
    );

    clickTrigger(element);
    await element.updateComplete;
    expect(element.open).toBe(true);
    expect(trigger(element).getAttribute('aria-controls')).toBe('panel');
    expect(panel(element)).not.toBeNull();
    expect(element.textContent).toContain('Settings');

    clickTrigger(element);
    await element.updateComplete;
    expect(element.open).toBe(false);
    expect(panel(element)).toBeNull();
  });

  it('wires neutral disclosure attributes onto a slotted trigger', async () => {
    const element = await mount<DsPopoverButton>(`
      <ds-popover-button>
        <button slot="trigger" type="button" id="custom">Open</button>
        <div>Panel</div>
      </ds-popover-button>
    `);
    await element.updateComplete;
    const custom = element.querySelector<HTMLButtonElement>('#custom')!;

    expect(custom.getAttribute('aria-expanded')).toBe('false');
    expect(custom.hasAttribute('aria-haspopup')).toBe(false);

    custom.click();
    await element.updateComplete;
    expect(custom.getAttribute('aria-expanded')).toBe('true');
    expect(custom.getAttribute('aria-controls')).toBe('panel');
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const element = await mount<DsPopoverButton>(
      '<ds-popover-button label="Preferences"><button>Choice</button></ds-popover-button>',
    );
    clickTrigger(element);
    await element.updateComplete;

    panel(element)!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await element.updateComplete;
    await element.updateComplete;

    expect(element.open).toBe(false);
    expect(element.shadowRoot!.activeElement).toBe(trigger(element));
  });

  it('closes on an outside click', async () => {
    const element = await mount<DsPopoverButton>(
      '<ds-popover-button label="Preferences"><div>Settings</div></ds-popover-button>',
    );
    clickTrigger(element);
    await element.updateComplete;

    document.body.click();
    await element.updateComplete;

    expect(element.open).toBe(false);
  });

  it('supports controlled open state and lifecycle events', async () => {
    const element = await mount<DsPopoverButton>(
      '<ds-popover-button label="Preferences"><div>Settings</div></ds-popover-button>',
    );
    const events: string[] = [];
    element.addEventListener('ds-open', () => events.push('open'));
    element.addEventListener('ds-close', () => events.push('close'));

    element.open = true;
    await element.updateComplete;
    expect(element.hasAttribute('open')).toBe(true);

    element.open = false;
    await element.updateComplete;
    expect(events).toEqual(['open', 'close']);
  });

  it('does not open while disabled', async () => {
    const element = await mount<DsPopoverButton>(
      '<ds-popover-button label="Preferences" disabled><div>Settings</div></ds-popover-button>',
    );

    clickTrigger(element);
    await element.updateComplete;

    expect(element.open).toBe(false);
  });
});

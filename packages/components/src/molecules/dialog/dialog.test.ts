import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import type { DsDialog } from './dialog.js';
import './define.js';
import '../../atoms/button/define.js';
import { mount, mountWithProps, resetTestDom } from '../../test-utils/mount.js';

beforeAll(() => {
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

beforeEach(() => {
  resetTestDom();
});

const TEMPLATE = `
  <ds-dialog>
    <span slot="title">Confirm</span>
    <p>Are you sure you want to continue?</p>
    <ds-button slot="footer" variant="ghost">Cancel</ds-button>
    <ds-button slot="footer" variant="primary">Confirm</ds-button>
  </ds-dialog>
`;

function getDialogEl(host: DsDialog): HTMLDialogElement {
  return host.shadowRoot!.querySelector('dialog')!;
}

describe('<ds-dialog>', () => {
  it('renders title, default and footer slots inside ds-card', async () => {
    const el = await mount<DsDialog>(TEMPLATE);
    const card = el.shadowRoot!.querySelector('ds-card')!;
    expect(card).not.toBeNull();
    expect(card.getAttribute('part')).toContain('card');
    const titleSlot = el.shadowRoot!.querySelector('slot[name="title"]') as HTMLSlotElement;
    const defaultSlot = el.shadowRoot!.querySelector('slot:not([name])') as HTMLSlotElement;
    const footerSlot = el.shadowRoot!.querySelector('slot[name="footer"]') as HTMLSlotElement;
    expect(titleSlot.assignedElements()[0]?.textContent).toBe('Confirm');
    expect(defaultSlot.assignedElements()[0]?.tagName.toLowerCase()).toBe('p');
    expect(footerSlot.assignedElements()).toHaveLength(2);
  });

  it('opens via show() and closes via close()', async () => {
    const el = await mount<DsDialog>(TEMPLATE);
    const events: string[] = [];
    el.addEventListener('ds-open', () => events.push('open'));
    el.addEventListener('ds-close', () => events.push('close'));

    el.show();
    await el.updateComplete;
    expect(el.open).toBe(true);
    expect(getDialogEl(el).open).toBe(true);
    expect(events).toEqual(['open']);

    el.close();
    await el.updateComplete;
    expect(el.open).toBe(false);
    expect(getDialogEl(el).open).toBe(false);
    expect(events).toEqual(['open', 'close']);
  });

  it('emits ds-close with returnValue when close(value) is called', async () => {
    const el = await mountWithProps<DsDialog>(TEMPLATE, { open: true });
    const closes: CustomEvent<{ returnValue: string }>[] = [];
    el.addEventListener('ds-close', (event) =>
      closes.push(event as CustomEvent<{ returnValue: string }>),
    );

    el.close('confirmed');
    await el.updateComplete;
    expect(closes).toHaveLength(1);
    expect(closes[0]?.detail.returnValue).toBe('confirmed');
  });

  it('reflects open as an attribute', async () => {
    const el = await mount<DsDialog>(TEMPLATE);
    expect(el.hasAttribute('open')).toBe(false);
    el.show();
    await el.updateComplete;
    expect(el.hasAttribute('open')).toBe(true);
  });

  it('closes when the header close button is clicked', async () => {
    const el = await mountWithProps<DsDialog>(TEMPLATE, { open: true });
    const button = el.shadowRoot!.querySelector('button.close-btn') as HTMLButtonElement;
    button.click();
    await el.updateComplete;
    expect(el.open).toBe(false);
  });

  it('closes on backdrop click when dismissible', async () => {
    const el = await mountWithProps<DsDialog>(TEMPLATE, { open: true });
    const dialog = getDialogEl(el);
    dialog.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(el.open).toBe(false);
  });

  it('ignores backdrop click when not dismissible', async () => {
    const el = await mountWithProps<DsDialog>(TEMPLATE, { open: true, dismissible: false });
    const dialog = getDialogEl(el);
    dialog.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(el.open).toBe(true);
  });

  it('emits ds-cancel and closes on native cancel event when dismissible', async () => {
    const el = await mountWithProps<DsDialog>(TEMPLATE, { open: true });
    const events: string[] = [];
    el.addEventListener('ds-cancel', () => events.push('cancel'));
    el.addEventListener('ds-close', () => events.push('close'));

    const dialog = getDialogEl(el);
    const cancelEvent = new Event('cancel', { cancelable: true });
    dialog.dispatchEvent(cancelEvent);
    if (!cancelEvent.defaultPrevented) dialog.close();
    await el.updateComplete;
    expect(events).toEqual(['cancel', 'close']);
    expect(el.open).toBe(false);
  });

  it('prevents native cancel when not dismissible', async () => {
    const el = await mountWithProps<DsDialog>(TEMPLATE, { open: true, dismissible: false });
    const dialog = getDialogEl(el);
    const cancelEvent = new Event('cancel', { cancelable: true });
    dialog.dispatchEvent(cancelEvent);
    expect(cancelEvent.defaultPrevented).toBe(true);
  });

  it('uses aria-labelledby pointing at the slotted title by default', async () => {
    const el = await mount<DsDialog>(TEMPLATE);
    const dialog = getDialogEl(el);
    const labelledBy = dialog.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();
    const heading = el.shadowRoot!.getElementById(labelledBy!);
    expect(heading?.tagName.toLowerCase()).toBe('h2');
    expect(dialog.getAttribute('aria-label')).toBeNull();
  });

  it('falls back to aria-label when label prop is set', async () => {
    const el = await mountWithProps<DsDialog>(TEMPLATE, { label: 'Plain label' });
    const dialog = getDialogEl(el);
    expect(dialog.getAttribute('aria-label')).toBe('Plain label');
    expect(dialog.getAttribute('aria-labelledby')).toBeNull();
  });

  it('forwards ds-card body via part="body" so consumers can target the scroll container', async () => {
    const el = await mount<DsDialog>(TEMPLATE);
    const card = el.shadowRoot!.querySelector('ds-card')!;
    const cardBody = card.shadowRoot!.querySelector('[part="body"]');
    expect(cardBody).not.toBeNull();
  });

  it('closes the dialog on disconnect if it was open', async () => {
    const el = await mountWithProps<DsDialog>(TEMPLATE, { open: true });
    const dialog = getDialogEl(el);
    expect(dialog.open).toBe(true);
    el.remove();
    expect(dialog.open).toBe(false);
  });
});

import { beforeEach, describe, expect, it } from 'vitest';
import { html, LitElement, type TemplateResult } from 'lit';
import { DEFAULT_SLOT, SlotPresenceController } from './slot-presence.js';
import { mount, resetTestDom } from '../test-utils/mount.js';

class PresenceHost extends LitElement {
  readonly slots = new SlotPresenceController(this, [DEFAULT_SLOT, 'tip']);

  override render(): TemplateResult {
    return html`
      <slot @slotchange=${this.slots.handleSlotChange}></slot>
      <slot name="tip" @slotchange=${this.slots.handleSlotChange}></slot>
    `;
  }
}

class NestingHost extends LitElement {
  override render(): TemplateResult {
    return html`<presence-host><slot name="inner" slot="tip"></slot></presence-host>`;
  }
}

customElements.define('presence-host', PresenceHost);
customElements.define('nesting-host', NestingHost);

beforeEach(resetTestDom);

async function settle(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

describe('SlotPresenceController', () => {
  it('starts with every tracked slot absent', async () => {
    const host = await mount<PresenceHost>('<presence-host></presence-host>');

    expect(host.slots.has(DEFAULT_SLOT)).toBe(false);
    expect(host.slots.has('tip')).toBe(false);
  });

  it('sees content the consumer supplied up front', async () => {
    const host = await mount<PresenceHost>('<presence-host><span slot="tip">Tip</span></presence-host>');
    await settle();

    expect(host.slots.has('tip')).toBe(true);
    expect(host.slots.has(DEFAULT_SLOT)).toBe(false);
  });

  it('follows content added and removed after mount', async () => {
    const host = await mount<PresenceHost>('<presence-host></presence-host>');
    const tip = document.createElement('span');
    tip.slot = 'tip';
    tip.textContent = 'Tip';

    host.append(tip);
    await settle();
    expect(host.slots.has('tip')).toBe(true);

    tip.remove();
    await settle();
    expect(host.slots.has('tip')).toBe(false);
  });

  it('ignores whitespace, which is what a formatted template leaves behind', async () => {
    const host = await mount<PresenceHost>('<presence-host>\n  \n</presence-host>');
    await settle();

    expect(host.slots.has(DEFAULT_SLOT)).toBe(false);
  });

  it('hasAny reports whether any of the named slots is filled', async () => {
    const host = await mount<PresenceHost>('<presence-host><span slot="tip">Tip</span></presence-host>');
    await settle();

    expect(host.slots.hasAny(DEFAULT_SLOT, 'tip')).toBe(true);
    expect(host.slots.hasAny(DEFAULT_SLOT)).toBe(false);
  });

  // slotchange bubbles, so a slot assigned into a tracked slot arrives with
  // event.target pointing at the inner slot rather than the tracked one.
  it('credits the slot that listened, not a nested slot whose change bubbled to it', async () => {
    const outer = await mount<NestingHost>('<nesting-host></nesting-host>');
    const host = outer.shadowRoot!.querySelector<PresenceHost>('presence-host')!;
    await host.updateComplete;
    await settle();
    expect(host.slots.has('tip')).toBe(false);

    const inner = document.createElement('span');
    inner.slot = 'inner';
    inner.textContent = 'Through the nested slot';
    outer.append(inner);
    await settle();

    expect(host.slots.has('tip')).toBe(true);
  });
});

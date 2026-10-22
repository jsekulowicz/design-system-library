import { beforeEach, describe, expect, it } from 'vitest';
import type { DsRadioGroup } from './radio-group.js';
import type { DsRadio } from '../radio/radio.js';
import './define.js';
import '../radio/define.js';
import { mount, resetTestDom } from '../../test-utils/mount.js';

beforeEach(resetTestDom);

async function group(): Promise<DsRadioGroup> {
  const element = await mount<DsRadioGroup>(`
    <ds-radio-group label="Hint" name="hint">
      <ds-radio radio-value="letter" disabled>Letter</ds-radio>
      <ds-radio radio-value="word">Word</ds-radio>
    </ds-radio-group>
  `);
  element.shadowRoot!.querySelector('slot')!.dispatchEvent(new Event('slotchange'));
  await element.updateComplete;
  return element;
}

describe('individually disabled radio options', () => {
  it('keeps the disabled option and leaves the other option unselected', async () => {
    const element = await group();
    const [letter, word] = element.querySelectorAll<DsRadio>('ds-radio');

    expect(letter!.disabled).toBe(true);
    expect(letter!.tabStop).toBe(false);
    expect(word!.tabStop).toBe(true);
    expect(element.value).toBe('');
    expect(word!.checked).toBe(false);
  });

  it('restores individual disabled states after enabling the group', async () => {
    const element = await group();
    element.disabled = true;
    await element.updateComplete;
    element.disabled = false;
    await element.updateComplete;
    const [letter, word] = element.querySelectorAll<DsRadio>('ds-radio');

    expect(letter!.disabled).toBe(true);
    expect(word!.disabled).toBe(false);
    expect(word!.tabStop).toBe(true);
  });

  it('moves the tab stop when the selected option becomes disabled', async () => {
    const element = await group();
    element.value = 'word';
    await element.updateComplete;
    const [letter, word] = element.querySelectorAll<DsRadio>('ds-radio');
    letter!.disabled = false;
    word!.disabled = true;
    await Promise.all([letter!.updateComplete, word!.updateComplete]);
    await new Promise<void>((resolve) => setTimeout(resolve, 0));

    expect(letter!.tabStop).toBe(true);
    expect(word!.tabStop).toBe(false);
  });

  it('makes an asynchronously enabled option reachable without selecting it', async () => {
    const element = await group();
    const [letter, word] = element.querySelectorAll<DsRadio>('ds-radio');
    word!.disabled = true;
    await word!.updateComplete;
    element.requestUpdate();
    await element.updateComplete;
    letter!.disabled = false;
    await letter!.updateComplete;
    await new Promise<void>((resolve) => setTimeout(resolve, 0));

    expect(letter!.tabStop).toBe(true);
    expect(letter!.checked).toBe(false);
    expect(element.value).toBe('');
  });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { DsSearchableSelect } from './searchable-select.js';
import './define.js';
import { mount, resetTestDom } from '../../test-utils/mount.js';

beforeEach(resetTestDom);

function insertText(el: DsSearchableSelect, value: string): void {
  const input = el.shadowRoot!.querySelector('input')!;
  input.value = value;
  input.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertFromPaste', data: value }));
}

describe('search input without a character keydown', () => {
  it('opens a focused field and emits the inserted query', async () => {
    const el = await mount<DsSearchableSelect>('<ds-searchable-select label="Choice"></ds-searchable-select>');
    const search = vi.fn();
    el.addEventListener('ds-search', search);
    el.focus();
    insertText(el, 'pasted query');
    await el.updateComplete;

    expect(el._open).toBe(true);
    expect(el.shadowRoot!.querySelector('input')!.value).toBe('pasted query');
    expect(search.mock.calls[0]?.[0].detail).toEqual({ query: 'pasted query' });
  });

  it('continues emitting edits while an open list loads new results', async () => {
    const el = await mount<DsSearchableSelect>('<ds-searchable-select label="Choice"></ds-searchable-select>');
    insertText(el, 'first');
    el.loading = true;
    await el.updateComplete;
    const search = vi.fn();
    el.addEventListener('ds-search', search);
    insertText(el, 'next');
    await el.updateComplete;

    expect(el._open).toBe(true);
    expect(el.shadowRoot!.querySelector('input')!.value).toBe('next');
    expect(search.mock.calls[0]?.[0].detail).toEqual({ query: 'next' });
  });
});

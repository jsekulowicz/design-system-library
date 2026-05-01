import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DsForm } from './form.js';
import './define.js';
import { mount, resetTestDom } from '../../test-utils/mount.js';

beforeAll(() => {
  if (!customElements.get('ds-form')) {
    customElements.define('ds-form', DsForm);
  }
  if (!customElements.get('test-number-control')) {
    class TestNumberControl extends HTMLElement {
      value = 42;

      get name(): string {
        return this.getAttribute('name') ?? '';
      }

      checkValidity(): boolean {
        return true;
      }
    }
    customElements.define('test-number-control', TestNumberControl);
  }
  if (!customElements.get('test-file-control')) {
    class TestFileControl extends HTMLElement {
      value = new File(['resume'], 'resume.txt', { type: 'text/plain' });

      get name(): string {
        return this.getAttribute('name') ?? '';
      }

      checkValidity(): boolean {
        return true;
      }
    }
    customElements.define('test-file-control', TestFileControl);
  }
});

beforeEach(() => {
  resetTestDom();
});

function getNativeForm(el: DsForm): HTMLFormElement {
  return el.shadowRoot!.querySelector('form') as HTMLFormElement;
}

describe('<ds-form>', () => {
  it('renders action, method and optional title', async () => {
    const el = await mount<DsForm>('<ds-form action="/save" method="get" title="Account"></ds-form>');
    const form = getNativeForm(el);

    expect(form.getAttribute('action')).toBe('/save');
    expect(form.getAttribute('method')).toBe('get');
    expect(el.shadowRoot!.querySelector('.title')?.textContent?.trim()).toBe('Account');

    el.header = '';
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.title')).toBeNull();
  });

  it('emits ds-invalid when invalid controls exist and noValidate is false', async () => {
    const el = await mount<DsForm>(`
      <ds-form>
        <input name="email" type="email" value="invalid" />
      </ds-form>
    `);

    let invalidEvents = 0;
    let submitEvents = 0;
    el.addEventListener('ds-invalid', () => {
      invalidEvents += 1;
    });
    el.addEventListener('ds-submit', () => {
      submitEvents += 1;
    });

    getNativeForm(el).requestSubmit();

    expect(invalidEvents).toBe(1);
    expect(submitEvents).toBe(0);
  });

  it('emits ds-submit with FormData and skips empty values', async () => {
    const el = await mount<DsForm>(`
      <ds-form>
        <input name="name" value="Jane" />
        <input name="empty" value="" />
        <div name="ghost"></div>
        <test-number-control name="extra"></test-number-control>
      </ds-form>
    `);
    const ghost = el.querySelector('div[name="ghost"]') as HTMLElement & { checkValidity?: () => boolean };
    ghost.checkValidity = () => true;

    let payload: FormData | null = null;
    el.addEventListener('ds-submit', (event) => {
      payload = (event as CustomEvent<{ data: FormData }>).detail.data;
    });

    getNativeForm(el).requestSubmit();

    expect(payload).toBeInstanceOf(FormData);
    expect(payload!.get('name')).toBe('Jane');
    expect(payload!.get('empty')).toBeNull();
    expect(payload!.get('ghost')).toBeNull();
    expect(payload!.get('extra')).toBe('42');
  });

  it('submits even with invalid controls when noValidate is true', async () => {
    const el = await mount<DsForm>(`
      <ds-form novalidate>
        <input name="email" type="email" value="invalid" />
      </ds-form>
    `);

    let invalidEvents = 0;
    let submitEvents = 0;
    el.addEventListener('ds-invalid', () => {
      invalidEvents += 1;
    });
    el.addEventListener('ds-submit', () => {
      submitEvents += 1;
    });

    getNativeForm(el).requestSubmit();

    expect(invalidEvents).toBe(0);
    expect(submitEvents).toBe(1);
  });

  it('keeps File objects in FormData', async () => {
    const el = await mount<DsForm>(`
      <ds-form>
        <test-file-control name="attachment"></test-file-control>
      </ds-form>
    `);
    let payload: FormData | null = null;
    el.addEventListener('ds-submit', (event) => {
      payload = (event as CustomEvent<{ data: FormData }>).detail.data;
    });

    getNativeForm(el).requestSubmit();

    expect(payload).toBeInstanceOf(FormData);
    expect(payload!.get('attachment')).toBeInstanceOf(File);
  });
});

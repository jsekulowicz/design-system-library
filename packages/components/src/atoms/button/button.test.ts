import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { DsButton } from './button.js';
import { buttonStyles } from './button.styles.js';
import { DsForm } from '../../organisms/form/form.js';
import './define.js';
import '../../organisms/form/define.js';
import { mount, resetTestDom } from '../../test-utils/mount.js';

beforeAll(() => {
  if (!customElements.get('ds-button')) {
    customElements.define('ds-button', DsButton);
  }
  if (!customElements.get('ds-form')) {
    customElements.define('ds-form', DsForm);
  }
});

beforeEach(() => {
  resetTestDom();
});

describe('<ds-button>', () => {
  it('defaults to primary/md button type', async () => {
    const el = await mount<DsButton>('<ds-button>Go</ds-button>');
    expect(el.variant).toBe('primary');
    expect(el.size).toBe('md');
    expect(el.type).toBe('button');
    expect(el.square).toBe(false);
  });

  it('reflects square for icon-only sizing', async () => {
    const el = await mount<DsButton>('<ds-button square label="Search">*</ds-button>');
    expect(el.square).toBe(true);
    expect(el.hasAttribute('square')).toBe(true);
  });

  it('emits ds-click on activation and respects disabled', async () => {
    const el = await mount<DsButton>('<ds-button>Go</ds-button>');
    const events: Event[] = [];
    el.addEventListener('ds-click', (event) => events.push(event));
    el.shadowRoot!.querySelector('button')!.click();
    expect(events).toHaveLength(1);
    el.disabled = true;
    await el.updateComplete;
    el.shadowRoot!.querySelector('button')!.click();
    expect(events).toHaveLength(1);
  });

  it('submits the host form when type=submit', async () => {
    document.body.innerHTML = '<form><ds-button type="submit">Send</ds-button></form>';
    const form = document.querySelector('form')!;
    const btn = form.querySelector('ds-button') as DsButton;
    await btn.updateComplete;
    let submitted = false;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      submitted = true;
    });
    btn.shadowRoot!.querySelector('button')!.click();
    expect(submitted).toBe(true);
  });

  it('resets the host form when type=reset', async () => {
    document.body.innerHTML =
      '<form><input name="email" value="a@b.com"/><ds-button type="reset">Reset</ds-button></form>';
    const form = document.querySelector('form')!;
    const btn = form.querySelector('ds-button') as DsButton;
    await btn.updateComplete;
    const resetSpy = vi.spyOn(form, 'reset');

    btn.shadowRoot!.querySelector('button')!.click();

    expect(resetSpy).toHaveBeenCalledTimes(1);
  });

  it('falls back to ds-form shadow form when no native ancestor form exists', async () => {
    document.body.innerHTML = '<ds-form><ds-button type="submit">Send</ds-button></ds-form>';
    const formHost = document.querySelector('ds-form') as DsForm;
    await formHost.updateComplete;
    const btn = formHost.querySelector('ds-button') as DsButton;
    await btn.updateComplete;
    const shadowForm = formHost.shadowRoot!.querySelector('form') as HTMLFormElement;
    const submitSpy = vi.spyOn(shadowForm, 'requestSubmit');

    btn.shadowRoot!.querySelector('button')!.click();

    expect(submitSpy).toHaveBeenCalledTimes(1);
  });

  it('emits ds-click for reset buttons even when no form exists', async () => {
    const el = await mount<DsButton>('<ds-button type="reset">Reset</ds-button>');
    const events: Event[] = [];
    el.addEventListener('ds-click', (event) => events.push(event));

    el.shadowRoot!.querySelector('button')!.click();

    expect(events).toHaveLength(1);
  });

  it('renders loading affordance and busy aria attributes', async () => {
    const el = await mount<DsButton>('<ds-button loading>Wait</ds-button>');
    const button = el.shadowRoot!.querySelector('button') as HTMLButtonElement;

    expect(button.getAttribute('aria-disabled')).toBe('true');
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(el.shadowRoot!.querySelector('.spinner')).not.toBeNull();
  });

  it('keeps every slot in the same in-flow wrapper whether or not it is loading', async () => {
    const el = await mount<DsButton>('<ds-button><span slot="leading">icon</span>Wait</ds-button>');
    const slotNames = () =>
      Array.from(el.shadowRoot!.querySelectorAll('.content slot')).map((s) => s.getAttribute('name'));

    expect(slotNames()).toEqual(['leading', null, 'trailing']);

    el.loading = true;
    await el.updateComplete;

    expect(slotNames()).toEqual(['leading', null, 'trailing']);
    expect(el.shadowRoot!.querySelector('.content')!.className).toContain('is-hidden');
  });

  it('renders the spinner as an overlay that stays out of the flex row', async () => {
    const el = await mount<DsButton>('<ds-button loading>Wait</ds-button>');

    const overlay = el.shadowRoot!.querySelector('.loading-overlay');
    expect(overlay).not.toBeNull();
    expect(overlay!.querySelector('.spinner')).not.toBeNull();
    expect(el.shadowRoot!.querySelector('.content .spinner')).toBeNull();
    expect(buttonStyles.cssText).toMatch(/\.loading-overlay\s*{[^}]*position:\s*absolute/s);
    expect(buttonStyles.cssText).toMatch(/\.btn\s*{[^}]*position:\s*relative/s);
  });

  it('keeps the spinner in flow with a loading label so the wider state sets the width', async () => {
    const el = await mount<DsButton>('<ds-button loading loading-label="Saving...">Save</ds-button>');

    expect(el.shadowRoot!.querySelector('.loading-overlay')).toBeNull();
    expect(el.shadowRoot!.querySelector('.labels .spinner')).not.toBeNull();
  });

  it('reserves the spinner while idle once loading-label is set', async () => {
    const el = await mount<DsButton>('<ds-button loading-label="Saving...">Save</ds-button>');
    const spinner = el.shadowRoot!.querySelector('.spinner') as SVGElement;

    expect(spinner).not.toBeNull();
    expect(spinner.classList.contains('is-hidden')).toBe(true);
  });

  it('swaps to the loading label and hides the idle twin from assistive tech', async () => {
    const el = await mount<DsButton>('<ds-button loading-label="Saving...">Save</ds-button>');
    const twins = () => Array.from(el.shadowRoot!.querySelectorAll('.labels .stack-item'));

    expect(twins()).toHaveLength(2);
    expect(twins()[1]!.getAttribute('aria-hidden')).toBe('true');
    expect(twins()[0]!.getAttribute('aria-hidden')).toBeNull();

    el.loading = true;
    await el.updateComplete;

    expect(twins()[0]!.getAttribute('aria-hidden')).toBe('true');
    expect(twins()[1]!.getAttribute('aria-hidden')).toBeNull();
    expect(twins()[1]!.textContent).toContain('Saving...');
  });

  it('renders bare slots when no loading affordance is in play', async () => {
    const el = await mount<DsButton>('<ds-button>Save</ds-button>');

    expect(el.shadowRoot!.querySelector('.stack')).toBeNull();
    expect(el.shadowRoot!.querySelector('.spinner')).toBeNull();
  });
});

describe('<ds-button href>', () => {
  it('renders an anchor instead of a button so a wrapper link is unnecessary', async () => {
    const el = await mount<DsButton>('<ds-button href="/login">Log in</ds-button>');
    const anchor = el.shadowRoot!.querySelector('a');

    expect(el.shadowRoot!.querySelector('button')).toBeNull();
    expect(anchor).not.toBeNull();
    expect(anchor!.getAttribute('href')).toBe('/login');
    expect(anchor!.getAttribute('part')).toBe('button');
    expect(anchor!.classList.contains('btn')).toBe(true);
  });

  it('exposes exactly one focusable element so the link is a single tab stop', async () => {
    const el = await mount<DsButton>('<ds-button href="/login">Log in</ds-button>');
    const focusable = el.shadowRoot!.querySelectorAll('a, button');

    expect(focusable).toHaveLength(1);
  });

  it('forwards target and rel', async () => {
    const el = await mount<DsButton>('<ds-button href="/x" target="_blank" rel="noopener">Go</ds-button>');
    const anchor = el.shadowRoot!.querySelector('a')!;

    expect(anchor.getAttribute('target')).toBe('_blank');
    expect(anchor.getAttribute('rel')).toBe('noopener');
  });

  it('focuses the anchor', async () => {
    const el = await mount<DsButton>('<ds-button href="/login">Log in</ds-button>');

    el.focus();

    expect(el.shadowRoot!.activeElement).toBe(el.shadowRoot!.querySelector('a'));
  });

  it('keeps the loading affordances a plain button has', async () => {
    const el = await mount<DsButton>('<ds-button href="/x" loading loading-label="Loading...">Go</ds-button>');

    expect(el.shadowRoot!.querySelector('a .labels')).not.toBeNull();
    expect(el.shadowRoot!.querySelector('a')!.getAttribute('aria-busy')).toBe('true');
  });

  it('marks a disabled link and swallows its activation', async () => {
    const el = await mount<DsButton>('<ds-button href="/x" disabled>Go</ds-button>');
    const anchor = el.shadowRoot!.querySelector('a')!;
    const clicked = vi.fn();
    el.addEventListener('ds-click', clicked);

    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    anchor.dispatchEvent(event);

    expect(anchor.getAttribute('aria-disabled')).toBe('true');
    expect(event.defaultPrevented).toBe(true);
    expect(clicked).not.toHaveBeenCalled();
  });

  it('never submits a surrounding form, even when type says submit', async () => {
    const el = await mount<DsButton>('<ds-form><ds-button href="/x" type="submit">Go</ds-button></ds-form>').then(
      (form) => form.querySelector('ds-button') as DsButton,
    );
    const submit = vi.fn((event: Event) => event.preventDefault());
    (el.closest('ds-form') as DsForm).shadowRoot!.querySelector('form')!.addEventListener('submit', submit);

    el.shadowRoot!.querySelector('a')!.click();

    expect(submit).not.toHaveBeenCalled();
  });
});

import { beforeEach, describe, expect, it } from 'vitest';
import type { DsToastStack, ToastPlacement } from './toast-stack.js';
import type { DsToast } from './toast.js';
import './define.js';
import { mount, mountWithProps, resetTestDom } from '../../test-utils/mount.js';

beforeEach(() => {
  resetTestDom();
});

function makeToast(): DsToast {
  return document.createElement('ds-toast') as DsToast;
}

describe('<ds-toast-stack>', () => {
  it('exposes role="region" with aria-label from `label`', async () => {
    const el = await mountWithProps<DsToastStack>('<ds-toast-stack></ds-toast-stack>', {
      label: 'Inbox',
    });
    expect(el.getAttribute('role')).toBe('region');
    expect(el.getAttribute('aria-label')).toBe('Inbox');
  });

  it('does NOT set aria-live on the host (each toast owns its live region)', async () => {
    const el = await mount<DsToastStack>('<ds-toast-stack></ds-toast-stack>');
    expect(el.hasAttribute('aria-live')).toBe(false);
  });

  it('reflects placement to attribute for each of the four corners', async () => {
    const placements: ToastPlacement[] = [
      'top-left',
      'top-right',
      'bottom-left',
      'bottom-right',
    ];
    for (const placement of placements) {
      const el = await mountWithProps<DsToastStack>('<ds-toast-stack></ds-toast-stack>', {
        placement,
      });
      expect(el.getAttribute('placement')).toBe(placement);
    }
  });

  it('renders default-slotted ds-toast children', async () => {
    const el = await mount<DsToastStack>(`
      <ds-toast-stack>
        <ds-toast>One</ds-toast>
        <ds-toast>Two</ds-toast>
      </ds-toast-stack>
    `);
    expect(el.querySelectorAll('ds-toast')).toHaveLength(2);
  });

  it('push() appends a toast and enforces `max`', async () => {
    const el = await mountWithProps<DsToastStack>('<ds-toast-stack></ds-toast-stack>', {
      max: 2,
    });
    const a = makeToast();
    const b = makeToast();
    const c = makeToast();
    el.push(a);
    el.push(b);
    expect(Array.from(el.children).filter((n) => n.tagName.toLowerCase() === 'ds-toast')).toHaveLength(2);

    const dismissals: string[] = [];
    a.addEventListener('ds-dismiss', () => dismissals.push('a'));
    el.push(c);
    expect(dismissals).toEqual(['a']);
    expect(Array.from(el.children).filter((n) => n.tagName.toLowerCase() === 'ds-toast')).toHaveLength(2);
  });
});

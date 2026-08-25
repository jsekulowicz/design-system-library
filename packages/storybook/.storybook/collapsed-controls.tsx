import { useLayoutEffect, useRef, type ComponentProps } from 'react';
import { Controls, useOf } from '@storybook/addon-docs/blocks';

interface ResolvedStoryMetadata {
  csfFile?: {
    meta?: {
      parameters?: {
        docs?: { collapsedObjectControls?: readonly string[] };
      };
    };
  };
}

type CollapsedControlsProps = Pick<ComponentProps<typeof Controls>, 'of'>;

function collapseNamedControls(root: HTMLElement, pendingNames: Set<string>): void {
  const buttons = root.querySelectorAll<HTMLButtonElement>('button[aria-expanded]');
  for (const button of buttons) {
    const name = button.textContent?.replace(/\s*:\s*$/, '').trim();
    if (!name || !pendingNames.has(name)) {
      continue;
    }
    if (button.getAttribute('aria-expanded') === 'true') {
      button.click();
    }
    pendingNames.delete(name);
  }
}

export function CollapsedControls(props: CollapsedControlsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const resolved = useOf('meta', ['meta']) as ResolvedStoryMetadata;
  const names = resolved.csfFile?.meta?.parameters?.docs?.collapsedObjectControls ?? [];
  const namesKey = names.join('\0');

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || names.length === 0) {
      return;
    }
    const pendingNames = new Set(names);
    const collapse = () => {
      collapseNamedControls(root, pendingNames);
      if (pendingNames.size === 0) {
        observer.disconnect();
      }
    };
    const observer = new MutationObserver(collapse);
    let observerTimeout: number | undefined;
    collapse();
    if (pendingNames.size > 0) {
      observer.observe(root, { childList: true, subtree: true });
      observerTimeout = window.setTimeout(() => observer.disconnect(), 2000);
    }
    return () => {
      observer.disconnect();
      window.clearTimeout(observerTimeout);
    };
  }, [namesKey]);

  return (
    <div ref={rootRef} data-ds-collapsed-controls={names.join(' ')}>
      <Controls {...props} />
    </div>
  );
}

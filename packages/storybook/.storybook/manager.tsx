import React from 'react';
import { addons, types, useGlobals } from '@storybook/manager-api';
import { IconButton } from '@storybook/components';

type ViewportKey = 'mobile' | 'tablet' | 'desktop';

type ViewportState = {
  value?: ViewportKey;
  isRotated?: boolean;
};

type ViewportPreset = {
  key: ViewportKey;
  title: string;
  icon: React.ReactNode;
};

function DevicePhoneMobileIcon(): React.ReactElement {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="7" y="2.75" width="10" height="18.5" rx="2.25" />
      <path d="M10 5.5h4" />
      <circle cx="12" cy="18.2" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

function DeviceTabletIcon(): React.ReactElement {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="5" y="3.25" width="14" height="17.5" rx="2.25" />
      <circle cx="12" cy="17.8" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ComputerDesktopIcon(): React.ReactElement {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M9 20h6m-4-4v4m10-4H3" />
    </svg>
  );
}

const VIEWPORTS: ViewportPreset[] = [
  { key: 'mobile', title: 'Phone', icon: <DevicePhoneMobileIcon /> },
  { key: 'tablet', title: 'Tablet', icon: <DeviceTabletIcon /> },
  { key: 'desktop', title: 'Computer', icon: <ComputerDesktopIcon /> },
];

const DOCS_RESULT_SELECTOR = '.search-result-item[data-id$="--docs"]';

function getLastPathSegment(value: string): string {
  const segments = value
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean);
  return segments.at(-1) ?? value.trim();
}

function getFriendlyDocsLabel(item: { id: string; name: string }, api: { getData: (id: string) => { title?: string } }): string {
  if (item.name !== 'Docs') {
    return item.name;
  }
  const title = api.getData(item.id)?.title;
  if (!title) {
    return item.name;
  }
  return getLastPathSegment(title);
}

function relabelSearchDocs(scope: ParentNode = document): void {
  const docsItems = scope.querySelectorAll<HTMLElement>(DOCS_RESULT_SELECTOR);
  for (const item of docsItems) {
    if (item.dataset['dsDocsRelabeled'] === 'true') {
      continue;
    }
    const nameCell = item.querySelector<HTMLElement>('.search-result-item--label > *:first-child');
    if (!nameCell || nameCell.textContent?.trim() !== 'Docs') {
      continue;
    }
    const pathSegments = item.querySelectorAll<HTMLElement>('.search-result-item--label > *:last-child span');
    const lastSegment = pathSegments.item(pathSegments.length - 1)?.textContent?.trim();
    if (!lastSegment) {
      continue;
    }
    nameCell.textContent = getLastPathSegment(lastSegment);
    item.dataset['dsDocsRelabeled'] = 'true';
  }
}

function setupSearchDocsRelabeling(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }
  let scheduled = false;
  function schedule(): void {
    if (scheduled) {
      return;
    }
    scheduled = true;
    window.requestAnimationFrame(() => {
      scheduled = false;
      relabelSearchDocs(document);
    });
  }
  function attachMenuObserver(): boolean {
    const menu = document.getElementById('storybook-explorer-menu');
    if (!menu) {
      return false;
    }
    const observer = new MutationObserver(() => schedule());
    observer.observe(menu, { childList: true, subtree: true });
    return true;
  }

  schedule();
  if (attachMenuObserver()) {
    return;
  }
  const bootstrapObserver = new MutationObserver(() => {
    if (attachMenuObserver()) {
      bootstrapObserver.disconnect();
      schedule();
    }
  });
  bootstrapObserver.observe(document.body, { childList: true, subtree: true });
}

addons.setConfig({
  sidebar: {
    renderLabel: (item, api) => getFriendlyDocsLabel(item, api),
  },
});
setupSearchDocsRelabeling();

function ViewportToolbar(): React.ReactElement {
  const [globals, updateGlobals] = useGlobals();
  const rawViewport = globals['viewport'];
  const viewport = typeof rawViewport === 'string'
    ? rawViewport
    : (rawViewport as ViewportState | undefined)?.value ?? 'desktop';

  function setViewport(value: ViewportKey): void {
    if (typeof rawViewport === 'string') {
      updateGlobals({
        viewport: value,
        viewportRotated: false,
      });
      return;
    }
    updateGlobals({
      viewport: {
        value,
        isRotated: false,
      },
    });
  }

  return (
    <div style={{ display: 'inline-flex', gap: 6, alignItems: 'center', marginRight: 8 }}>
      {VIEWPORTS.map((item) => (
        <IconButton
          key={item.key}
          title={item.title}
          active={viewport === item.key}
          onClick={() => setViewport(item.key)}
        >
          {item.icon}
        </IconButton>
      ))}
    </div>
  );
}

addons.register('ds/viewport-toolbar', () => {
  addons.add('ds/viewport-toolbar/tool', {
    title: 'Viewport',
    type: types.TOOL,
    match: ({ viewMode }) => viewMode === 'docs' || viewMode === 'story',
    render: () => <ViewportToolbar />,
  });
});

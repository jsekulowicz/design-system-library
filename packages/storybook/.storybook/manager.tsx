import React from 'react';
import { addons, types } from '@storybook/manager-api';
import { IconButton } from '@storybook/components';

type ViewportKey = 'mobile' | 'tablet' | 'desktop';
type ThemeKey = 'light' | 'dark';

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

const DS_THEME_CHANGED = 'ds/theme-changed';
const DS_VIEWPORT_CHANGED = 'ds/viewport-changed';
const THEME_STORAGE_KEY = 'ds-storybook-theme';
const VIEWPORT_STORAGE_KEY = 'ds-storybook-viewport';

function SunIcon(): React.ReactElement {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.2M12 19.3v2.2M4.7 4.7l1.6 1.6M17.7 17.7l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.7 19.3l1.6-1.6M17.7 6.3l1.6-1.6" />
    </svg>
  );
}

function MoonIcon(): React.ReactElement {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 12.8A8.8 8.8 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  );
}

function readStoredTheme(): ThemeKey {
  const value = window.localStorage.getItem(THEME_STORAGE_KEY);
  return value === 'dark' ? 'dark' : 'light';
}

function readStoredViewport(): ViewportKey {
  const value = window.localStorage.getItem(VIEWPORT_STORAGE_KEY);
  return value === 'mobile' || value === 'tablet' || value === 'desktop' ? value : 'desktop';
}

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

function ThemeToolbar(): React.ReactElement {
  const channel = addons.getChannel();
  const [theme, setTheme] = React.useState<ThemeKey>(() => readStoredTheme());

  React.useEffect(() => {
    document.documentElement.setAttribute('data-ds-theme', theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    channel.emit(DS_THEME_CHANGED, { theme });
  }, [channel, theme]);

  return (
    <div style={{ display: 'inline-flex', gap: 6, alignItems: 'center', marginRight: 8 }}>
      <IconButton title="Light theme" active={theme === 'light'} onClick={() => setTheme('light')}>
        <SunIcon />
      </IconButton>
      <IconButton title="Dark theme" active={theme === 'dark'} onClick={() => setTheme('dark')}>
        <MoonIcon />
      </IconButton>
    </div>
  );
}

function ViewportToolbar(): React.ReactElement {
  const channel = addons.getChannel();
  const [viewport, setViewportState] = React.useState<ViewportKey>(() => readStoredViewport());

  React.useEffect(() => {
    window.localStorage.setItem(VIEWPORT_STORAGE_KEY, viewport);
    channel.emit(DS_VIEWPORT_CHANGED, { viewport });
  }, [channel, viewport]);

  function updateViewport(value: ViewportKey): void {
    setViewportState(value);
  }

  return (
    <div style={{ display: 'inline-flex', gap: 6, alignItems: 'center', marginRight: 8 }}>
      {VIEWPORTS.map((item) => (
        <IconButton
          key={item.key}
          title={item.title}
          active={viewport === item.key}
          onClick={() => updateViewport(item.key)}
        >
          {item.icon}
        </IconButton>
      ))}
    </div>
  );
}

addons.register('ds/viewport-toolbar', () => {
  addons.add('ds/theme-toolbar/tool', {
    title: 'Theme',
    type: types.TOOL,
    match: ({ viewMode }) => viewMode === 'docs' || viewMode === 'story',
    render: () => <ThemeToolbar />,
  });
  addons.add('ds/viewport-toolbar/tool', {
    title: 'Viewport',
    type: types.TOOL,
    match: ({ viewMode }) => viewMode === 'docs' || viewMode === 'story',
    render: () => <ViewportToolbar />,
  });
});

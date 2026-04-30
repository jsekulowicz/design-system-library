import React, { useEffect } from 'react';
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

const VIEWPORT_SIZES: Record<ViewportKey, { width: string; height: string }> = {
  mobile: { width: '360px', height: '844px' },
  tablet: { width: '768px', height: '1024px' },
  desktop: { width: '1280px', height: '800px' },
};

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

  useEffect(() => {
    const size = VIEWPORT_SIZES[(viewport as ViewportKey) ?? 'desktop'];
    const styleId = 'ds-viewport-toolbar-style';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = `
      iframe[data-is-storybook="true"] {
        width: ${size.width} !important;
        height: ${size.height} !important;
      }
    `;
  }, [viewport]);

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

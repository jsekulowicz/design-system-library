import type { Page } from '@playwright/test';

export type ThemeName = 'light' | 'dark';
export type ViewportName = 'mobile' | 'tablet' | 'desktop';

export type VisualScenario = {
  name: string;
  storyId: string;
  selector?: string;
  themes?: ThemeName[];
  viewports?: ViewportName[];
  fullPage?: boolean;
  beforeCapture?: (page: Page) => Promise<void>;
};

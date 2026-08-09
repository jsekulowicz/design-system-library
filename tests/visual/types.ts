import type { Page } from '@playwright/test';

export type ThemeName = 'light' | 'dark';
export type ViewportName = 'mobile' | 'tablet' | 'desktop';

export interface VisualScenario {
  name: string;
  storyId: string;
  selector?: string;
  themes?: ThemeName[];
  viewports?: ViewportName[];
  viewportSize?: { width: number; height: number };
  fullPage?: boolean;
  beforeCapture?: (page: Page) => Promise<void>;
}

import type { ViewportName } from './types.js';

export const visualViewports: Record<ViewportName, { width: number; height: number }> = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 900 },
  desktop: { width: 1280, height: 900 },
};

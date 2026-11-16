import type { Page } from '@playwright/test';
import type { ThemeName, ViewportName, VisualScenario } from './types.js';

const themes: ThemeName[] = ['light', 'dark'];
const desktop: ViewportName[] = ['desktop'];
const responsive: ViewportName[] = ['mobile', 'tablet', 'desktop'];
const storyRoot = '#storybook-root';

export const visualScenarios: VisualScenario[] = [
  buildStaticStory('button-variants', 'actions-button--variants'),
  buildStaticStory('button-colors', 'actions-button--colors'),
  buildStaticStory('button-sizes', 'actions-button--sizes'),
  buildStaticStory('card-playground', 'data-display-card--playground'),
  buildResponsiveStory('table-basic', 'data-display-table--basic'),
  buildResponsiveStory('scrollable-page', 'layout-scrollablepage--with-non-scrolling-header'),
  buildStaticStory('textfield-states', 'forms-textfield--required'),
  buildStaticStory('select-invalid', 'forms-select--invalid'),
  {
    name: 'select-leading-icon-open',
    storyId: 'forms-select--with-description',
    themes,
    viewports: desktop,
    viewportSize: { width: 1280, height: 315 },
    beforeCapture: openSelect,
  },
  {
    name: 'select-selected-icon-open',
    storyId: 'forms-select--preselected',
    themes,
    viewports: desktop,
    viewportSize: { width: 1280, height: 315 },
    beforeCapture: openSelect,
  },
  buildStaticStory('select-multiple-icons', 'forms-select--multiple-with-icons'),
  {
    name: 'select-multiple-selected',
    storyId: 'forms-select--multiple',
    themes,
    viewports: desktop,
    beforeCapture: selectFirstMultipleOption,
  },
  buildStaticStory('pie-chart', 'data-display-piechart--playground'),
  buildStaticStory('pie-chart-donut', 'data-display-piechart--donut'),
  buildStaticStory('pie-chart-formatters', 'data-display-piechart--with-formatters'),
  buildStaticStory('bar-chart-formatters', 'data-display-barchart--with-formatters'),
  buildStaticStory('divider-inline', 'data-display-divider--inline-with-text'),
  buildStaticStory('menu-header-footer', 'navigation-menu--with-header-footer'),
  buildStaticStory('toast-tones', 'feedback-toast--tones'),
  buildStaticStory('segmented-control-icons', 'forms-segmentedcontrol--with-icons'),
  buildResponsiveStory('tooltip-viewport-constraint', 'overlays-tooltip--viewport-constraint'),
  {
    name: 'searchable-select-multiple-selected',
    storyId: 'forms-searchableselect--multiple-countries',
    themes,
    viewports: desktop,
    beforeCapture: selectFirstMultipleOption,
  },
  {
    name: 'sidenav-collapsed',
    storyId: 'navigation-sidenav--collapse-toggle',
    themes,
    viewports: desktop,
    beforeCapture: collapseSidenav,
  },
  {
    name: 'searchable-select-open',
    storyId: 'forms-searchableselect--countries',
    themes,
    viewports: desktop,
    beforeCapture: openSearchableSelect,
  },
  {
    name: 'menu-button-open',
    storyId: 'navigation-menubutton--playground',
    themes,
    viewports: desktop,
    beforeCapture: openMenuButton,
  },
  {
    name: 'dialog-open',
    storyId: 'overlays-dialog--playground',
    themes,
    viewports: responsive,
    beforeCapture: openDialog,
  },
  {
    name: 'color-picker-open',
    storyId: 'forms-colorpicker--playground',
    themes,
    viewports: desktop,
    beforeCapture: openColorPicker,
  },
  {
    name: 'form-invalid',
    storyId: 'forms-form--account-details',
    themes,
    viewports: responsive,
    beforeCapture: submitInvalidForm,
  },
  buildResponsiveStory('top-bar-responsive', 'navigation-topbar--with-profile-menu'),
  buildResponsiveStory('settings-page-with-sidenav', 'patterns-settingspage--page-with-sidenav'),
  buildResponsiveStory('settings-page-without-sidenav', 'patterns-settingspage--page-without-sidenav'),
];

function buildStaticStory(name: string, storyId: string): VisualScenario {
  return { name, storyId, selector: storyRoot, themes, viewports: desktop };
}

function buildResponsiveStory(name: string, storyId: string): VisualScenario {
  return { name, storyId, themes, viewports: responsive };
}

async function openSelect(page: Page): Promise<void> {
  await page.getByRole('combobox', { name: 'Discipline' }).click();
  await page.getByRole('option', { name: 'Design' }).waitFor();
}

async function selectFirstMultipleOption(page: Page): Promise<void> {
  await page.getByRole('combobox').click();
  await page.getByRole('option').first().click();
}

async function collapseSidenav(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Collapse navigation' }).click();
  await page.locator('ds-sidenav[collapsed]').waitFor();
}

async function openSearchableSelect(page: Page): Promise<void> {
  await page.getByRole('combobox', { name: 'Country' }).click();
  await page.getByRole('option', { name: /Afghanistan/ }).waitFor();
}

async function openMenuButton(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Edit' }).click();
  await page.getByRole('menuitem', { name: 'Duplicate' }).waitFor();
}

async function openDialog(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Open dialog' }).click();
  await page.getByRole('dialog', { name: 'Confirm action' }).waitFor();
}

async function openColorPicker(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Accent color' }).click();
  await page.getByRole('dialog', { name: 'Accent color' }).waitFor();
}

async function submitInvalidForm(page: Page): Promise<void> {
  await page.locator('ds-button[type="submit"]').click();
  await page.locator('ds-text-field[invalid]').first().waitFor();
}

import type { Page } from '@playwright/test';
import type { ThemeName, ViewportName, VisualScenario } from './types.js';

const themes: ThemeName[] = ['light', 'dark'];
const desktop: ViewportName[] = ['desktop'];
const responsive: ViewportName[] = ['mobile', 'tablet', 'desktop'];
const storyRoot = '#storybook-root';

export const visualScenarios: VisualScenario[] = [
  staticStory('button-variants', 'atoms-button--variants'),
  staticStory('button-colors', 'atoms-button--colors'),
  staticStory('button-sizes', 'atoms-button--sizes'),
  staticStory('card-playground', 'molecules-card--playground'),
  responsiveStory('table-basic', 'atoms-table--basic'),
  responsiveStory('scrollable-page', 'templates-scrollablepage--with-non-scrolling-header'),
  staticStory('textfield-states', 'atoms-textfield--required'),
  staticStory('select-invalid', 'atoms-select--invalid'),
  {
    name: 'select-leading-icon-open',
    storyId: 'atoms-select--with-description',
    themes,
    viewports: desktop,
    viewportSize: { width: 1280, height: 315 },
    beforeCapture: openSelect,
  },
  {
    name: 'select-selected-icon-open',
    storyId: 'atoms-select--preselected',
    themes,
    viewports: desktop,
    viewportSize: { width: 1280, height: 315 },
    beforeCapture: openSelect,
  },
  staticStory('select-multiple-icons', 'atoms-select--multiple-with-icons'),
  {
    name: 'select-multiple-selected',
    storyId: 'atoms-select--multiple',
    themes,
    viewports: desktop,
    beforeCapture: selectFirstMultipleOption,
  },
  staticStory('pie-chart', 'molecules-piechart--playground'),
  staticStory('pie-chart-donut', 'molecules-piechart--donut'),
  staticStory('pie-chart-formatters', 'molecules-piechart--with-formatters'),
  staticStory('bar-chart-formatters', 'molecules-barchart--with-formatters'),
  staticStory('divider-inline', 'atoms-divider--inline-with-text'),
  staticStory('menu-header-footer', 'atoms-menu--with-header-footer'),
  staticStory('segmented-control-icons', 'atoms-segmentedcontrol--with-icons'),
  responsiveStory('tooltip-viewport-constraint', 'atoms-tooltip--viewport-constraint'),
  {
    name: 'searchable-select-multiple-selected',
    storyId: 'atoms-searchableselect--multiple-countries',
    themes,
    viewports: desktop,
    beforeCapture: selectFirstMultipleOption,
  },
  {
    name: 'sidenav-collapsed',
    storyId: 'organisms-sidenav--collapse-toggle',
    themes,
    viewports: desktop,
    beforeCapture: collapseSidenav,
  },
  {
    name: 'searchable-select-open',
    storyId: 'atoms-searchableselect--countries',
    themes,
    viewports: desktop,
    beforeCapture: openSearchableSelect,
  },
  {
    name: 'menu-button-open',
    storyId: 'molecules-menubutton--playground',
    themes,
    viewports: desktop,
    beforeCapture: openMenuButton,
  },
  {
    name: 'dialog-open',
    storyId: 'molecules-dialog--playground',
    themes,
    viewports: responsive,
    beforeCapture: openDialog,
  },
  {
    name: 'color-picker-open',
    storyId: 'molecules-colorpicker--playground',
    themes,
    viewports: desktop,
    beforeCapture: openColorPicker,
  },
  {
    name: 'form-invalid',
    storyId: 'organisms-form--account-details',
    themes,
    viewports: responsive,
    beforeCapture: submitInvalidForm,
  },
  responsiveStory('top-bar-responsive', 'organisms-topbar--with-profile-menu'),
  responsiveStory('settings-page-with-sidenav', 'pages-settingspage--page-with-sidenav'),
  responsiveStory('settings-page-without-sidenav', 'pages-settingspage--page-without-sidenav'),
];

function staticStory(name: string, storyId: string): VisualScenario {
  return { name, storyId, selector: storyRoot, themes, viewports: desktop };
}

function responsiveStory(name: string, storyId: string): VisualScenario {
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

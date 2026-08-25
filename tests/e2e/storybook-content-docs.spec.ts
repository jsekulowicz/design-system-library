import { expect, test, type Page } from '@playwright/test';

async function openDocs(page: Page, id: string): Promise<void> {
  await page.goto(`/iframe.html?id=${id}&viewMode=docs`);
  await page.locator('.sbdocs-content').waitFor();
}

test('Introduction provides a complete install and registration path', async ({ page }) => {
  await openDocs(page, 'introduction--docs');

  await expect(page.getByText('pnpm add @jsekulowicz/ds-tokens @jsekulowicz/ds-components')).toBeVisible();
  await expect(page.getByText('npm install @jsekulowicz/ds-tokens @jsekulowicz/ds-components')).toBeVisible();
  await expect(page.getByText("import '@jsekulowicz/ds-tokens/theme-default.css';")).toBeVisible();
  await expect(page.getByText(/ds-tokens\/dist\/theme-default\.css/)).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'GitHub repository' })).toHaveAttribute(
    'href',
    'https://github.com/jsekulowicz/design-system-library',
  );
});

test('Framework usage documents build-time Vue setup and React installation', async ({ page }) => {
  await openDocs(page, 'framework-usage--docs');

  await expect(page.getByText('pnpm add @jsekulowicz/ds-react')).toBeVisible();
  await expect(page.getByText("isCustomElement: (tag) => tag.startsWith('ds-'),")).toBeVisible();
  await expect(page.getByText(/app\.config\.compilerOptions\.isCustomElement/)).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Angular standalone component' })).toBeVisible();
  await expect(page.getByText(/stacked="false" still enables it/)).toBeVisible();
});

test('component docs combine interactive controls with complete property metadata', async ({ page }) => {
  await openDocs(page, 'atoms-button--docs');

  await expect(page.getByText("import '@jsekulowicz/ds-components/button/define';")).toBeVisible();
  await expect(page.locator('.ds-properties-table')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Playground controls' })).toHaveCount(0);

  const propsHeading = page.getByRole('heading', { name: 'Props' });
  const propsTable = propsHeading.locator('xpath=following::table[1]');
  await expect(propsHeading).toBeVisible();
  await expect(
    propsTable.getByRole('row', { name: /variant.*'primary'.*'secondary'.*'ghost'.*'primary'/ }),
  ).toBeVisible();
  await expect(
    propsTable.getByRole('row', { name: /loadingLabel.*Label shown while loading.*string.*undefined/ }),
  ).toBeVisible();
  await expect(propsTable.getByRole('row', { name: /fullWidth.*boolean.*false/ })).toBeVisible();
  await expect(propsHeading).toHaveJSProperty('tagName', 'H3');

  const propsPrecedesImport = await propsHeading.evaluate((heading) =>
    Boolean(
      heading.compareDocumentPosition(document.querySelector('.ds-component-import')!) &
      Node.DOCUMENT_POSITION_FOLLOWING,
    ),
  );
  expect(propsPrecedesImport).toBe(true);

  await propsTable.getByRole('radio', { name: 'secondary' }).check();
  await expect(page.locator('ds-button').filter({ hasText: 'Ship it' }).first()).toHaveAttribute(
    'variant',
    'secondary',
  );
});

for (const [name, id, tag] of [
  ['BarChart', 'molecules-barchart--docs', 'ds-bar-chart'],
  ['PieChart', 'molecules-piechart--docs', 'ds-pie-chart'],
  ['HeatmapCalendar', 'molecules-heatmapcalendar--docs', 'ds-heatmap-calendar'],
] as const) {
  test(`${name} Props update its primary example`, async ({ page }) => {
    await openDocs(page, id);
    const propsTable = page.getByRole('heading', { name: 'Props' }).locator('xpath=following::table[1]');
    const titleControl = propsTable
      .getByRole('cell', { name: 'title', exact: true })
      .locator('xpath=..')
      .getByRole('textbox');
    const updatedTitle = `${name} controlled title`;

    await titleControl.fill(updatedTitle);
    await expect(page.locator(tag).first()).toHaveJSProperty('title', updatedTitle);
  });
}

test('Tooltip Props update its primary example', async ({ page }) => {
  await openDocs(page, 'atoms-tooltip--docs');
  const propsTable = page.getByRole('heading', { name: 'Props' }).locator('xpath=following::table[1]');

  await propsTable.getByRole('radio', { name: 'right' }).check();
  await expect(page.locator('ds-tooltip').first()).toHaveJSProperty('placement', 'right');
});

test('documentation source links resolve to the repository', async ({ page }) => {
  await openDocs(page, 'foundations-spacing--docs');

  await expect(page.getByRole('link', { name: 'packages/tokens/src/primitive/spacing.test.ts' })).toHaveAttribute(
    'href',
    'https://github.com/jsekulowicz/design-system-library/blob/main/packages/tokens/src/primitive/spacing.test.ts',
  );
});

test('component documentation does not nest paragraphs', async ({ page }) => {
  for (const id of [
    'atoms-button--docs',
    'atoms-checkboxgroup--docs',
    'atoms-progress-bar--docs',
    'atoms-radiogroup--docs',
    'molecules-toast--docs',
  ]) {
    await openDocs(page, id);
    await expect(page.locator('p p')).toHaveCount(0);
  }
});

test('compact Storybook navigation does not repeat the active docs label', async ({ page }) => {
  await page.setViewportSize({ width: 480, height: 900 });
  await page.goto('/?path=/docs/atoms-button--docs');

  await expect(page.getByRole('button', { name: 'Open navigation menu' })).toHaveText('Atoms/Button');
});

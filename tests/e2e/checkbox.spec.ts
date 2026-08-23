import { test, expect, type Page } from '@playwright/test';

const storyUrl = '/iframe.html?id=atoms-checkbox--states&viewMode=story';

// A ds-checkbox is an inline-level box, so it sits on a line box in its parent.
// If its own box is shorter than the text it renders, that line box ends up
// taller than the host and the difference reads as content to scroll - which
// makes a ds-dialog body paint a scroll fade over content that fits.
test.describe('ds-checkbox line box', () => {
  test('adds no height beyond its own box to the line it sits on', async ({ page }) => {
    await page.goto(storyUrl);
    await mountProbes(page);

    const probe = await page.evaluate(() => {
      const row = document.getElementById('tight-row') as HTMLElement;
      const checkbox = row.firstElementChild as HTMLElement;
      return {
        rowHeight: row.getBoundingClientRect().height,
        hostHeight: checkbox.getBoundingClientRect().height,
        overflow: row.scrollHeight - Math.round(checkbox.getBoundingClientRect().height),
      };
    });

    expect(probe.hostHeight).toBeGreaterThan(0);
    expect(probe.rowHeight).toBeCloseTo(probe.hostHeight, 1);
    expect(probe.overflow).toBe(0);
  });

  test('takes no more room on a text line than a word does', async ({ page }) => {
    await page.goto(storyUrl);
    await mountProbes(page);

    const probe = await page.evaluate(() => ({
      checkboxRow: document.getElementById('text-row')!.getBoundingClientRect().height,
      textRow: document.getElementById('plain-row')!.getBoundingClientRect().height,
    }));

    expect(probe.checkboxRow).toBeCloseTo(probe.textRow, 1);
  });

  test('keeps its box on the first line of a wrapping label', async ({ page }) => {
    await page.goto(storyUrl);
    await mountProbes(page);

    const probe = await page.evaluate(() => {
      const row = document.getElementById('wrapping-row') as HTMLElement;
      const checkbox = row.firstElementChild as HTMLElement;
      const shadow = checkbox.shadowRoot!;
      const box = shadow.querySelector('.control')!.getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(checkbox);
      const lineRects = [...range.getClientRects()].filter((rect) => rect.height > 0);
      const firstLine = lineRects[0]!;
      return {
        lines: lineRects.length,
        boxCenter: box.top + box.height / 2,
        firstLineCenter: firstLine.top + firstLine.height / 2,
        hostCenter: checkbox.getBoundingClientRect().height / 2 + checkbox.getBoundingClientRect().top,
      };
    });

    expect(probe.lines).toBeGreaterThan(1);
    expect(probe.boxCenter).toBeCloseTo(probe.firstLineCenter, 0);
    expect(Math.abs(probe.boxCenter - probe.hostCenter)).toBeGreaterThan(2);
  });
});

// Two block parents: one whose strut is shorter than the checkbox (line-height
// 1) and one with the default text line box, plus a text-only reference row.
async function mountProbes(page: Page): Promise<void> {
  await page.locator('ds-checkbox').first().waitFor();
  await page.evaluate(async () => {
    const rows: Record<string, string> = {
      'tight-row': 'line-height: 1',
      'text-row': 'line-height: normal',
    };
    for (const [id, style] of Object.entries(rows)) {
      const row = document.createElement('div');
      row.id = id;
      row.setAttribute('style', `width: 320px; ${style}`);
      row.innerHTML = '<ds-checkbox>Include a copy</ds-checkbox>';
      document.body.append(row);
    }
    const wrapping = document.createElement('div');
    wrapping.id = 'wrapping-row';
    wrapping.setAttribute('style', 'width: 220px');
    wrapping.innerHTML =
      '<ds-checkbox>I agree with the Terms and Conditions and the Privacy Policy of this service</ds-checkbox>';
    document.body.append(wrapping);

    const plain = document.createElement('div');
    plain.id = 'plain-row';
    plain.setAttribute('style', 'width: 320px; line-height: normal');
    plain.textContent = 'Include a copy';
    document.body.append(plain);

    await customElements.whenDefined('ds-checkbox');
    const pending = [...document.querySelectorAll('ds-checkbox')].map(
      (el) => (el as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete,
    );
    await Promise.all(pending);
    await document.fonts.ready;
  });
}

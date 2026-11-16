import { beforeEach, describe, expect, it } from 'vitest';
import { mountWithProps, resetTestDom } from '../../test-utils/mount.js';
import type { DsHeatmapCalendar } from './heatmap-calendar.js';
import type { HeatmapDay } from './types.js';
import './define.js';

beforeEach(() => resetTestDom());

const DAYS_WITH_DETAILS: HeatmapDay[] = [
  {
    date: '2026-07-13',
    value: 6,
    details: [
      { label: 'Morning', value: '3 of 4' },
      { label: 'Evening', value: '1 of 2' },
    ],
  },
];

async function mountCalendar(data: readonly HeatmapDay[]): Promise<DsHeatmapCalendar> {
  return mountWithProps<DsHeatmapCalendar>('<ds-heatmap-calendar></ds-heatmap-calendar>', {
    locale: 'en-US',
    endDate: '2026-07-13',
    months: 1,
    data,
  });
}

async function openLastDay(data: readonly HeatmapDay[]): Promise<DsHeatmapCalendar> {
  const element = await mountCalendar(data);
  element
    .shadowRoot!.querySelector('.frame')!
    .dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
  await element.updateComplete;
  return element;
}

describe('<ds-heatmap-calendar> day details', () => {
  it('shows the date above the value in the tooltip', async () => {
    const element = await openLastDay([{ date: '2026-07-13', value: 4 }]);
    const tooltip = element.shadowRoot!.querySelector('.point-tooltip')!;

    expect([...tooltip.children].map((child) => child.className)).toEqual(['tooltip-date', 'tooltip-title']);
  });

  it('lists the details of the active day under its value', async () => {
    const element = await openLastDay(DAYS_WITH_DETAILS);
    const details = element.shadowRoot!.querySelector('.point-tooltip .tooltip-details')!;

    expect([...details.querySelectorAll('dt')].map((term) => term.textContent)).toEqual(['Morning', 'Evening']);
    expect([...details.querySelectorAll('dd')].map((value) => value.textContent)).toEqual(['3 of 4', '1 of 2']);
  });

  it('reads the details of a day after its value', async () => {
    const element = await mountCalendar(DAYS_WITH_DETAILS);
    const lastCell = [...element.shadowRoot!.querySelectorAll('rect.cell')].at(-1)!;

    expect(lastCell.getAttribute('aria-label')).toBe('Jul 13, 2026: 6, Morning: 3 of 4, Evening: 1 of 2');
  });

  it('gives every detail a column in the hidden data table', async () => {
    const element = await mountCalendar(DAYS_WITH_DETAILS);
    const table = element.shadowRoot!.querySelector('.visually-hidden table')!;
    const lastRow = [...table.querySelectorAll('tbody tr')].at(-1)!;

    expect([...table.querySelectorAll('thead th')].map((header) => header.textContent)).toEqual([
      'Date',
      'Value',
      'Morning',
      'Evening',
    ]);
    expect([...lastRow.querySelectorAll('td')].map((cell) => cell.textContent)).toEqual(['6', '3 of 4', '1 of 2']);
  });

  it('passes the details of the active day on with its focus event', async () => {
    const element = await mountCalendar(DAYS_WITH_DETAILS);
    const events: CustomEvent[] = [];
    element.addEventListener('ds-heatmap-focus', (event) => events.push(event as CustomEvent));
    element
      .shadowRoot!.querySelector('.frame')!
      .dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));

    expect(events.at(-1)?.detail).toEqual({ ...DAYS_WITH_DETAILS[0], level: 4 });
  });
});

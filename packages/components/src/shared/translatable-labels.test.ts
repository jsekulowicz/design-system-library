import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { html, render } from 'lit';
import { mount, mountWithProps, resetTestDom } from '../test-utils/mount.js';
import { renderClearButton, renderOverflowTile, renderSelectedTiles } from '../forms/select/select.shared.js';
import '../overlays/dialog/define.js';
import '../overlays/drawer/define.js';
import '../feedback/alert/define.js';
import '../feedback/toast/define.js';
import '../forms/select/define.js';
import '../forms/searchable-select/define.js';
import '../forms/color-picker/define.js';
import '../data-display/table/define.js';
import '../data-display/pie-chart/define.js';
import '../data-display/bar-chart/define.js';
import '../data-display/heatmap-calendar/define.js';
import '../patterns/settings-page/define.js';

// jsdom implements neither, and both dialogs open a modal to render their close button.
beforeAll(() => {
  const proto = HTMLDialogElement.prototype as unknown as {
    showModal?: () => void;
    close?: () => void;
  };
  proto.showModal ??= function showModal(this: HTMLDialogElement) {
    this.setAttribute('open', '');
  };
  proto.close ??= function close(this: HTMLDialogElement) {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  };
});

beforeEach(() => {
  resetTestDom();
});

type Modal = HTMLElement & { updateComplete: Promise<unknown> };

function labelOf(el: HTMLElement, selector: string): string | null {
  return el.shadowRoot!.querySelector(selector)?.getAttribute('label') ?? null;
}

function ariaOf(el: HTMLElement, selector: string): string | null {
  return el.shadowRoot!.querySelector(selector)?.getAttribute('aria-label') ?? null;
}

describe('every component names its own controls in the consumer language', () => {
  it('names the dialog close button', async () => {
    const el = await mountWithProps<Modal>('<ds-dialog open>x</ds-dialog>', {
      closeLabel: 'Cerrar',
    });
    await el.updateComplete;
    expect(labelOf(el, '[part~="close-button"]')).toBe('Cerrar');
  });

  it('names the drawer close button', async () => {
    const el = await mountWithProps<Modal>('<ds-drawer open>x</ds-drawer>', {
      closeLabel: 'Cerrar',
    });
    await el.updateComplete;
    expect(labelOf(el, '[part~="close-button"]')).toBe('Cerrar');
  });

  it('names the alert dismiss button', async () => {
    const el = await mountWithProps<HTMLElement>('<ds-alert dismissible>x</ds-alert>', {
      dismissLabel: 'Descartar',
    });
    expect(labelOf(el, '[part~="close-button"]')).toBe('Descartar');
  });

  it('names the toast dismiss button', async () => {
    const el = await mountWithProps<HTMLElement>('<ds-toast>x</ds-toast>', {
      dismissLabel: 'Descartar',
    });
    expect(labelOf(el, '[part~="close-button"]')).toBe('Descartar');
  });

  it('names the settings page section nav', async () => {
    const el = await mountWithProps<HTMLElement>('<ds-settings-page></ds-settings-page>', {
      sections: [{ id: 'a', label: 'A' }],
      sectionsLabel: 'Secciones',
    });
    expect(ariaOf(el, 'nav')).toBe('Secciones');
  });

  it('names the table sort button and its direction suffix', async () => {
    const el = await mountWithProps<HTMLElement>('<ds-table-sort-button></ds-table-sort-button>', {
      column: 'Palabra',
      direction: 'asc',
      sortByLabel: 'Ordenar por {column}',
      ascendingLabel: '{name} (ascendente)',
    });
    expect(ariaOf(el, 'button')).toBe('Ordenar por Palabra (ascendente)');
  });

  it('names the pie chart root', async () => {
    const el = await mountWithProps<HTMLElement>('<ds-pie-chart></ds-pie-chart>', {
      data: [{ label: 'a', value: 1 }],
      chartLabel: 'Gráfico circular',
    });
    expect(el.shadowRoot!.innerHTML).toContain('Gráfico circular');
  });

  it('names the bar chart root', async () => {
    const el = await mountWithProps<HTMLElement>('<ds-bar-chart></ds-bar-chart>', {
      data: [{ domain: 'a', value: 1 }],
      series: [{ key: 'value', label: 'v' }],
      chartLabel: 'Gráfico de barras',
    });
    expect(el.shadowRoot!.innerHTML).toContain('Gráfico de barras');
  });

  it('names the heatmap legend and labels both of its ends', async () => {
    const el = await mountWithProps<HTMLElement>('<ds-heatmap-calendar></ds-heatmap-calendar>', {
      data: [{ date: '2026-01-01', value: 1 }],
      legendLabel: 'Intensidad',
      legendLessLabel: 'Menos',
      legendMoreLabel: 'Más',
    });
    const html = el.shadowRoot!.innerHTML;
    expect(html).toContain('Intensidad');
    expect(html).toContain('Menos');
    expect(html).toContain('Más');
  });

  it('names the color picker panel once it is open', async () => {
    const el = await mountWithProps<HTMLElement & { updateComplete: Promise<unknown> }>(
      '<ds-color-picker></ds-color-picker>',
      { colors: [{ value: '#fff', label: 'White' }], pickerLabel: 'Selector de color' },
    );
    const trigger = el.shadowRoot!.querySelector('#trigger');
    trigger?.shadowRoot?.querySelector('button')?.click();
    await el.updateComplete;
    expect(ariaOf(el, '[part~="panel"]')).toBe('Selector de color');
  });

  // The select's controls are shared render helpers, and only some of them are
  // on screen at once; rendering them directly covers every label at once.
  it('names the select clear, remove and overflow controls', () => {
    const host = document.createElement('div');
    document.body.append(host);
    render(
      html`${renderClearButton(
        () => {},
        () => {},
        'Borrar selección',
      )}
      ${renderOverflowTile(2, '{count} más seleccionados')}
      ${renderSelectedTiles({
        values: ['a'],
        focusedTileIndex: -1,
        overflowCount: 0,
        labelFor: () => 'A',
        onRemove: () => {},
        removeLabel: 'Quitar {label}',
      })}`,
      host,
    );
    expect(host.querySelector('.clear-btn')?.getAttribute('aria-label')).toBe('Borrar selección');
    expect(host.querySelector('.tile-overflow')?.getAttribute('aria-label')).toBe('2 más seleccionados');
    expect(host.querySelector('.tile-remove')?.getAttribute('aria-label')).toBe('Quitar A');
  });

  it('writes the pie chart empty state in the consumer language', async () => {
    const el = await mountWithProps<HTMLElement>('<ds-pie-chart></ds-pie-chart>', {
      data: [],
      emptyLabel: 'Sin datos',
      categoryHeader: 'Categoría',
    });
    expect(el.shadowRoot!.innerHTML).toContain('Sin datos');
  });

  it('writes the bar chart total header in the consumer language', async () => {
    const el = await mountWithProps<HTMLElement>('<ds-bar-chart stacked></ds-bar-chart>', {
      data: [{ domain: 'a', value: 1 }],
      series: [{ key: 'value', label: 'v' }],
      totalHeader: 'Suma',
    });
    expect(el.shadowRoot!.innerHTML).toContain('Suma');
  });

  it('writes the heatmap table headers in the consumer language', async () => {
    const el = await mountWithProps<HTMLElement>('<ds-heatmap-calendar></ds-heatmap-calendar>', {
      data: [{ date: '2026-01-01', value: 1 }],
      dateHeader: 'Fecha',
      valueHeader: 'Valor',
    });
    const html = el.shadowRoot!.innerHTML;
    expect(html).toContain('Fecha');
    expect(html).toContain('Valor');
  });

  it('writes the color picker panel buttons in the consumer language', async () => {
    const el = await mountWithProps<HTMLElement & { updateComplete: Promise<unknown> }>(
      '<ds-color-picker clearable></ds-color-picker>',
      {
        colors: [{ value: '#fff', label: 'White' }],
        clearLabel: 'Borrar',
        doneLabel: 'Hecho',
        customLabel: 'Color personalizado',
      },
    );
    el.shadowRoot!.querySelector('#trigger')?.shadowRoot?.querySelector('button')?.click();
    await el.updateComplete;
    const html = el.shadowRoot!.innerHTML;
    expect(html).toContain('Hecho');
    expect(html).toContain('Color personalizado');
  });

  it('announces each chart role description in the consumer language', async () => {
    const pie = await mountWithProps<HTMLElement>('<ds-pie-chart></ds-pie-chart>', {
      data: [{ label: 'a', value: 1 }],
      roleDescription: 'gráfico circular',
    });
    const bar = await mountWithProps<HTMLElement>('<ds-bar-chart></ds-bar-chart>', {
      data: [{ domain: 'a', value: 1 }],
      series: [{ key: 'value', label: 'v' }],
      roleDescription: 'gráfico de barras',
    });
    const heatmap = await mountWithProps<HTMLElement>('<ds-heatmap-calendar></ds-heatmap-calendar>', {
      data: [{ date: '2026-01-01', value: 1 }],
      roleDescription: 'calendario de actividad',
    });
    expect(pie.shadowRoot!.querySelector('svg')?.getAttribute('aria-roledescription')).toBe('gráfico circular');
    expect(bar.shadowRoot!.querySelector('svg')?.getAttribute('aria-roledescription')).toBe('gráfico de barras');
    expect(heatmap.shadowRoot!.querySelector('svg')?.getAttribute('aria-roledescription')).toBe(
      'calendario de actividad',
    );
  });

  it('keeps English when a consumer sets nothing', async () => {
    const el = await mount<Modal>('<ds-dialog open>x</ds-dialog>');
    await el.updateComplete;
    expect(labelOf(el, '[part~="close-button"]')).toBe('Close');
  });
});

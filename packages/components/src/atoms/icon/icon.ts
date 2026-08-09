import { html, svg, type TemplateResult, type SVGTemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { DsElement } from '@jsekulowicz/ds-core';
import { iconStyles } from './icon.styles.js';

export type IconSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

// Anchored on globalThis: Vite's dep pre-bundling can evaluate this module twice,
// and a per-module Map would split registrations from the reads.
const REGISTRY_KEY = Symbol.for('@jsekulowicz/ds-components:icon-registry');
interface RegistryHost {
  [REGISTRY_KEY]?: Map<string, string>;
}
const host = globalThis as unknown as RegistryHost;
const registry: Map<string, string> = (host[REGISTRY_KEY] ??= new Map<string, string>());

export function registerIcon(name: string, svgMarkup: string): void {
  registry.set(name, svgMarkup);
}

export function getIcon(name: string): string | undefined {
  return registry.get(name);
}

/**
 * @tag ds-icon
 * @summary Decorative or meaningful icon rendered from a registered SVG.
 * @slot default - Inline SVG content (alternative to `name`).
 */
export class DsIcon extends DsElement {
  static override styles = [...DsElement.styles, iconStyles];

  @property() name?: string;
  @property() label?: string;
  @property({ reflect: true }) size: IconSize = 'lg';
  @state() private _svg: SVGTemplateResult | null = null;

  override willUpdate(): void {
    if (!this.name) {
      this._svg = null;
      return;
    }
    const markup = registry.get(this.name);
    if (!markup) {
      this._svg = null;
      console.warn(`<ds-icon>: unknown icon "${this.name}"`);
      return;
    }
    this._svg = svg`${unsafeSVG(markup)}`;
  }

  override render(): TemplateResult {
    const ariaHidden = this.label ? 'false' : 'true';
    const role: 'img' | undefined = this.label ? 'img' : undefined;
    return html`<span role=${ifDefined(role)} aria-hidden=${ariaHidden} aria-label=${ifDefined(this.label)}>
      ${this._svg ? this._svg : html`<slot></slot>`}
    </span>`;
  }
}

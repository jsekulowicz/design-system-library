import { html, svg, type TemplateResult, type SVGTemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { DsElement } from '@jsekulowicz/ds-core';
import { iconStyles } from './icon.styles.js';

export type IconSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

// The registry must be a single instance shared across every copy of this
// module. Bundlers (notably Vite's dep pre-bundling during dev) can evaluate
// this file more than once, and a per-module `new Map()` would let icon
// registrations land in one copy while <ds-icon> reads another — surfacing as
// `unknown icon "…"` warnings and blank icons. Anchoring it on globalThis with
// a Symbol.for key guarantees one registry regardless of how many times the
// module is instantiated.
const REGISTRY_KEY = Symbol.for('@jsekulowicz/ds-components:icon-registry');
type RegistryHost = { [REGISTRY_KEY]?: Map<string, string> };
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
  @state() private svg: SVGTemplateResult | null = null;

  override willUpdate(): void {
    if (!this.name) {
      this.svg = null;
      return;
    }
    const markup = registry.get(this.name);
    if (!markup) {
      this.svg = null;
      console.warn(`<ds-icon>: unknown icon "${this.name}"`);
      return;
    }
    this.svg = svg`${unsafeSVG(markup)}`;
  }

  override render(): TemplateResult {
    const ariaHidden = this.label ? 'false' : 'true';
    const role: 'img' | undefined = this.label ? 'img' : undefined;
    return html`<span
      role=${ifDefined(role)}
      aria-hidden=${ariaHidden}
      aria-label=${ifDefined(this.label)}
    >
      ${this.svg ? this.svg : html`<slot></slot>`}
    </span>`;
  }
}

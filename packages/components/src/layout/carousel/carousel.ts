import { html, type TemplateResult } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { DsElement } from '@jsekulowicz/ds-core';
import '../../data-display/icon/icons/chevron-left.js';
import '../../data-display/icon/icons/chevron-right.js';
import { carouselStyles } from './carousel.styles.js';

const EDGE_TOLERANCE_PX = 2;

/**
 * @tag ds-carousel
 * @summary A single row of items that scrolls sideways, snapping item by item, with previous and next buttons.
 * @slot default - The items. Each slotted element is one snap point.
 * @csspart track - The scrolling row that holds the items.
 * @csspart button - Both scroll buttons.
 * @csspart button-prev - The button that scrolls back by one view.
 * @csspart button-next - The button that scrolls forward by one view.
 * @cssprop --ds-carousel-item-width - Width of every item. Percentages resolve against the track. Defaults to 16rem.
 * @cssprop --ds-carousel-gap - Space between items. Defaults to `--ds-space-4`.
 * @attr label - Accessible name of the carousel region. Defaults to "Carousel".
 * @attr role-description - How assistive technology announces the region. Defaults to "carousel".
 * @attr prev-label - Accessible name of the previous button. Defaults to "Scroll back".
 * @attr next-label - Accessible name of the next button. Defaults to "Scroll forward".
 */
export class DsCarousel extends DsElement {
  static override styles = [...DsElement.styles, carouselStyles];

  @property() label = 'Carousel';
  @property({ attribute: 'role-description' }) roleDescription = 'carousel';
  @property({ attribute: 'prev-label' }) prevLabel = 'Scroll back';
  @property({ attribute: 'next-label' }) nextLabel = 'Scroll forward';

  @state() private _atStart = true;
  @state() private _atEnd = true;

  @query('.track') private _trackEl?: HTMLElement;

  #resizeObserver: ResizeObserver | null = null;
  #handFocusToTheOtherButton = false;

  override connectedCallback(): void {
    super.connectedCallback();
    if (typeof ResizeObserver === 'undefined') {
      return;
    }
    this.#resizeObserver = new ResizeObserver(this.#measureEdges);
    this.#resizeObserver.observe(this);
  }

  override disconnectedCallback(): void {
    this.#resizeObserver?.disconnect();
    this.#resizeObserver = null;
    super.disconnectedCallback();
  }

  override willUpdate(): void {
    this.#handFocusToTheOtherButton = this.#focusedButtonHidesThisUpdate();
  }

  override updated(): void {
    if (this.#handFocusToTheOtherButton) {
      this.shadowRoot?.querySelector<HTMLElement>('.scroll-button:not([hidden])')?.focus();
    }
  }

  #measureEdges = (): void => {
    if (!this._trackEl) {
      return;
    }
    const { scrollLeft, scrollWidth, clientWidth } = this._trackEl;
    const travelled = Math.abs(scrollLeft);
    this._atStart = travelled <= EDGE_TOLERANCE_PX;
    this._atEnd = travelled >= scrollWidth - clientWidth - EDGE_TOLERANCE_PX;
  };

  #focusedButtonHidesThisUpdate(): boolean {
    const focused = this.shadowRoot?.activeElement;
    if (!focused) {
      return false;
    }
    return (
      (this._atStart && focused.matches('.scroll-button--prev')) ||
      (this._atEnd && focused.matches('.scroll-button--next'))
    );
  }

  #scrollByOneView(direction: 1 | -1): void {
    const readingDirection = getComputedStyle(this).direction === 'rtl' ? -1 : 1;
    this._trackEl?.scrollBy({ left: direction * readingDirection * this._trackEl.clientWidth });
  }

  #renderButton(direction: 1 | -1): TemplateResult {
    const isPrev = direction === -1;
    return html`<ds-button
      part=${isPrev ? 'button button-prev' : 'button button-next'}
      class=${isPrev ? 'scroll-button scroll-button--prev' : 'scroll-button scroll-button--next'}
      variant="secondary"
      square
      label=${isPrev ? this.prevLabel : this.nextLabel}
      ?hidden=${isPrev ? this._atStart : this._atEnd}
      @click=${() => this.#scrollByOneView(direction)}
    >
      <ds-icon slot="leading" name=${isPrev ? 'chevron-left' : 'chevron-right'} size="md"></ds-icon>
    </ds-button>`;
  }

  override render(): TemplateResult {
    return html`<section class="carousel" aria-roledescription=${this.roleDescription} aria-label=${this.label}>
      <div class="track" part="track" @scroll=${this.#measureEdges}>
        <slot @slotchange=${this.#measureEdges}></slot>
      </div>
      ${this.#renderButton(-1)} ${this.#renderButton(1)}
    </section>`;
  }
}

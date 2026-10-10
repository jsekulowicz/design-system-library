import type { ReactiveController, ReactiveControllerHost } from 'lit';
import type { StepListLayout } from './step-list-templates.js';

type ReasonTooltipHost = ReactiveControllerHost & HTMLElement;

interface ActiveReason {
  index: number;
  layout: StepListLayout;
  pinned: boolean;
  hovered: boolean;
  focused: boolean;
}

export class ReasonTooltipController implements ReactiveController {
  readonly #host: ReasonTooltipHost;
  readonly #hasReason: (index: number) => boolean;
  readonly #currentLayout: () => StepListLayout;
  #activeReason: ActiveReason | null = null;
  #pressingInsideTheReason = false;

  constructor(host: ReasonTooltipHost, hasReason: (index: number) => boolean, currentLayout: () => StepListLayout) {
    this.#host = host;
    this.#hasReason = hasReason;
    this.#currentLayout = currentLayout;
    host.addController(this);
  }

  hostDisconnected(): void {
    this.#endThePressInside();
    this.close();
  }

  hostUpdate(): void {
    const reason = this.#activeReason;
    if (!reason) {
      return;
    }
    if (!this.#hasReason(reason.index)) {
      this.#trackReason(null);
    } else if (reason.layout !== this.#currentLayout()) {
      this.#trackReason(
        reason.pinned ? { ...reason, layout: this.#currentLayout(), hovered: false, focused: false } : null,
      );
    }
  }

  isOpenFor(index: number, layout: StepListLayout): boolean {
    return this.#activeReason?.index === index && this.#activeReason.layout === layout;
  }

  toggle(index: number, layout: StepListLayout): void {
    const reason = this.#reasonFor(index, layout);
    this.#changeReason(reason.pinned ? null : { ...reason, pinned: true });
  }

  enter(index: number, layout: StepListLayout, event: Event): void {
    if (this.#pressingInsideTheReason && !this.isOpenFor(index, layout)) {
      return;
    }
    const interaction = event.type === 'mouseenter' ? 'hovered' : 'focused';
    this.#changeReason({ ...this.#reasonFor(index, layout), [interaction]: true });
  }

  leave(index: number, layout: StepListLayout, event: Event): void {
    if (!this.isOpenFor(index, layout)) {
      return;
    }
    const interaction = event.type === 'mouseleave' ? 'hovered' : 'focused';
    const reason = { ...this.#activeReason!, [interaction]: false };
    if (interaction === 'focused' && !this.#pressingInsideTheReason) {
      reason.pinned = false;
    }
    this.#changeReason(reason.pinned || reason.hovered || reason.focused ? reason : null);
  }

  holdThroughAPressInside(index: number, layout: StepListLayout): void {
    if (!this.isOpenFor(index, layout)) {
      return;
    }
    this.#pressingInsideTheReason = true;
    document.addEventListener('pointerup', this.#endThePressInside);
    document.addEventListener('pointercancel', this.#endThePressInside);
  }

  close = (): void => {
    this.#changeReason(null);
  };

  #reasonFor(index: number, layout: StepListLayout): ActiveReason {
    return this.isOpenFor(index, layout)
      ? this.#activeReason!
      : { index, layout, pinned: false, hovered: false, focused: false };
  }

  #endThePressInside = (): void => {
    this.#pressingInsideTheReason = false;
    document.removeEventListener('pointerup', this.#endThePressInside);
    document.removeEventListener('pointercancel', this.#endThePressInside);
  };

  #closeOnEscape = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && this.#activeReason) {
      event.preventDefault();
      this.close();
    }
  };

  #closeOnClickOutside = (event: MouseEvent): void => {
    if (!event.composedPath().includes(this.#host)) {
      this.close();
    }
  };

  #changeReason(reason: ActiveReason | null): void {
    if (this.#activeReason !== reason) {
      this.#trackReason(reason);
      this.#host.requestUpdate();
    }
  }

  #trackReason(reason: ActiveReason | null): void {
    this.#activeReason = reason;
    if (reason === null) {
      document.removeEventListener('click', this.#closeOnClickOutside);
      document.removeEventListener('keydown', this.#closeOnEscape);
    } else {
      document.addEventListener('click', this.#closeOnClickOutside);
      document.addEventListener('keydown', this.#closeOnEscape);
    }
  }
}

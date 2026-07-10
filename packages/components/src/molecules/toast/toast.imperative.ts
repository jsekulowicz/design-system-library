import { html, render, type TemplateResult } from 'lit';
import type { ButtonVariant } from '../../atoms/button/button.js';
import type { DsToast, ToastTone } from './toast.js';
import type { DsToastStack, ToastPlacement } from './toast-stack.js';

import '../../atoms/button/define.js';

// Declarative action button: pass data, the toast renders the `ds-button`.
// Avoids callers hand-writing lit templates for the common case.
export interface ToastAction {
  label: string;
  onClick: (controller: ToastController) => void;
  variant?: ButtonVariant;
}

export interface ToastOptions {
  tone?: ToastTone;
  heading?: string;
  body?: TemplateResult | string;
  duration?: number;
  dismissible?: boolean;
  placement?: ToastPlacement;
  // Either a render function (full control) or a list of action buttons.
  actions?: ((controller: ToastController) => TemplateResult) | ToastAction[];
  // Move keyboard focus to the toast when it appears. Use for actionable
  // toasts raised in response to a user action, so a keyboard user lands on
  // the notification (and its buttons) instead of hunting for it. The toast
  // pauses its auto-dismiss timer while focused. Leave off for passive toasts.
  focusOnShow?: boolean;
  // Dedup id: a repeat with the same key refreshes the live toast, not a copy.
  key?: string;
}

export interface ToastController {
  readonly id: string;
  dismiss(): void;
  update(partial: Partial<ToastOptions>): void;
}

let counter = 0;

const keyedToasts = new Map<string, { el: DsToast; controller: ToastController }>();

function ensureStack(placement: ToastPlacement): DsToastStack | null {
  if (typeof document === 'undefined') return null;
  const existing = document.body.querySelector<DsToastStack>(
    `ds-toast-stack[placement="${placement}"]`,
  );
  if (existing) return existing;
  const stack = document.createElement('ds-toast-stack') as DsToastStack;
  stack.setAttribute('placement', placement);
  document.body.appendChild(stack);
  return stack;
}

function noopController(id: string): ToastController {
  return {
    id,
    dismiss() {},
    update() {},
  };
}

function renderActionButtons(actions: ToastAction[], controller: ToastController): TemplateResult {
  return html`${actions.map(
    (action) =>
      html`<ds-button
        size="sm"
        variant=${action.variant ?? 'secondary'}
        @ds-click=${() => action.onClick(controller)}
        >${action.label}</ds-button
      >`,
  )}`;
}

function applyProps(el: DsToast, options: ToastOptions): void {
  if (options.tone !== undefined) el.tone = options.tone;
  if (options.heading !== undefined) el.heading = options.heading;
  if (options.duration !== undefined) el.duration = options.duration;
  if (options.dismissible !== undefined) el.dismissible = options.dismissible;
}

function toastFn(options: ToastOptions = {}): ToastController {
  const id = `ds-toast-${++counter}`;
  if (typeof document === 'undefined') return noopController(id);

  const key = options.key;
  if (key !== undefined) {
    const existing = keyedToasts.get(key);
    if (existing && existing.el.isConnected) {
      existing.controller.update(options);
      existing.el.resetTimer();
      return existing.controller;
    }
  }

  const placement: ToastPlacement = options.placement ?? 'bottom-right';
  const stack = ensureStack(placement);
  if (!stack) return noopController(id);

  const el = document.createElement('ds-toast') as DsToast;
  el.id = id;

  const state: ToastOptions = { ...options };

  const controller: ToastController = {
    id,
    dismiss: () => el.dismiss('programmatic'),
    update: (partial) => {
      Object.assign(state, partial);
      applyProps(el, state);
      renderContent();
    },
  };

  const renderActions = (): TemplateResult | '' => {
    const { actions } = state;
    if (!actions) {
      return '';
    }
    const content = Array.isArray(actions) ? renderActionButtons(actions, controller) : actions(controller);
    return html`<div slot="actions">${content}</div>`;
  };

  const renderContent = (): void => {
    render(html`${state.body ?? ''}${renderActions()}`, el);
  };

  applyProps(el, state);
  renderContent();
  if (key !== undefined) {
    keyedToasts.set(key, { el, controller });
    el.addEventListener(
      'ds-dismiss',
      () => {
        if (keyedToasts.get(key)?.el === el) keyedToasts.delete(key);
      },
      { once: true },
    );
  }
  stack.push(el);
  if (options.focusOnShow) {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    // rAF so focus lands after the element upgrades and lays out.
    requestAnimationFrame(() => {
      el.restoreFocusTo = previouslyFocused;
      el.focus();
    });
  }
  return controller;
}

type ToneShortcut = (
  heading: string,
  opts?: Omit<ToastOptions, 'tone' | 'heading'>,
) => ToastController;

interface ToastFn {
  (options?: ToastOptions): ToastController;
  info: ToneShortcut;
  success: ToneShortcut;
  warning: ToneShortcut;
  danger: ToneShortcut;
}

const shortcut = (tone: ToastTone): ToneShortcut => (heading, opts) =>
  toastFn({ ...opts, tone, heading });

export const toast: ToastFn = Object.assign(toastFn, {
  info: shortcut('info'),
  success: shortcut('success'),
  warning: shortcut('warning'),
  danger: shortcut('danger'),
});

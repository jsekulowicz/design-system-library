import { html, render, type TemplateResult } from 'lit';
import type { DsToast, ToastTone } from './toast.js';
import type { DsToastStack, ToastPlacement } from './toast-stack.js';

export interface ToastOptions {
  tone?: ToastTone;
  heading?: string;
  body?: TemplateResult | string;
  duration?: number;
  dismissible?: boolean;
  placement?: ToastPlacement;
  actions?: (controller: ToastController) => TemplateResult;
}

export interface ToastController {
  readonly id: string;
  dismiss(): void;
  update(partial: Partial<ToastOptions>): void;
}

let counter = 0;

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

function applyProps(el: DsToast, options: ToastOptions): void {
  if (options.tone !== undefined) el.tone = options.tone;
  if (options.heading !== undefined) el.heading = options.heading;
  if (options.duration !== undefined) el.duration = options.duration;
  if (options.dismissible !== undefined) el.dismissible = options.dismissible;
}

function toastFn(options: ToastOptions = {}): ToastController {
  const id = `ds-toast-${++counter}`;
  if (typeof document === 'undefined') return noopController(id);

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

  const renderContent = (): void => {
    const body = state.body ?? '';
    const actions = state.actions?.(controller);
    render(
      html`${body}${actions ? html`<div slot="actions">${actions}</div>` : ''}`,
      el,
    );
  };

  applyProps(el, state);
  renderContent();
  stack.push(el);
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

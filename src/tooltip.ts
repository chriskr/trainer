import { render } from './uldu';

export const registerTooltip = () => {
  document.addEventListener('mouseover', tooltipHandler, { capture: true });
};

export const TOOLTIP_KEY = 'data-tooltip-text';

let previousTarget: HTMLElement | null = null;

let tooltipContainer: HTMLDivElement | null = null;

const tooltipHandler = (event: Event) => {
  let target = event.target;
  while (target instanceof HTMLElement) {
    const tooltipText = target.dataset.tooltipText;
    if (tooltipText) {
      if (target === previousTarget) return;
      previousTarget = target;
      displayTooltip(tooltipText, target);
      return;
    }
    target = target.parentElement;
  }
  clearTooltip();
  previousTarget = null;
};

const displayTooltip = (text: string, target: HTMLElement) => {
  if (!tooltipContainer) {
    tooltipContainer = render(
      ['div', { id: 'tooltip-container' }],
      document.body
    ) as HTMLDivElement;
  }
  clearTooltip();
  const rect = target.getBoundingClientRect();
  const tooltip = render(
    ['div', { id: 'tooltip', style: 'left: -10000px; top: 0' }, text],
    tooltipContainer
  ) as HTMLDivElement;
  const tooltipRect = tooltip.getBoundingClientRect();
  tooltip.style.cssText = ` left: ${
    rect.left + rect.width / 2 - tooltipRect.width / 2
  }px; top: ${rect.top - tooltipRect.height - 10}px`;
};

const clearTooltip = () => {
  if (tooltipContainer && previousTarget) {
    tooltipContainer!.textContent = '';
  }
};

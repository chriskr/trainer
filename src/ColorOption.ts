import './css/color-options.css';
import { render } from './uldu';

export const getSetColor = (selector: string, selectedColor: string) => () =>
  showColorSelect(
    document.querySelector('#settings'),
    (color) => {
      const target = document.querySelector(selector);
      if (!(target && target instanceof HTMLDivElement)) return;
      target.dataset.color = color;
      target.style.backgroundColor = color;
    },
    selectedColor
  );

const hideColorSelect = (container: HTMLDivElement) => {
  const colorSelectsElement = container.querySelector(
    '#color-select'
  ) as HTMLDivElement;
  if (!colorSelectsElement) return;
  colorSelectsElement.addEventListener('transitionend', () =>
    colorSelectsElement.parentElement?.remove()
  );
  const box = colorSelectsElement.getBoundingClientRect();
  colorSelectsElement.style.transform = `translate(0, ${box.height}px)`;
};

const showColorSelect = (
  container: HTMLDivElement | null,
  setColor: (color: string) => void,
  selectedColor: string
) => {
  if (!container) return;

  const colorSelects = [
    'div',
    { id: 'color-select-backdrop', onClick: () => hideColorSelect(container) },
    [
      'div',
      { id: 'color-select' },
      [
        'div',
        { class: 'color-options' },
        [0, 20, 40, 60, 90, 135, 180, 205, 240, 260, 280, 320]
          .map((color) => `hsl(${color}, 100%, 50%)`)
          .map((color) =>
            ColorOption({
              color,
              onClick: () => setColor(color),
              isSelected: selectedColor === color,
            })
          ),
      ],
    ],
  ];

  const colorSelectsElement = render(colorSelects, container)
    .firstElementChild as HTMLDivElement;

  const box = colorSelectsElement?.getBoundingClientRect();
  colorSelectsElement.style.transform = `translate(0, ${box.height}px)`;
  setTimeout(() => {
    colorSelectsElement.style.cssText = `
      transition: transform 0.3s;
      translate(0, 0);
    `;
  }, 16);
};

export const ColorOption = ({
  color,
  id,
  onClick,
  isSelected,
}: {
  color: string;
  onClick?: (...args: unknown[]) => void;
  id?: string;
  isSelected?: boolean;
}) => [
  'div',
  {
    'data-color': color,
    style: `background-color: ${color}`,
    class: classes('color-option', isSelected && 'selected'),
    onClick,
    id,
  },
];

const classes = (...args: (string | undefined | boolean | null)[]) =>
  args.filter(Boolean).join(' ');

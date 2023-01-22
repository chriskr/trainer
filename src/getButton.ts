import { TOOLTIP_KEY } from './tooltip';
import { Template } from './uldu';

export type GetButton = {
  isTouchDevice: boolean;
  onClick?: (element?: Element, event?: Event) => void;
  iconName: string;
  label: string;
};

export const getButton = ({
  isTouchDevice,
  onClick,
  iconName,
  label,
}: GetButton): Template => {
  return isTouchDevice
    ? [
        'span',
        {
          class: 'touch-device',
          ...(onClick ? { onClick } : {}),
        },
        ['span', { class: 'material-icons main-controls' }, iconName],
        ['span', { class: 'label' }, label],
      ]
    : [
        'span',
        {
          class: 'material-icons main-controls',
          [TOOLTIP_KEY]: label,
          ...(onClick ? { onClick } : {}),
        },
        iconName,
      ];
};

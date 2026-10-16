import './css/settings.css';
import { ColorOption, getSetColor } from './ColorOption';
import { getButton } from './getButton';
import { setLinearGradient } from './setLinearGradient';
import { defaultTrainingConfig, TrainingConfig } from './TrainingConfig';
import { render } from './uldu';

let savedTrainingConfig: TrainingConfig = {
  ...defaultTrainingConfig,
};

const storageKey = 'trainingConfig';

export const loadTraingConfig = () => {
  const config = window.localStorage.getItem(storageKey);
  if (config) {
    setTrainingConfig(JSON.parse(config));
  }
  return { ...savedTrainingConfig };
};

const setTrainingConfig = (trainingConfig: TrainingConfig) => {
  savedTrainingConfig = { ...defaultTrainingConfig, ...trainingConfig };
  window.localStorage.setItem(storageKey, JSON.stringify(savedTrainingConfig));
};

export const getSavedTrainingsConfig = () => ({
  ...defaultTrainingConfig,
  ...savedTrainingConfig,
});

const saveConfig = () => {
  const [repetitions, intervalHigh, intervalLow] = [
    '#repetitions',
    '#intervalHigh',
    '#intervalLow',
  ].map((selector) =>
    Number.parseInt(
      (document.querySelector(selector)! as HTMLInputElement).value,
      10
    )
  );
  const [cooldownColor, intenseColor] = [
    ['#cool-down-color', 'blue'],
    ['#intense-color', 'red'],
  ].map(
    ([selector, defaultColor]) =>
      (document.querySelector(selector)! as HTMLInputElement).dataset.color ??
      defaultColor
  );
  closeConfig();
  setLinearGradient(cooldownColor, intenseColor);
  setTrainingConfig({
    repetitions,
    intervalHigh,
    intervalLow,
    cooldownColor,
    intenseColor,
  });
};

const closeConfig = () => document.querySelector('#modal')?.remove();

export const showConfig = (isTouchDevice: boolean) => {
  const {
    repetitions,
    intervalHigh,
    intervalLow,
    cooldownColor,
    intenseColor,
  } = getSavedTrainingsConfig();
  const templ = [
    'div',
    { id: 'modal' },
    [
      'div',
      { id: 'settings' },
      [
        'div',
        { id: 'configs' },
        [
          'label',
          'repetitions:',
          [
            'input',
            {
              type: 'number',
              id: 'repetitions',
              value: repetitions,
            },
          ],
        ],
        [
          'label',
          'intense:',
          [
            'input',
            {
              type: 'number',
              id: 'intervalHigh',
              value: intervalHigh,
            },
          ],
        ],
        [
          'label',
          'cool down:',
          [
            'input',
            {
              type: 'number',
              id: 'intervalLow',
              value: intervalLow,
            },
          ],
        ],
        [
          'label',
          { onClick: getSetColor('#cool-down-color', cooldownColor) },
          'cool down color:',
          [
            'div',
            { class: 'color-option-wrapper' },
            ColorOption({
              color: cooldownColor,
              id: 'cool-down-color',
            }),
          ],
        ],
        [
          'label',
          { onClick: getSetColor('#intense-color', intenseColor) },
          'intense color:',
          [
            'div',
            { class: 'color-option-wrapper' },
            ColorOption({
              color: intenseColor,
              id: 'intense-color',
            }),
          ],
        ],
      ],
      [
        'footer',
        { class: 'controls' },
        getButton({
          isTouchDevice,
          onClick: closeConfig,
          iconName: 'close',
          label: 'close',
        }),
        getButton({
          isTouchDevice,
          onClick: saveConfig,
          iconName: 'save_alt',
          label: 'save',
        }),
      ],
    ],
  ];
  render(templ, document.body);
};

import { getButton } from './getButton';
import { render } from './uldu';

export type TrainingConfig = {
  repetitions: number;
  intervalHigh: number;
  intervalLow: number;
};

let savedTrainingConfig: TrainingConfig = {
  repetitions: 5,
  intervalHigh: 60,
  intervalLow: 120,
};

const storageKey = 'trainingConfig';

export const loadTraingConfig = () => {
  const config = window.localStorage.getItem(storageKey);
  if (config) {
    setTrainingConfig(JSON.parse(config));
  }
};

const setTrainingConfig = (trainingConfig: TrainingConfig) => {
  savedTrainingConfig = trainingConfig;
  window.localStorage.setItem(storageKey, JSON.stringify(savedTrainingConfig));
};

export const getSavedTrainingsConfig = () => savedTrainingConfig;

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
  setTrainingConfig({ repetitions, intervalHigh, intervalLow });
  closeConfig();
};

const closeConfig = () => document.querySelector('#modal')?.remove();

export const showConfig = (isTouchDevice: boolean) => {
  const { repetitions, intervalHigh, intervalLow } = getSavedTrainingsConfig();
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

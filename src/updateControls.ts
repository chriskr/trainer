import { AppState, setAppState } from './appState';
import { play } from './play';
import Timer from './timer';
import { TOOLTIP_KEY } from './tooltip';
import { getSavedTrainingsConfig, showConfig } from './trainerConfig';
import { createDom, render } from './uldu';
import { updateInfo } from './updateInfo';

export const updateControls = (state: AppState, timer: Timer) => {
  setAppState(state);
  const controls = document.querySelector('#controls-container');
  if (controls) {
    controls.textContent = '';
    render(getControls(state, timer), controls);
  }
};

const pause = (timer: Timer) => {
  timer.pause();
  updateControls('resume', timer);
};

const resume = (timer: Timer) => {
  timer.resume();
  updateControls('running', timer);
};

const reset = (timer: Timer) => {
  timer.reset();
  updateControls('default', timer);
  updateInfo([['span'], ['span', 'personal trainer'], ['span']]);
};

const getControls = (state: AppState, timer: Timer) => {
  switch (state) {
    case 'default':
      return [
        'div',
        { class: 'controls' },
        [
          'span',
          {
            class: 'material-icons main-controls',
            [TOOLTIP_KEY]: 'start',
            onClick: () => {
              const { repetitions, intervalHigh, intervalLow } =
                getSavedTrainingsConfig();
              play(
                repetitions,
                intervalHigh,
                intervalLow,
                timer,
                updateControls
              );
            },
          },
          'play_circle_filled',
        ],

        [
          'span',
          {
            [TOOLTIP_KEY]: 'settings',
            class: 'material-icons main-controls',
            onClick: showConfig,
          },
          'settings',
        ],
      ];

    case 'blank':
      return [
        'div',
        { class: 'controls' },
        ['span'],
        [
          'span',
          {
            [TOOLTIP_KEY]: 'wait',
            class: 'material-icons main-controls',
          },
          'hourglass_empty',
        ],
        ['span'],
      ];

    case 'running':
      return [
        'div',
        { class: 'controls' },
        ['span'],
        [
          'span',
          {
            [TOOLTIP_KEY]: 'pause',
            class: 'material-icons main-controls',
            onClick: () => pause(timer),
          },
          'pause',
        ],
        ['span'],
      ];

    case 'resume':
      return [
        'div',
        { class: 'controls' },
        [
          'span',
          {
            [TOOLTIP_KEY]: 'resume',
            class: 'material-icons main-controls',
            onClick: () => resume(timer),
          },
          'play_circle_filled',
        ],
        [
          'span',
          {
            [TOOLTIP_KEY]: 'restart',
            class: 'material-icons main-controls',
            onClick: () => reset(timer),
          },
          'restart_alt',
        ],
      ];

    default:
      return [];
  }
};

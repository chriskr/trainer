import { AppState, setAppState } from './appState';
import { play } from './play';
import Timer from './timer';
import { getSavedTrainingsConfig, showConfig } from './trainerConfig';
import { createDom, render } from './uldu';

export const updateControls = (state: AppState, timer: Timer) => {
  setAppState(state);
  const controls = document.querySelector('#controls');
  if (controls) {
    controls.parentElement?.insertBefore(
      createDom(getControls(state, timer)),
      controls
    );
    controls.remove();
  } else {
    render(getControls(state, timer), document.body);
  }
};

const getControls = (state: AppState, timer: Timer) => {
  switch (state) {
    case 'default':
      return [
        'div',
        { id: 'controls' },
        [
          'span',
          {
            id: 'start',
            class: 'material-icons main-controls',
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
            id: 'start',
            class: 'material-icons main-controls',
            onClick: showConfig,
          },
          'settings',
        ],
      ];

    case 'running':
      return [
        'div',
        { id: 'controls' },

        [
          'span',
          {
            id: 'rounds',
            class: ' main-controls',
          },
          '',
        ],
      ];

    default:
      return [];
  }
};

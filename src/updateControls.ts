import { AppState, setAppState } from './appState';
import { getButton } from './getButton';
import { play } from './play';
import Timer from './timer';
import { TOOLTIP_KEY } from './tooltip';
import { getSavedTrainingsConfig, showConfig } from './trainerConfig';
import { createDom, render } from './uldu';
import { updateInfo } from './updateInfo';

export const updateControls = (
  state: AppState,
  timer: Timer,
  isTouchDevice: boolean
) => {
  setAppState(state);
  const controls = document.querySelector('#controls-container');
  if (controls) {
    controls.textContent = '';
    render(getControls(state, timer, isTouchDevice), controls);
  }
};

const pause = (timer: Timer, isTouchDevice: boolean) => {
  timer.pause();
  updateControls('resume', timer, isTouchDevice);
};

const resume = (timer: Timer, isTouchDevice: boolean) => {
  timer.resume();
  updateControls('running', timer, isTouchDevice);
};

const reset = (timer: Timer, isTouchDevice: boolean) => {
  timer.reset();
  updateControls('default', timer, isTouchDevice);
  updateInfo([['span'], ['span', 'personal trainer'], ['span']]);
  document.body.classList.remove('hot');
};

const getControls = (state: AppState, timer: Timer, isTouchDevice: boolean) => {
  switch (state) {
    case 'default':
      return [
        'div',
        { class: 'controls' },
        getButton({
          isTouchDevice,
          onClick: () => {
            const { repetitions, intervalHigh, intervalLow } =
              getSavedTrainingsConfig();
            play(
              repetitions,
              intervalHigh,
              intervalLow,
              timer,
              isTouchDevice,
              updateControls
            );
          },
          iconName: 'play_circle_filled',
          label: 'start',
        }),

        getButton({
          isTouchDevice,
          onClick: () => showConfig(isTouchDevice),
          iconName: 'settings',
          label: 'settings',
        }),
      ];

    case 'blank':
      return [
        'div',
        { class: 'controls' },
        ['span'],
        getButton({
          isTouchDevice,
          iconName: 'hourglass_empty',
          label: 'get ready',
        }),
        ['span'],
      ];

    case 'running':
      return [
        'div',
        { class: 'controls' },
        ['span'],
        getButton({
          isTouchDevice,
          onClick: () => pause(timer, isTouchDevice),
          iconName: 'pause',
          label: 'pause',
        }),
        ['span'],
      ];

    case 'resume':
      return [
        'div',
        { class: 'controls' },
        getButton({
          isTouchDevice,
          onClick: () => resume(timer, isTouchDevice),
          iconName: 'play_circle_filled',
          label: 'resume',
        }),
        getButton({
          isTouchDevice,
          onClick: () => reset(timer, isTouchDevice),
          iconName: 'restart_alt',
          label: 'restart',
        }),
      ];

    default:
      return [];
  }
};

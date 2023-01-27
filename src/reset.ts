import { AppState } from './appState';
import Timer from './timer';
import { updateInfo } from './updateInfo';

export const reset = (
  timer: Timer,
  isTouchDevice: boolean,
  updateControls: (
    state: AppState,
    timer: Timer,
    isTouchDevice: boolean
  ) => void
) => {
  updateControls('default', timer, isTouchDevice);
  updateInfo();
  document.body.classList.remove('hot');
  setTimeout(() => timer.reset(), 500);
};

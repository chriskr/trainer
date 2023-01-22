import Timer from './timer';
import { updateInfo } from './updateInfo';
import { updateControls } from './updateControls';

export const reset = (timer: Timer, isTouchDevice: boolean) => {
  updateControls('default', timer, isTouchDevice);
  updateInfo([['span'], ['span', 'personal trainer'], ['span']]);
  document.body.classList.remove('hot');
  setTimeout(() => timer.reset(), 500);
};

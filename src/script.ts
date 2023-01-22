import './style.css';
import Timer from './timer';
import { loadTraingConfig } from './trainerConfig';
import { updateControls } from './updateControls';
import { updateInfo } from './updateInfo';
import { registerTooltip } from './tooltip';

window.onload = () => {
  try {
    loadTraingConfig();
  } catch (e) {}

  const timer = new Timer(
    ...(['#digits-minutes', '#digits-seconds'].map((selector) =>
      document.querySelector(selector)
    ) as [SVGGElement, SVGGElement])
  );
  const isTouchDevice = 'ontouchstart' in document.documentElement;
  updateControls('default', timer, isTouchDevice);
  updateInfo([['span'], ['span', 'personal trainer'], ['span']]);
  if (isTouchDevice) {
    document.querySelector('.repolink')?.remove();
  } else {
    registerTooltip();
  }
  document.body.style.fontSize = `${16 / window.devicePixelRatio}px`;
};

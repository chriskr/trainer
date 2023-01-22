import './style.css';
import Timer from './timer';
import { loadTraingConfig } from './trainerConfig';
import { updateControls } from './updateControls';
import { updateInfo } from './updateInfo';
import { registerTooltip } from './tooltip';

const debounce = (fn: () => void, debounceTime: number) => {
  let timeout = 0;
  const wrappedFn = () => {
    clearTimeout(timeout);
    timeout = 0;
    fn();
  };

  return () => {
    if (timeout === 0) {
      timeout = setTimeout(wrappedFn, debounceTime);
    }
  };
};

const setLinearGradient = () => {
  console.log('now');
  const angle =
    (Math.atan(window.innerHeight / window.innerWidth) / (2 * Math.PI)) * 360;
  document.body.style.setProperty(
    'background-image',
    `linear-gradient(${Math.round(angle)}deg, #f00, #00f)`
  );
};

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
  setLinearGradient();
  window.addEventListener('resize', debounce(setLinearGradient, 100));
};

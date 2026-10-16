import './css/style.css';
import './css/digits.css';
import './css/icons.css';
import Timer from './timer';
import { loadTraingConfig } from './trainerConfig';
import { updateControls } from './updateControls';
import { updateInfo } from './updateInfo';
import { registerTooltip } from './tooltip';
import { setLinearGradient } from './setLinearGradient';
import { defaultTrainingConfig } from './TrainingConfig';

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

window.onload = () => {
  let config = defaultTrainingConfig;
  try {
    config = loadTraingConfig();
  } catch (e) {}

  const timer = new Timer(
    ...(['#digits-minutes', '#digits-seconds'].map((selector) =>
      document.querySelector(selector)
    ) as [SVGGElement, SVGGElement])
  );
  const isTouchDevice = 'ontouchstart' in document.documentElement;
  updateControls('default', timer, isTouchDevice);
  updateInfo();
  if (isTouchDevice) {
    document.body.classList.add('is-touch-device');
  } else {
    registerTooltip();
  }
  const rootRule = getStyleRule(':root');
  if (rootRule) {
    rootRule.style.setProperty(
      '--font-size',
      `${16 / window.devicePixelRatio}px`
    );
  }
  setLinearGradient(config.cooldownColor, config.intenseColor);
  window.addEventListener(
    'resize',
    debounce(() => {
      try {
        config = loadTraingConfig();
      } catch (e) {}
      setLinearGradient(config.cooldownColor, config.intenseColor);
    }, 100)
  );
};

const getStyleRule = (selector: string) => {
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      for (const rule of Array.from(sheet.cssRules)) {
        if (rule instanceof CSSStyleRule && rule.selectorText === selector) {
          return rule;
        }
      }
    } catch (e) {}
  }
  return null;
};

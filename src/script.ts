import { playSound, Sound } from './sound';
import { createDom, Listener, render } from './uldu';
import './style.css';
import Timer, { TimerConfig } from './timer';
import {
  getSavedTrainingsConfig,
  loadTraingConfig,
  showConfig,
} from './trainerConfig';
import { playStartSound } from './playStartSound';
import { play } from './play';
import { AppState } from './appState';
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
  updateControls('default', timer);
  updateInfo([['span'], ['span', 'personal trainer'], ['span']]);
  registerTooltip();
  document.body.style.fontSize = `${16 / window.devicePixelRatio}px`;
  if (window.devicePixelRatio > 1) {
    document.querySelector('.repolink')?.remove();
  }
};

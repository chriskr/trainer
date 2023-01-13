import { playSound, Sound } from './sound';
import { Listener, render } from './uldu';
import './style.css';
import Timer, { TimerConfig } from './timer';
import {
  getSavedTrainingsConfig,
  loadTraingConfig,
  showConfig,
} from './trainerConfig';
import { playStartSound } from './playStartSound';
import { play } from './play';

window.onload = () => {
  try {
    loadTraingConfig();
  } catch (e) {}

  const templ = [
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
    [
      'span',
      {
        id: 'start',
        class: 'material-icons main-controls',
        onClick: () => {
          const { repetitions, intervalHigh, intervalLow } =
            getSavedTrainingsConfig();
          play(repetitions, intervalHigh, intervalLow, timer);
        },
      },
      'play_circle_filled',
    ],

    [
      'span',
      {
        id: 'start',
        class: 'material-icons main-controls',
        onClick: () => showConfig(),
      },
      'settings',
    ],
  ];

  render(templ, document.body);
  const timer = new Timer(
    ...(['#digits-minutes', '#digits-seconds'].map((selector) =>
      document.querySelector(selector)
    ) as [SVGGElement, SVGGElement])
  );
};

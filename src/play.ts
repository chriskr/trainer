import { AppState, setAppState } from './appState';
import { playStartSound } from './playStartSound';
import Timer, { TimerConfig } from './timer';
import { clearTooltip } from './tooltip';
import { render } from './uldu';
import { updateInfo } from './updateInfo';

export const play = (
  repetitions: number,
  intervalHigh: number,
  intervalLow: number,
  timer: Timer,
  updateControls: (state: AppState, timer: Timer) => void
) => {
  const startAfter = 5000;
  let counter = 1;

  const update = (interval: string) =>
    updateInfo([
      ['span', interval],
      ['span', `round ${counter} of ${repetitions}`],
    ]);

  const intervals: TimerConfig[] = [
    {
      duration: startAfter,
      isUpdateDisplay: false,
      callbacks: [
        { at: startAfter - 3000, callback: playStartSound },
        {
          callback: () => {
            clearTooltip();
            updateControls('running', timer);
            nextTick();
          },
        },
      ],
    },
  ];

  const nextTick = () => {
    const config = intervals.shift();
    if (config) {
      timer.setConfig(config);
      timer.start();
    }
  };

  for (let i = 0; i < repetitions; i++) {
    intervals.push(
      {
        duration: intervalHigh * 1000,
        callbacks: [
          {
            at: 0,
            callback: () => {
              document.body.classList.add('hot');
              update('go intense');
            },
          },
          { at: intervalHigh * 1000 - 3000, callback: playStartSound },
          { callback: () => setTimeout(nextTick, 1000) },
        ],
      },
      {
        duration: intervalLow * 1000,
        callbacks: [
          {
            at: 0,
            callback: () => {
              document.body.classList.remove('hot');
              update('cool down');
            },
          },
          { at: intervalLow * 1000 - 3000, callback: playStartSound },
          {
            callback: () => {
              setTimeout(() => {
                counter++;
                nextTick();
              }, 1000);
            },
          },
          ...(i === repetitions - 1
            ? [
                {
                  callback: () => {
                    clearTooltip();
                    updateControls('default', timer);
                  },
                },
              ]
            : []),
        ],
      }
    );
  }

  clearTooltip();
  updateControls('blank', timer);

  nextTick();
};

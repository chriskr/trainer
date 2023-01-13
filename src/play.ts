import { AppState, setAppState } from './appState';
import { playStartSound } from './playStartSound';
import Timer, { TimerConfig } from './timer';

export const play = (
  repetitions: number,
  intervalHigh: number,
  intervalLow: number,
  timer: Timer,
  updateControls: (state: AppState, timer: Timer) => void
) => {
  const startAfter = 5000;

  const updateInfo = (repetions: number, interval: string) => {
    (
      document.querySelector('#rounds') as HTMLSpanElement
    ).textContent = `round: ${repetitions} ${interval}`;
  };
  const intervals: TimerConfig[] = [
    {
      duration: startAfter,
      isUpdateDisplay: false,
      callbacks: [
        { at: startAfter - 3000, callback: playStartSound },
        {
          callback: () => {
            //updateInfo(repetitions, 'go intense');
            nextTick();
          },
        },
      ],
    },
  ];

  const nextRound = () => {
    setTimeout(() => {
      repetitions -= 1;
      nextTick();
    }, 1000);
  };

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
            callback: () => updateInfo(repetitions, 'go intense'),
          },
          { at: intervalHigh * 1000 - 3000, callback: playStartSound },
          { callback: () => setTimeout(nextTick, 1000) },
        ],
      },
      {
        duration: intervalLow * 1000,
        callbacks: [
          { at: 0, callback: () => updateInfo(repetitions, 'cool down') },
          { at: intervalLow * 1000 - 3000, callback: playStartSound },
          { callback: nextRound },
          ...(i === repetitions - 1
            ? [
                {
                  callback: () => {
                    updateControls('default', timer);
                  },
                },
              ]
            : []),
        ],
      }
    );
  }

  updateControls('running', timer);

  nextTick();
};

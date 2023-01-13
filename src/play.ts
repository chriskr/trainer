import { playStartSound } from './playStartSound';
import Timer, { TimerConfig } from './timer';

export const play = async (
  repetitions: number,
  intervalHigh: number,
  intervalLow: number,
  timer: Timer
) => {
  const startAfter = 5000;

  const intervals: TimerConfig[] = [
    {
      duration: startAfter,
      isUpdateDisplay: false,
      callbacks: [
        { at: startAfter - 3000, callback: playStartSound },
        {
          callback: () => {
            (
              document.querySelector('#rounds') as HTMLSpanElement
            ).textContent = `round: ${repetitions}`;
            nextTick();
          },
        },
      ],
    },
  ];

  const nextRound = () => {
    setTimeout(() => {
      repetitions -= 1;
      (
        document.querySelector('#rounds') as HTMLSpanElement
      ).textContent = `round: ${repetitions}`;

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
          { at: intervalHigh * 1000 - 3000, callback: playStartSound },
          { callback: () => setTimeout(nextTick, 1000) },
        ],
      },
      {
        duration: intervalLow * 1000,
        callbacks: [
          { at: intervalLow * 1000 - 3000, callback: playStartSound },
          { callback: nextRound },
        ],
      }
    );
  }

  nextTick();
};

import { playSound, Sound } from './sound';
import { Listener, render } from './uldu';
import './style.css';
import Timer, { TimerConfig } from './timer';

const sound1 = [
  600,
  'sinus',
  [
    [0.1, 1],
    [0.2, 0.7],
    [0.4, 0.7],
    [0.1, 0.000001],
  ],
] as Sound;

const sound2 = [
  1000,
  'sinus',
  [
    [0.1, 1],
    [0.2, 0.7],
    [0.4, 0.7],
    [0.1, 0.000001],
  ],
] as Sound;

const playStartSound = () => {
  playSound(sound1);
  setTimeout(() => playSound(sound1), 1000);
  setTimeout(() => playSound(sound1), 2000);
  setTimeout(() => playSound(sound2), 3000);
};

const runInterval = (intervals: TimerConfig[], timer: Timer) => {};

const play = async (
  repetions: number,
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
              document.querySelector('#repetitions')! as HTMLInputElement
            ).value = String(repetions);
            nextTick();
          },
        },
      ],
    },
  ];

  const nextRound = () => {
    setTimeout(() => {
      repetions -= 1;
      (document.querySelector('#repetitions')! as HTMLInputElement).value =
        String(repetions);

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

  for (let i = 0; i < repetions; i++) {
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

window.onload = () => {
  const templ = [
    'div',
    [
      'span',
      {
        id: 'start',
        class: 'material-icons main-controls',
        onClick: () => {
          const [repetitions, intense, cooldown] = [
            '#repetitions',
            '#intense',
            '#cooldown',
          ].map((selector) =>
            Number.parseInt(
              (document.querySelector(selector)! as HTMLInputElement).value,
              10
            )
          );
          play(repetitions, intense, cooldown, timer);
        },
      },
      'play_circle_filled',
    ],
    [
      'div',
      { id: 'controls' },
      [
        'label',
        'repetitions:',
        [
          'input',
          {
            type: 'number',
            id: 'repetitions',
            value: 5,
          },
        ],
      ],
      [
        'label',
        'intense:',
        [
          'input',
          {
            type: 'number',
            id: 'intense',
            value: 10,
          },
        ],
      ],
      [
        'label',
        'cool down:',
        [
          'input',
          {
            type: 'number',
            id: 'cooldown',
            value: 20,
          },
        ],
      ],
    ],
  ];

  render(templ, document.body);
  const timer = new Timer(
    ...(['#digits-minutes', '#digits-seconds'].map((selector) =>
      document.querySelector(selector)
    ) as [SVGGElement, SVGGElement])
  );
  /*
  timer.setConfig({
    duration: 5000,
    callbacks: [
      { at: 100, callback: () => console.log(1, Date.now()) },
      { at: 200, callback: () => console.log(2, Date.now()) },
      { at: 4950, callback: () => console.log(3, Date.now()) },
    ],
  });
  timer.start();
  setTimeout(() => timer.pause(), 1000);
  setTimeout(() => timer.resume(), 4000);
  */
};

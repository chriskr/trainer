import { playSound, Sound } from './sound';
import { Listener, render } from './uldu';
import './style.css';
import Timer from './timer';

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

const play = async (
  repetions: number,
  intense: number,
  cooldown: number,
  timer: Timer
) => {
  let isFist = true;
  while (repetions > 0) {
    if (isFist) {
      playStartSound();
      isFist = false;
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
    timer.setDuration(intense * 1000);
    timer.start(playStartSound, 3000);
    await new Promise((resolve) => setTimeout(resolve, (intense + 1) * 1000));
    timer.setDuration(cooldown * 1000);
    timer.start(playStartSound, 3000);
    await new Promise((resolve) => setTimeout(resolve, (cooldown + 1) * 1000));
    repetions -= 1;
    (document.querySelector('#repetitions')! as HTMLInputElement).value =
      String(repetions);
  }
};

window.onload = () => {
  const templ = [
    'div',
    [
      'button',
      {
        id: 'start',
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
          //timer.setDuration(5000);
          //timer.start(() => console.log('>>>>>>>>>>>>>>>>>'));
        },
      },
      'start',
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
            value: 60,
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
            value: 120,
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
};

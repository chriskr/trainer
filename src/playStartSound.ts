import { playSound, Sound } from './sound';

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

export const playStartSound = () => {
  playSound(sound1);
  setTimeout(() => playSound(sound1), 1000);
  setTimeout(() => playSound(sound1), 2000);
  setTimeout(() => playSound(sound2), 3000);
};

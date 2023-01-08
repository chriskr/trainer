type Ramps = [time: number, level: number][];
type SoundType = 'sinus' | 'square' | 'triangle' | 'sawtooth';

export type Sound = [frequency: number, type: SoundType, ramps: Ramps];

let context: AudioContext | null = null;
let gainNode: GainNode | null = null;
let oscillator: OscillatorNode | null = null;

const getPrimites = () => {
  if (!context) {
    context = new AudioContext();
  }
  if (!gainNode) {
    gainNode = context.createGain();
    gainNode.connect(context.destination);
  }
  if (!oscillator) {
    oscillator = context.createOscillator();
    oscillator.connect(gainNode);
    oscillator.start(0);
  }

  return { context, gainNode, oscillator };
};

export const playSound = ([frequency, type, ramps]: Sound) => {
  const { gainNode, context, oscillator } = getPrimites();
  gainNode.gain.cancelScheduledValues(context.currentTime);
  oscillator.frequency.value = frequency;
  gainNode.gain.setValueAtTime(0, context.currentTime);
  let time = 0;
  for (const [duration, level] of ramps) {
    setTimeout(
      () =>
        gainNode.gain.linearRampToValueAtTime(
          level,
          context.currentTime + duration
        ),
      time
    );
    time += duration * 1000;
  }
};

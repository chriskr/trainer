export type TrainingConfig = {
  repetitions: number;
  intervalHigh: number;
  intervalLow: number;
  intenseColor: string;
  cooldownColor: string;
};

export const defaultTrainingConfig: TrainingConfig = {
  repetitions: 5,
  intervalHigh: 60,
  intervalLow: 120,
  intenseColor: 'red',
  cooldownColor: 'blue',
};

export type TimerConfig = {
  id: string;
  initialDuration: number;
  title: string;
};

export type TimerType = {
  id: string;
  numIterations: number;
  timerConfigs: TimerConfig[];
  title: string;
};

export type TimerInterval = {
  id: string;
  duration: number;
  title: string;
};

export type TimerType = {
  id: string;
  numIterations: number;
  timerIntervals: TimerInterval[];
  title: string;
};

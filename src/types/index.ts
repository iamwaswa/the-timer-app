export type TimerInterval = {
  id: string;
  duration: number;
  title: string;
};

export type TimerIntervalReducerStateAnimationToggle = 0 | 1;

export type TimerIntervalReducerState = {
  animationToggle: TimerIntervalReducerStateAnimationToggle;
  duration: number;
  status: "idle" | "playing";
};

export type TimerIntervalReducerPauseAction = {
  type: "pause";
};

export type TimerIntervalReducerResetAction = {
  payload: {
    duration: number;
  };
  type: "reset";
};

export type TimerIntervalReducerRestartAction = {
  payload: {
    duration: number;
  };
  type: "restart";
};

export type TimerIntervalReducerAction =
  | {
      type: "decrement-duration";
    }
  | TimerIntervalReducerPauseAction
  | {
      type: "play";
    }
  | TimerIntervalReducerResetAction
  | TimerIntervalReducerRestartAction;

export type TimerType = {
  id: string;
  numIterations: number;
  timerIntervals: TimerInterval[];
  title: string;
};

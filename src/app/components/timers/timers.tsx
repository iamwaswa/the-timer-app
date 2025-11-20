"use client";

import { type TimerConfig, Timer, useTimers } from "@/app/components";

type TimersProps = {
  numIterations: number;
  timerConfigs: TimerConfig[];
};

export function Timers({ numIterations, timerConfigs }: TimersProps) {
  const { numIterationsLeft, timerConfigIndex, onTimerFinished } = useTimers(
    numIterations,
    timerConfigs
  );

  return (
    <Timer
      key={timerConfigs[timerConfigIndex].id}
      shouldStartPlaying={
        timerConfigIndex > 0 ||
        (timerConfigIndex === 0 &&
          numIterationsLeft > 0 &&
          numIterationsLeft !== numIterations)
      }
      timerConfig={timerConfigs[timerConfigIndex]}
      onTimerFinished={onTimerFinished}
    />
  );
}

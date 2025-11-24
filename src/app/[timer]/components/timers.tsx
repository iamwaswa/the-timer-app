"use client";

import type { TimerConfig } from "@/types";
import { Timer } from "./timer";
import { useTimers } from "./timers.hook";

type TimersProps = {
  numIterations: number;
  timerConfigs: TimerConfig[];
};

export function Timers({ numIterations, timerConfigs }: TimersProps) {
  const {
    nextTimerConfigIndex,
    numIterationsLeft,
    timerConfigIndex,
    onTimerFinished,
  } = useTimers(numIterations, timerConfigs);

  return (
    <Timer
      key={timerConfigs[timerConfigIndex].id}
      nextTimerConfig={timerConfigs[nextTimerConfigIndex]}
      shouldShowNextTimer={
        (numIterationsLeft === 1 &&
          timerConfigIndex !== timerConfigs.length - 1) ||
        numIterationsLeft > 1
      }
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

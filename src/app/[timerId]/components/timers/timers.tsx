"use client";

import { useSequentialTimerIntervals } from "@/hooks";
import type { TimerInterval } from "@/types";

import { Timer } from "../timer";

type TimersProps = {
  numIterations: number;
  timerConfigs: TimerInterval[];
};

export function Timers({ numIterations, timerConfigs }: TimersProps) {
  const {
    nextTimerIntervalIndex: nextTimerConfigIndex,
    numIterationsLeft,
    currentTimerIntervalIndex: timerConfigIndex,
    onResetAll,
    onTimerFinished,
  } = useSequentialTimerIntervals(numIterations, timerConfigs);

  return (
    <Timer
      key={timerConfigs[timerConfigIndex].id}
      nextTimerConfig={timerConfigs[nextTimerConfigIndex]}
      shouldShowNextTimer={
        (numIterationsLeft === 1 && timerConfigIndex !== timerConfigs.length - 1) || numIterationsLeft > 1
      }
      shouldStartPlaying={
        timerConfigIndex > 0 || (timerConfigIndex === 0 && numIterationsLeft > 0 && numIterationsLeft !== numIterations)
      }
      timerConfig={timerConfigs[timerConfigIndex]}
      onResetAll={timerConfigIndex > 0 ? onResetAll : undefined}
      onTimerFinished={onTimerFinished}
    />
  );
}

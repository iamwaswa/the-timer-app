"use client";

import { useSequentialTimerIntervals } from "@/hooks";
import type { TimerInterval } from "@/types";

import { Timer } from "../timer";

type TimersProps = {
  numIterations: number;
  timerIntervals: TimerInterval[];
};

export function Timers({ numIterations, timerIntervals }: TimersProps) {
  const { nextTimerIntervalIndex, numIterationsLeft, currentTimerIntervalIndex, onResetAll, onTimerFinished } =
    useSequentialTimerIntervals(numIterations, timerIntervals);

  return (
    <Timer
      key={timerIntervals[currentTimerIntervalIndex].id}
      nextTimerInterval={timerIntervals[nextTimerIntervalIndex]}
      shouldShowNextTimer={
        (numIterationsLeft === 1 && currentTimerIntervalIndex !== timerIntervals.length - 1) || numIterationsLeft > 1
      }
      shouldStartPlaying={
        currentTimerIntervalIndex > 0 ||
        (currentTimerIntervalIndex === 0 && numIterationsLeft > 0 && numIterationsLeft !== numIterations)
      }
      timerInterval={timerIntervals[currentTimerIntervalIndex]}
      onResetAll={currentTimerIntervalIndex > 0 ? onResetAll : undefined}
      onTimerFinished={onTimerFinished}
    />
  );
}

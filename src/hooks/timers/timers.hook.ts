"use client";

import { useCallback, useState } from "react";

import type { TimerConfig } from "@/types";

export function useTimers(numIterations: number, timerConfigs: TimerConfig[]) {
  const [numIterationsLeft, setNumIterationsLeft] = useState<number>(numIterations);
  const [timerConfigIndex, setTimerConfigIndex] = useState<number>(0);

  const onTimerFinished = useCallback(() => {
    if (numIterationsLeft > 0) {
      setTimerConfigIndex((index) => (index + 1) % timerConfigs.length);
      setNumIterationsLeft((iterationsLeft) =>
        timerConfigIndex === timerConfigs.length - 1 ? iterationsLeft - 1 : iterationsLeft,
      );
    }
  }, [numIterationsLeft, timerConfigIndex, timerConfigs]);

  return {
    nextTimerConfigIndex: (timerConfigIndex + 1) % timerConfigs.length,
    numIterationsLeft,
    timerConfigIndex,
    onTimerFinished,
  };
}

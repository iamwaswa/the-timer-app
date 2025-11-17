"use client";

import { useCallback, useState } from "react";
import { type TimerConfig, Timer } from "@/app/components";

type TimersProps = {
  numIterations: number;
  timerConfigs: TimerConfig[];
};

export function Timers({ numIterations, timerConfigs }: TimersProps) {
  const [numIterationsLeft, setNumIterationsLeft] =
    useState<number>(numIterations);
  const [timerConfigIndex, setTimerConfigIndex] = useState<number>(0);

  const onTimerFinished = useCallback(() => {
    if (numIterationsLeft > 0) {
      setTimerConfigIndex((index) => (index + 1) % timerConfigs.length);
      setNumIterationsLeft((iterationsLeft) =>
        timerConfigIndex === timerConfigs.length - 1
          ? iterationsLeft - 1
          : iterationsLeft
      );
    }
  }, [numIterationsLeft, timerConfigIndex, timerConfigs]);

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

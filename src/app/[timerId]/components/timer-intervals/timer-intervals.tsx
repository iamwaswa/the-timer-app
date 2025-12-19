"use client";

import { Alert, Slide, Snackbar, Typography } from "@mui/material";

import { useSequentialTimerIntervals } from "@/hooks";
import type { TimerInterval } from "@/types";

import { SequentialTimerInterval } from "../sequential-timer-interval";

type TimerIntervalsProps = {
  numIterations: number;
  timerIntervals: TimerInterval[];
};

export function TimerIntervals({ numIterations, timerIntervals }: TimerIntervalsProps) {
  const { nextTimerIntervalIndex, numIterationsLeft, currentTimerIntervalIndex, onResetAll, onTimerFinished } =
    useSequentialTimerIntervals(numIterations, timerIntervals);

  const nextTimerInterval = timerIntervals[nextTimerIntervalIndex];

  const shouldShowNextTimer =
    (numIterationsLeft === 1 && currentTimerIntervalIndex !== timerIntervals.length - 1) || numIterationsLeft > 1;

  return (
    <>
      <SequentialTimerInterval
        key={timerIntervals[currentTimerIntervalIndex].id}
        shouldStartPlaying={
          currentTimerIntervalIndex > 0 ||
          (currentTimerIntervalIndex === 0 && numIterationsLeft > 0 && numIterationsLeft !== numIterations)
        }
        timerInterval={timerIntervals[currentTimerIntervalIndex]}
        onResetAll={currentTimerIntervalIndex > 0 ? onResetAll : undefined}
        onTimerFinished={onTimerFinished}
      />
      <Snackbar
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        open={shouldShowNextTimer}
        slots={{
          transition: (props) => <Slide {...props} direction="left" />,
        }}
      >
        <Alert variant="filled" severity="info">
          <Typography>Up next: {nextTimerInterval.title}</Typography>
        </Alert>
      </Snackbar>
    </>
  );
}

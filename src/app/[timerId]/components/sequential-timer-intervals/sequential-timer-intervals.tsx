"use client";

import { Alert, Slide, Snackbar, Typography } from "@mui/material";

import { useSequentialTimerIntervals } from "@/hooks";
import type { TimerInterval } from "@/types";

import { SequentialTimerInterval } from "../sequential-timer-interval";

type SequentialTimerIntervalsProps = {
  numIterations: number;
  timerIntervals: TimerInterval[];
};

export function SequentialTimerIntervals({ numIterations, timerIntervals }: SequentialTimerIntervalsProps) {
  const { currentBackgroundColor, currentTimerInterval, nextTimerInterval, advanceSequence, resetSequence } =
    useSequentialTimerIntervals(numIterations, timerIntervals);

  return (
    <>
      <SequentialTimerInterval
        backgroundColor={currentBackgroundColor}
        timerInterval={currentTimerInterval}
        onDurationComplete={() => {
          const timerInterval = advanceSequence();

          return timerInterval === null
            ? { type: "pause" }
            : {
                payload: {
                  duration: timerInterval.duration,
                },
                type: "restart",
              };
        }}
        resetTimerInterval={resetSequence}
      />
      {nextTimerInterval && (
        <Snackbar
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          open={true}
          slots={{
            transition: (props) => <Slide {...props} direction="left" />,
          }}
        >
          <Alert variant="standard" severity="info">
            <Typography>Up next: {nextTimerInterval.title}</Typography>
          </Alert>
        </Snackbar>
      )}
    </>
  );
}

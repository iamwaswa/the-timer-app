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
  const { currentTimerInterval, nextTimerInterval, onAdvanceSequence, onResetSequence } = useSequentialTimerIntervals(
    numIterations,
    timerIntervals,
  );

  return (
    <>
      <SequentialTimerInterval
        timerInterval={currentTimerInterval}
        onAdvanceSequence={onAdvanceSequence}
        onResetSequence={onResetSequence}
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

"use client";

import { type Breakpoint, Grid } from "@mui/material";
import { useGetTimers } from "@/hooks";
import { TimerLink } from "../timer-link";
import { AddNewTimer } from "../add-new-timer";
import { useState } from "react";

type TimersProps = {
  singleColumnBreakpoint: Breakpoint;
};

export function Timers({ singleColumnBreakpoint }: TimersProps) {
  const timers = useGetTimers();
  const [minItemHeight, setMinItemHeight] = useState<number | null>(null);

  return (
    <>
      {timers.map((timer) => (
        <Grid
          key={timer.id}
          ref={(grid) => {
            const height = grid?.getBoundingClientRect().height;
            setMinItemHeight((currentMinHeight) =>
              height !== undefined &&
              (currentMinHeight === null || height < currentMinHeight)
                ? height
                : currentMinHeight
            );
          }}
          size={1}
        >
          <TimerLink timer={timer} />
        </Grid>
      ))}
      <Grid size={1}>
        <AddNewTimer
          singleColumnBreakpoint={singleColumnBreakpoint}
          minHeight={minItemHeight}
        />
      </Grid>
    </>
  );
}

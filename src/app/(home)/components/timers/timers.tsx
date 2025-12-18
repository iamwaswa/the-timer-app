"use client";

import { Grid } from "@mui/material";
import dynamic from "next/dynamic";

import { useGetTimersContext } from "@/context";
import { useGetItemHeight } from "@/hooks";

import { AddNewTimer } from "../add-new-timer";
import { TimerLink } from "../timer-link";

type TimersProps = {
  parentElementId: string;
};

export const TimersClientOnlyComponent = dynamic(() => Promise.resolve(Timers), {
  ssr: false,
});

export function Timers({ parentElementId }: TimersProps) {
  const timers = useGetTimersContext();
  const itemHeight = useGetItemHeight(parentElementId);

  return (
    <>
      {timers.map((timer) => (
        <Grid key={timer.id} size={1}>
          <TimerLink timer={timer} />
        </Grid>
      ))}
      <Grid size={1}>
        <AddNewTimer itemHeight={itemHeight} />
      </Grid>
    </>
  );
}

"use client";

import { Grid } from "@mui/material";
import { useGetTimers } from "@/hooks";
import { TimerLink } from "./components";

export default function Home() {
  const timers = useGetTimers();

  return timers.length ? (
    <Grid
      columns={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 6 }}
      container={true}
      spacing={2}
      padding={2}
    >
      {timers.map((timer) => (
        <TimerLink key={timer.id} timer={timer} />
      ))}
    </Grid>
  ) : null;
}

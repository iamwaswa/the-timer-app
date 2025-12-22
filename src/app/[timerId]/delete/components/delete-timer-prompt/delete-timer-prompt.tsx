"use client";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import Link from "next/link";

import type { Timer } from "@/types";

type DeleteTimerPromptProps = {
  timer: Timer;
  timers: Timer[];
  setTimers(timers: Timer[]): void;
};

export function DeleteTimerPrompt({ timer, timers, setTimers }: DeleteTimerPromptProps) {
  return (
    <Dialog open={true}>
      <DialogTitle>{timer.title}</DialogTitle>
      <DialogContent>Are you sure you want to delete this timer?</DialogContent>
      <DialogActions>
        <Button href="/" LinkComponent={Link}>
          Cancel
        </Button>
        <Button
          color="error"
          onClick={() => {
            setTimers(timers.filter((existingTimer) => existingTimer.id !== timer.id));
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

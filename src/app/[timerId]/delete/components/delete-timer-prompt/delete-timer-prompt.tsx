"use client";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import Link from "next/link";
import { redirect } from "next/navigation";

import type { TimerType } from "@/types";

type DeleteTimerPromptProps = {
  timersKey: string;
  timer: TimerType;
  timers: TimerType[];
};

export function DeleteTimerPrompt({ timer, timers, timersKey }: DeleteTimerPromptProps) {
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
            localStorage.setItem(
              timersKey,
              JSON.stringify(timers.filter((existingTimer) => existingTimer.id !== timer.id)),
            );
            redirect("/");
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

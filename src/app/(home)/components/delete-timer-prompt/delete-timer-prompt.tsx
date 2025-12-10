"use client";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { useGetTimers } from "@/hooks";
import { TimerType } from "@/types";

type DeleteTimerPromptProps = {
  timer: TimerType;
};

export function DeleteTimerPrompt({ timer }: DeleteTimerPromptProps) {
  const [timers, key] = useGetTimers();
  const searchParams = useSearchParams();
  const open = useMemo(() => {
    return searchParams.get("delete") === timer.id;
  }, [searchParams, timer]);

  return (
    <Dialog open={open}>
      <DialogTitle>{timer.title}</DialogTitle>
      <DialogContent>Are you sure you want to delete this timer?</DialogContent>
      <DialogActions>
        <Button href="/" LinkComponent={Link}>
          Cancel
        </Button>
        <Button
          color="error"
          onClick={() => {
            localStorage.setItem(key, JSON.stringify(timers.filter((existingTimer) => existingTimer.id !== timer.id)));
            redirect("/");
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

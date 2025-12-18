"use client";

import { Box, Button, TextField } from "@mui/material";

import type { TimerInterval } from "@/types";
import { generateRandomUUID } from "@/utils";

type TimerIntervalFormFieldsProps = {
  timerIntervals: TimerInterval[];
  updateTimerIntervals(updatedTimerIntervals: TimerInterval[]): void;
};

export function TimerIntervalFormFields({ timerIntervals, updateTimerIntervals }: TimerIntervalFormFieldsProps) {
  const hasSingleTimerInterval = timerIntervals.length === 1;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {timerIntervals.map((timerIntervalEntry) => (
          <Box key={timerIntervalEntry.id} sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <TextField
              label="Title"
              required={true}
              sx={{ flexGrow: 1 }}
              type="text"
              variant="outlined"
              value={timerIntervalEntry.title}
              onChange={(event) =>
                updateTimerIntervals(
                  timerIntervals.map((timerInterval) =>
                    timerIntervalEntry.id === timerInterval.id
                      ? { ...timerInterval, title: event.currentTarget.value }
                      : timerInterval,
                  ),
                )
              }
            />
            <TextField
              label="Initial Duration (seconds)"
              required={true}
              sx={{ flexGrow: 1 }}
              type="number"
              variant="outlined"
              value={timerIntervalEntry.duration}
              onChange={(event) =>
                updateTimerIntervals(
                  timerIntervals.map((timerInterval) =>
                    timerInterval.id === timerIntervalEntry.id
                      ? {
                          ...timerInterval,
                          duration: Number(event.currentTarget.value),
                        }
                      : timerInterval,
                  ),
                )
              }
            />
            <Button
              disabled={hasSingleTimerInterval}
              type="button"
              variant="text"
              onClick={() =>
                updateTimerIntervals(
                  timerIntervals.filter((timerInterval) => timerInterval.id !== timerIntervalEntry.id),
                )
              }
            >
              Delete timer
            </Button>
          </Box>
        ))}
      </Box>
      <Button
        type="button"
        variant="outlined"
        onClick={() =>
          updateTimerIntervals([
            ...timerIntervals,
            {
              id: generateRandomUUID(),
              duration: 60,
              title: "New interval",
            },
          ])
        }
      >
        Add Timer
      </Button>
    </Box>
  );
}

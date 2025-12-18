"use client";

import { Box, Button, TextField } from "@mui/material";
import { redirect } from "next/navigation";

import { TimerIntervalFormFields } from "@/components";
import { useTimerForm } from "@/hooks";
import type { TimerType } from "@/types";

type TimerFormProps = {
  timer?: TimerType;
};

export function TimerForm({ timer }: TimerFormProps) {
  const [timerForm, timerFormActions] = useTimerForm(timer);

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
      onSubmit={(event) => {
        event.preventDefault();
        timerFormActions.save();
        redirect("/");
      }}
    >
      <Box
        component="fieldset"
        sx={{
          border: "none",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          margin: 0,
          padding: 0,
        }}
      >
        <TextField
          label="Title"
          required={true}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          type="text"
          value={timerForm.title}
          onChange={(event) => timerFormActions.updateTitle(event.currentTarget.value)}
          variant="outlined"
        />
        <TextField
          label="Number of iterations"
          required={true}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          type="number"
          value={timerForm.numIterations}
          onChange={(event) => timerFormActions.updateNumIterations(Number(event.currentTarget.value))}
          variant="outlined"
        />
        <TimerIntervalFormFields
          timerIntervals={timerForm.timerIntervals}
          updateTimerIntervals={timerFormActions.updateTimerIntervals}
        />
      </Box>
      <Button sx={{ alignSelf: "flex-end" }} type="submit" variant="contained" color="primary">
        {timer ? "Update" : "Create"} Timer
      </Button>
    </Box>
  );
}

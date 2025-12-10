"use client";

import { Box, Button, TextField } from "@mui/material";
import { redirect } from "next/navigation";

import { useCreateTimerForm } from "@/hooks";

import { Timers } from "../timers";

export function CreateTimerForm() {
  const [createTimerForm, createTimerFormActions] = useCreateTimerForm();

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
        createTimerFormActions.save();
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
          value={createTimerForm.title}
          onChange={(event) => createTimerFormActions.updateTitle(event.currentTarget.value)}
          variant="outlined"
        />
        <TextField
          label="Number of iterations"
          required={true}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          type="number"
          value={createTimerForm.numIterations}
          onChange={(event) => createTimerFormActions.updateNumIterations(Number(event.currentTarget.value))}
          variant="outlined"
        />
        <Timers
          timerConfigs={createTimerForm.timerConfigs}
          updateTimerConfigs={createTimerFormActions.updateTimerConfigs}
        />
      </Box>
      <Button sx={{ alignSelf: "flex-end" }} type="submit" variant="contained" color="primary">
        Create Timer
      </Button>
    </Box>
  );
}

"use client";

import { Box, Typography } from "@mui/material";
import { notFound, useParams } from "next/navigation";

import { TimerForm } from "@/components";
import { useGetTimers } from "@/hooks";

type EditTimerPageParams = {
  timerId: string;
};

export default function EditTimerPage() {
  const [timers] = useGetTimers();
  const { timerId } = useParams<EditTimerPageParams>();
  const timer = timers.find((t) => t.id === timerId);

  if (!timer) {
    return notFound();
  }

  return (
    <Box sx={{ maxWidth: "sm", mx: "auto", mt: 8, padding: 2 }}>
      <Typography component="h1" typography="h4" sx={{ mb: 2 }}>
        Edit Timer
      </Typography>
      <TimerForm timer={timer} />
    </Box>
  );
}

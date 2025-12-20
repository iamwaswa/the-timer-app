"use client";

import { Box } from "@mui/material";
import type { Property } from "csstype";
import { useState } from "react";

import { usePlayCountdownBeep, useSequentialTimerInterval } from "@/hooks";
import type { TimerInterval } from "@/types";
import { formatDuration, pickTimerIntervalBackgroundColor } from "@/utils";

import { TimerActions } from "../timer-actions";
import { TimerDuration } from "../timer-duration";
import { TimerTitle } from "../timer-title";

type SequentualTimerIntervalProps = {
  timerInterval: TimerInterval;
  onAdvanceSequence(): TimerInterval | null;
  onResetSequence(): TimerInterval;
};

export function SequentialTimerInterval({
  timerInterval,
  onAdvanceSequence,
  onResetSequence,
}: SequentualTimerIntervalProps) {
  const [timerIntervalBackgroundColor] = useState<Property.BackgroundColor>(pickTimerIntervalBackgroundColor);

  const { animationToggle, duration, status, pause, play, reset, resetAll, restart } = useSequentialTimerInterval(
    timerInterval,
    onAdvanceSequence,
    onResetSequence,
  );

  usePlayCountdownBeep(duration, status === "playing");

  return (
    <Box
      sx={{
        alignItems: "center",
        backgroundColor: timerIntervalBackgroundColor,
        boxShadow: `inset 0 0 0 9999px rgba(0, 0, 0, 0.3)`,
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Box
        key={`${timerInterval.id}-${animationToggle}`}
        sx={{
          "@keyframes shift-left-to-right": {
            to: { transform: "translateX(0%)" },
          },
          animation: `shift-left-to-right ${timerInterval.duration}s linear forwards`,
          animationPlayState: status === "playing" ? "running" : "paused",
          backgroundColor: timerIntervalBackgroundColor,
          height: "100%",
          left: 0,
          opacity: 0.25,
          pointerEvents: "none",
          position: "absolute",
          top: 0,
          transform: "translateX(-100%)",
          width: "100%",
          willChange: "transform",
        }}
      />
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <TimerDuration backgroundColor={timerIntervalBackgroundColor}>{formatDuration(duration)}</TimerDuration>
          <TimerTitle backgroundColor={timerIntervalBackgroundColor}>{timerInterval.title}</TimerTitle>
        </Box>
        <TimerActions
          backgroundColor={timerIntervalBackgroundColor}
          isPlaying={status === "playing"}
          pause={pause}
          play={play}
          reset={reset}
          resetAll={resetAll}
          restart={restart}
        />
      </Box>
    </Box>
  );
}

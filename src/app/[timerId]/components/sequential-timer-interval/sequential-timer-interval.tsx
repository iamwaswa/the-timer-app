"use client";

import { Box } from "@mui/material";
import type { Property } from "csstype";

import { usePlayCountdownBeep, useSequentialTimerInterval } from "@/hooks";
import type { TimerInterval, TimerIntervalReducerPauseAction, TimerIntervalReducerRestartAction } from "@/types";
import { formatDuration } from "@/utils";

import { TimerActions } from "../timer-actions";
import { TimerDuration } from "../timer-duration";
import { TimerTitle } from "../timer-title";

type SequentualTimerIntervalProps = {
  backgroundColor: Property.BackgroundColor;
  timerInterval: TimerInterval;
  onDurationComplete(): TimerIntervalReducerPauseAction | TimerIntervalReducerRestartAction;
  resetTimerInterval(): TimerInterval;
};

export function SequentialTimerInterval({
  backgroundColor,
  timerInterval,
  onDurationComplete,
  resetTimerInterval,
}: SequentualTimerIntervalProps) {
  const { animationToggle, duration, status, pause, play, reset, restart } = useSequentialTimerInterval(
    timerInterval,
    onDurationComplete,
  );

  usePlayCountdownBeep(duration, status === "playing");

  return (
    <Box
      sx={{
        alignItems: "center",
        backgroundColor,
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
          backgroundColor,
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
          <TimerDuration backgroundColor={backgroundColor}>{formatDuration(duration)}</TimerDuration>
          <TimerTitle backgroundColor={backgroundColor}>{timerInterval.title}</TimerTitle>
        </Box>
        <TimerActions
          backgroundColor={backgroundColor}
          isPlaying={status === "playing"}
          pause={pause}
          play={play}
          reset={() => {
            reset();
          }}
          resetAll={() => {
            const updatedTimerInterval = resetTimerInterval();
            reset(updatedTimerInterval);
          }}
          restart={() => {
            restart();
          }}
        />
      </Box>
    </Box>
  );
}

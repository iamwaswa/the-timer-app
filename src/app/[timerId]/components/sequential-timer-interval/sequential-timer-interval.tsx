"use client";

import { Box } from "@mui/material";
import { useEffect } from "react";

import { usePlayCountdownBeep, useTimerInterval } from "@/hooks";
import type { TimerInterval } from "@/types";
import { formatDuration, pickTimerColor } from "@/utils";

import { TimerActions } from "../timer-actions";
import { TimerDuration } from "../timer-duration";
import { TimerTitle } from "../timer-title";

type SequentualTimerIntervalProps = {
  shouldStartPlaying: boolean;
  timerInterval: TimerInterval;
  onResetAll: (() => void) | undefined;
  onTimerFinished(): void;
};

export function SequentialTimerInterval({
  shouldStartPlaying,
  timerInterval,
  onResetAll,
  onTimerFinished,
}: SequentualTimerIntervalProps) {
  const { duration, isFinished, isPlaying, resetOrRestartToggle, pause, play, reset, restart } = useTimerInterval(
    timerInterval,
    shouldStartPlaying,
  );

  usePlayCountdownBeep(duration, isPlaying);

  useEffect(() => {
    if (isFinished) {
      onTimerFinished();
    } else {
      return;
    }
  }, [isFinished, onTimerFinished]);

  const backgroundColor = pickTimerColor();

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
        key={String(resetOrRestartToggle)}
        sx={{
          "@keyframes timer-move": {
            "0%": { transform: "translateX(-100%)" },
            "100%": { transform: "translateX(0%)" },
          },
          animation: `timer-move ${timerInterval.duration}s linear forwards`,
          animationPlayState: isPlaying ? "running" : "paused",
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
          isPlaying={isPlaying}
          pause={pause}
          play={play}
          reset={reset}
          resetAll={onResetAll}
          restart={restart}
        />
      </Box>
    </Box>
  );
}

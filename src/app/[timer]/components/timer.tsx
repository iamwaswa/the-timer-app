"use client";

import { Alert, Box, Slide, Snackbar, Typography } from "@mui/material";
import type { TimerConfig } from "@/types";
import { useEffect } from "react";
import { formatDuration } from "./format-duration.util";
import { pickTimerColor } from "./pick-timer-color.util";
import { TimerActions } from "./timer-actions";
import { TimerDuration } from "./timer-duration";
import { TimerTitle } from "./timer-title";
import { useTimer } from "./timer.hook";

type TimerProps = {
  nextTimerConfig: TimerConfig;
  shouldStartPlaying: boolean;
  shouldShowNextTimer: boolean;
  timerConfig: TimerConfig;
  onTimerFinished(): void;
};

export function Timer({
  nextTimerConfig,
  shouldShowNextTimer,
  shouldStartPlaying,
  timerConfig,
  onTimerFinished,
}: TimerProps) {
  const {
    duration,
    isFinished,
    isPlaying,
    resetOrRestartToggle,
    pause,
    play,
    reset,
    restart,
  } = useTimer(timerConfig, shouldStartPlaying);

  useEffect(() => {
    if (isFinished) {
      onTimerFinished();
    }
  }, [isFinished, onTimerFinished]);

  const backgroundColor = pickTimerColor();

  return (
    <>
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
            animation: `timer-move ${timerConfig.initialDuration}s linear forwards`,
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
            <TimerDuration backgroundColor={backgroundColor}>
              {formatDuration(duration)}
            </TimerDuration>
            <TimerTitle backgroundColor={backgroundColor}>
              {timerConfig.title}
            </TimerTitle>
          </Box>
          <TimerActions
            backgroundColor={backgroundColor}
            isPlaying={isPlaying}
            pause={pause}
            play={play}
            reset={reset}
            restart={restart}
          />
        </Box>
      </Box>
      <Snackbar
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        open={shouldShowNextTimer}
        slots={{
          transition: (props) => <Slide {...props} direction="left" />,
        }}
      >
        <Alert variant="filled" severity="info">
          <Typography>Up next: {nextTimerConfig.title}</Typography>
        </Alert>
      </Snackbar>
    </>
  );
}

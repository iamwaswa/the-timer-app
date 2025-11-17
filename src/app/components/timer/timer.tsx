import { Box } from "@mui/material";
import type { Property } from "csstype";
import {
  formatDuration,
  TimerActions,
  TimerDuration,
  TimerTitle,
} from "@/app/components";

type TimerProps = {
  backgroundColor: Property.BackgroundColor;
  duration: number;
  initialDuration: number;
  isPlaying: boolean;
  resetOrRestartToggle: boolean;
  title: string;
  pause(): void;
  play(): void;
  reset(): void;
  restart(): void;
};

export function Timer({
  backgroundColor,
  duration,
  initialDuration,
  isPlaying,
  resetOrRestartToggle,
  title,
  pause,
  play,
  reset,
  restart,
}: TimerProps) {
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
          animation: `timer-move ${initialDuration}s linear forwards`,
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
          <TimerTitle backgroundColor={backgroundColor}>{title}</TimerTitle>
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
  );
}

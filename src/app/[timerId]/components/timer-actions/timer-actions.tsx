"use client";

import { Box, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { Property } from "csstype";

type TimerActionsProps = {
  backgroundColor: Property.BackgroundColor;
  isPlaying: boolean;
  pause(): void;
  play(): void;
  reset(): void;
  restart(): void;
};

export function TimerActions({ backgroundColor, isPlaying, pause, play, reset, restart }: TimerActionsProps) {
  const theme = useTheme();
  const color = theme.palette.getContrastText(String(backgroundColor));

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <Button sx={{ borderColor: color, color }} variant="outlined" onClick={reset}>
        Reset
      </Button>
      <Button sx={{ borderColor: color, color }} variant="outlined" onClick={isPlaying ? pause : play}>
        Play / Pause
      </Button>
      <Button sx={{ borderColor: color, color }} variant="outlined" onClick={restart}>
        Restart
      </Button>
    </Box>
  );
}

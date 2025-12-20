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
  resetAll(): void;
  restart(): void;
};

export function TimerActions({ backgroundColor, isPlaying, pause, play, reset, resetAll, restart }: TimerActionsProps) {
  const theme = useTheme();
  const color = theme.palette.getContrastText(String(backgroundColor));

  return (
    <Box
      sx={{
        alignItems: "stretch",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button sx={{ borderColor: color, color }} variant="outlined" onClick={reset}>
          Reset
        </Button>
        {!isPlaying && (
          <Button sx={{ borderColor: color, color }} variant="outlined" onClick={play}>
            Play
          </Button>
        )}
        {isPlaying && (
          <Button sx={{ borderColor: color, color }} variant="outlined" onClick={pause}>
            Pause
          </Button>
        )}
        <Button sx={{ borderColor: color, color }} variant="outlined" onClick={restart}>
          Restart
        </Button>
      </Box>
      <Button sx={{ borderColor: color, color }} variant="outlined" onClick={resetAll}>
        Reset All
      </Button>
    </Box>
  );
}

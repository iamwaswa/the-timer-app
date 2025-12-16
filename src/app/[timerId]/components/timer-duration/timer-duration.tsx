"use client";

import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { Property } from "csstype";
import type { ReactNode } from "react";

type TimerDurationProps = {
  backgroundColor: Property.BackgroundColor;
  children: ReactNode;
};

export function TimerDuration({ backgroundColor, children }: TimerDurationProps) {
  const theme = useTheme();
  const color = theme.palette.getContrastText(String(backgroundColor));

  return (
    <Typography variant="h1" sx={{ color }}>
      {children}
    </Typography>
  );
}

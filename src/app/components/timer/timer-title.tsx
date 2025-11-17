"use client";

import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { Property } from "csstype";
import type { ReactNode } from "react";

type TimerTitleProps = {
  backgroundColor: Property.BackgroundColor;
  children: ReactNode;
};

export function TimerTitle({ backgroundColor, children }: TimerTitleProps) {
  const theme = useTheme();
  const color = theme.palette.getContrastText(String(backgroundColor));

  return (
    <Typography variant="h2" sx={{ color }}>
      {children}
    </Typography>
  );
}

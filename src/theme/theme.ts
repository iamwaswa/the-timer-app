"use client";

import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          textTransform: "none",
        },
        text: {
          textTransform: "none",
        },
        outlined: {
          textTransform: "none",
        },
      },
    },
  },
  cssVariables: true,
  typography: {
    fontFamily: "var(--font-roboto)",
  },
});

"use client";

import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        text: {
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

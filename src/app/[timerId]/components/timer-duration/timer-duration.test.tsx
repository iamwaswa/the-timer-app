import { ThemeProvider } from "@mui/material";
import { render, screen } from "@testing-library/react";

import { theme } from "@/theme";

import { TimerDuration } from "./timer-duration";

it("should render as expected", () => {
  const text = "00:01:01";

  render(
    <ThemeProvider theme={theme}>
      <TimerDuration backgroundColor="rgb(255, 0, 0)">{text}</TimerDuration>
    </ThemeProvider>,
  );

  expect(screen.getByRole("heading", { level: 1, name: text })).toBeInTheDocument();
});

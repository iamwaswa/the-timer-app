import { ThemeProvider } from "@mui/material";
import { render, screen } from "@testing-library/react";

import { theme } from "@/theme";

import { TimerTitle } from "./timer-title";

it("should render as expected", () => {
  const text = "Title text";

  render(
    <ThemeProvider theme={theme}>
      <TimerTitle backgroundColor="rgb(255, 0, 0)">{text}</TimerTitle>
    </ThemeProvider>,
  );

  expect(screen.getByRole("heading", { level: 2, name: text })).toBeInTheDocument();
});
